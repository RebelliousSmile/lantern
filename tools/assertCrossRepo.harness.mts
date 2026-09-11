/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { BRUMES_BLOCKS } from '../../handbook/src/features/blocks/registry'
import { TOML_EXPORTS } from '../../handbook/src/features/blocks/tomlExports'
import { nodeDocumentContracts } from '../src/contracts/registry.node'

/*
 * The chain a Mist document actually has to survive: it is authored against the published schema,
 * exported by a Lantern template module, read by the Handbook's tolerant renderer, written back out
 * by the Handbook, and re-parsed by the same schema. Only the two ends are compared — what the
 * Handbook does in between is its own contract, not this harness's.
 */

type NormalizedCase = {
    target: string
    id: string
    file: string
    expect: 'accept' | 'reject'
    handbook?: string
}

type TemplateCodec = {
    importFromTOMLWithWarnings(source: string): Record<string, unknown>
    exportToTOML(document: never): string
}

const resolveLanternModule = (target: string) =>
    import(`../src/templates/${target}/toml.ts`) as Promise<TemplateCodec>

/* `city-of-mist/theme-kit` -> `cityOfMistThemeKit`, the key a Lantern module returns. */
const keyFor = (target: string) =>
    target
        .split(/[/-]/)
        .map((part, index) =>
            index === 0 ? part : part[0].toUpperCase() + part.slice(1)
        )
        .join('')

/*
 * The block id each Mist target renders as, copied from the Handbook's own
 * `assertMistContract.harness.mts`. The corpus manifest is the authority on which targets are
 * covered; this map only says which block reads a given target back, so a target the manifest
 * marks `handbook: 'render'` but this map does not know about is reported as a failure rather
 * than silently skipped.
 */
const HANDBOOK_RENDERERS: Record<string, string> = {
    'city-of-mist/danger': 'com-danger',
    'city-of-mist/theme-card': 'com-theme-card',
    'legend-in-the-mist/challenge': 'litm-challenge',
    'legend-in-the-mist/journey': 'litm-journey',
    'legend-in-the-mist/story-theme': 'theme-card',
    'legend-in-the-mist/theme-kit': 'litm-theme-kit',
    'otherscape/challenge': 'os-challenge',
    'otherscape/character-trope': 'os-character-trope',
    'otherscape/loadout-item': 'os-loadout-item',
    'otherscape/power-set': 'os-power-set',
    'otherscape/theme': 'os-theme',
    'otherscape/theme-kit': 'os-theme-kit',
}

type Delta = { path: string; before: unknown; after: unknown }

function collectDeltas(
    before: unknown,
    after: unknown,
    at = '',
    into: Delta[] = []
): Delta[] {
    const left = (before ?? {}) as Record<string, unknown>
    const right = (after ?? {}) as Record<string, unknown>
    for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
        const a = left[key]
        const b = right[key]
        const here = at ? `${at}.${key}` : key
        if (JSON.stringify(a) === JSON.stringify(b)) continue
        const bothPlain =
            a &&
            b &&
            typeof a === 'object' &&
            typeof b === 'object' &&
            !Array.isArray(a) &&
            !Array.isArray(b)
        if (bothPlain) {
            collectDeltas(a, b, here, into)
        } else if (
            Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length
        ) {
            a.forEach((_, index) =>
                collectDeltas(a[index], b[index], `${here}[${index}]`, into)
            )
        } else {
            into.push({ path: here, before: a, after: b })
        }
    }
    return into
}

const isLoss = (delta: Delta) => delta.before !== undefined

const describe = (losses: Delta[]) =>
    losses.map(
        (loss) =>
            `${loss.path}: ${JSON.stringify(loss.before)} -> ${JSON.stringify(loss.after)}`
    )

type Outcome =
    | { status: 'passed' }
    | { status: 'failed'; reason: string }
    | { status: 'uncovered'; reason: string }

async function assertTarget(
    target: string,
    cases: NormalizedCase[]
): Promise<Outcome> {
    try {
        const blockId = HANDBOOK_RENDERERS[target]
        if (!blockId) {
            return {
                status: 'failed',
                reason: `the corpus marks this target as handbook: 'render' but HANDBOOK_RENDERERS has no block id for it`,
            }
        }

        const block = BRUMES_BLOCKS.find(
            (candidate) => candidate.id === blockId
        )
        if (!block) {
            throw new Error(`the Handbook registry has no block "${blockId}"`)
        }

        const spec = TOML_EXPORTS.find(
            (candidate) => candidate.block.id === blockId
        )
        if (!spec) {
            throw new Error(
                `the Handbook has no TOML export for block "${blockId}"`
            )
        }

        const witnesses = cases.filter(
            (entry) => entry.target === target && entry.expect === 'accept'
        )
        if (witnesses.length === 0) {
            return {
                status: 'uncovered',
                reason: 'no accepted witness for this target in the corpus',
            }
        }

        const contract = nodeDocumentContracts.require(`mist/${target}`)
        const codec = await resolveLanternModule(target)
        const key = keyFor(target)

        for (const witness of witnesses) {
            const sourceText = fs.readFileSync(witness.file, 'utf8')
            const canonicalBefore = contract.parseToml(sourceText)

            const imported = codec.importFromTOMLWithWarnings(sourceText)
            if (!(key in imported)) {
                throw new Error(
                    `${witness.id}: the Lantern import returned no "${key}" key`
                )
            }
            const lanternTomlText = codec.exportToTOML(imported[key] as never)

            const handbookData = block.parse(lanternTomlText)
            if (handbookData === null) {
                throw new Error(
                    `${witness.id}: the Handbook block "${blockId}" could not parse Lantern's export`
                )
            }

            const handbookTomlText = spec.toToml(handbookData)
            const canonicalAfter = contract.parseToml(handbookTomlText)

            const losses = collectDeltas(
                canonicalBefore,
                canonicalAfter
            ).filter(isLoss)
            if (losses.length > 0) {
                throw new Error(`${witness.id}: ${describe(losses)[0]}`)
            }
        }

        return { status: 'passed' }
    } catch (error) {
        return {
            status: 'failed',
            reason: error instanceof Error ? error.message : String(error),
        }
    }
}

async function main() {
    /* Handed down by the calling script: the bundle runs from a temp directory and resolves nothing. */
    const handed = process.env.LANTERN_MIST_CASES
    assert.ok(handed, 'LANTERN_MIST_CASES was not passed to the harness')
    const cases = JSON.parse(handed) as NormalizedCase[]

    const targets = [
        ...new Set(
            cases
                .filter((entry) => entry.handbook === 'render')
                .map((entry) => entry.target)
        ),
    ].sort()

    const lines: string[] = []
    let passed = 0
    let failed = 0
    let uncovered = 0

    for (const target of targets) {
        const outcome = await assertTarget(target, cases)
        if (outcome.status === 'passed') {
            passed += 1
            lines.push(`${target}: passed`)
        } else if (outcome.status === 'uncovered') {
            uncovered += 1
            lines.push(`${target}: uncovered (${outcome.reason})`)
        } else {
            failed += 1
            lines.push(`${target}: failed - ${outcome.reason}`)
        }
    }

    process.stdout.write(
        lines.join('\n') +
            `\nCross-repository round trip: ${passed} passed, ${failed} failed, ${uncovered} uncovered across ${targets.length} targets.\n`
    )

    if (failed > 0) {
        process.exitCode = 1
    }
}

await main()
