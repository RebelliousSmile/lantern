/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ADRENALINE_DOCUMENT_CODECS } from 'schema-adrenaline'
import { parse as parseToml } from 'smol-toml'
import {
    carryCanonicalSource,
    overlayCanonicalSource,
} from '../src/contracts/mist-engine'
import { nodeDocumentContracts } from '../src/contracts/registry.node'
import { normalizeContractManifests } from './contractManifests.mjs'

/*
 * Two layers, run against every registered contract:
 *
 *   1. the published codecs round-trip every `accept` witness and refuse every `reject` one;
 *   2. Lantern's own template modules import a witness and render it back without dropping a field.
 *
 * The second layer only applies to a contract that has Lantern modules. A contract without one is
 * reported as uncovered rather than silently skipped.
 */

type NormalizedCase = {
    contractId: string
    dialect: string
    key: string
    id: string
    target: string
    file: string
    expect: 'accept' | 'reject'
    format: 'toml' | 'json'
    lantern?: string
    handbook?: string
}

type TextCodec = {
    parse: (text: string) => unknown
    stringify: (document: never) => string
    /* The raw reader for the case's format, used to diff keys without going through a schema. */
    read: (text: string) => unknown
}

type TemplateCodec = {
    importFromTOMLWithWarnings(source: string): Record<string, unknown>
    exportToTOML(document: never): string
}

/*
 * Where a contract's Lantern modules live, when it has any. The Mist specifier stays an inline
 * template literal so esbuild expands it into a glob and bundles the fourteen modules; it needs the
 * `.ts` extension, since the glob matches file names on disk and does not replay the resolver's
 * extension list.
 */
const LANTERN_MODULES: Record<
    string,
    ((target: string) => Promise<TemplateCodec>) | null
> = {
    mist: (target) =>
        import(`../src/templates/${target}/toml.ts`) as Promise<TemplateCodec>,
    pbta: null,
    adrenaline: null,
}

/* `city-of-mist/theme-kit` -> `cityOfMistThemeKit`, the key a Lantern module returns. */
const keyFor = (target: string) =>
    target
        .split(/[/-]/)
        .map((part, index) =>
            index === 0 ? part : part[0].toUpperCase() + part.slice(1)
        )
        .join('')

/*
 * The common contract shape carries TOML only, by design. A JSON witness therefore reaches its
 * package's own JSON pair, which only Adrenaline publishes.
 */
function codecFor(entry: NormalizedCase): TextCodec {
    if (entry.format === 'toml') {
        const contract = nodeDocumentContracts.require(entry.key)
        return {
            parse: (text) => contract.parseToml(text),
            stringify: (document) => contract.stringifyToml(document),
            read: (text) => parseToml(text),
        }
    }
    assert.equal(
        entry.contractId,
        'adrenaline',
        `no JSON codec is published for ${entry.key}`
    )
    /* Asserts the target exists in the package too, not only in the registry. */
    nodeDocumentContracts.require(entry.key)
    const codec = ADRENALINE_DOCUMENT_CODECS[
        entry.target as keyof typeof ADRENALINE_DOCUMENT_CODECS
    ] as {
        parseJson: (text: string) => unknown
        stringifyJson: (document: never) => string
    }
    assert.ok(codec, `no Adrenaline codec for ${entry.key}`)
    return {
        parse: (text) => codec.parseJson(text),
        stringify: (document) => codec.stringifyJson(document),
        read: (text) => JSON.parse(text),
    }
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
        /* `JSON.stringify`, not a deepEqual over a clone: the clone drops `undefined` values and the
         * comparison then fails on absent optional fields. */
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

/* A key the witness carried and the round trip lost. Materialised defaults run the other way. */
const isLoss = (delta: Delta) => delta.before !== undefined

const describe = (losses: Delta[]) =>
    losses.map(
        (loss) =>
            `${loss.path}: ${JSON.stringify(loss.before)} -> ${JSON.stringify(loss.after)}`
    )

function assertPublishedCodecs(cases: NormalizedCase[]) {
    const tally = new Map<string, { accepted: number; rejected: number }>()

    for (const entry of cases) {
        const codec = codecFor(entry)
        const source = fs.readFileSync(entry.file, 'utf8')
        const counts = tally.get(entry.contractId) ?? {
            accepted: 0,
            rejected: 0,
        }
        tally.set(entry.contractId, counts)

        if (entry.expect === 'reject') {
            assert.throws(() => codec.parse(source), undefined, entry.id)
            counts.rejected += 1
            continue
        }

        const parsed = codec.parse(source) as never
        const rendered = codec.stringify(parsed)
        assert.deepStrictEqual(codec.parse(rendered), parsed, entry.id)

        /* Witness-independent: `0`, `false`, an empty list and a quoted key all have to survive. */
        const losses = collectDeltas(
            codec.read(source),
            codec.read(rendered)
        ).filter(isLoss)
        assert.deepStrictEqual(
            describe(losses),
            [],
            `${entry.id}: the round trip dropped or altered a field`
        )
        counts.accepted += 1
    }

    return tally
}

/*
 * Every registered target has to be exercised by a witness, and every witness has to name a
 * registered target. Dropping a target from the registry therefore turns the run red rather than
 * shrinking it quietly.
 */
function assertRegistryCoverage(cases: NormalizedCase[]) {
    const accepted = new Set(
        cases.filter((entry) => entry.expect === 'accept').map((e) => e.key)
    )
    for (const contract of nodeDocumentContracts.all()) {
        assert.ok(
            accepted.has(contract.key),
            `no canonical witness in the contract corpus for ${contract.key}`
        )
    }
    /* The other direction is covered by `require` in `codecFor`, which throws on an unknown key. */
}

async function assertLanternModules(cases: NormalizedCase[]) {
    const covered: string[] = []
    const uncovered: string[] = []

    for (const [contractId, resolve] of Object.entries(LANTERN_MODULES)) {
        const targets = [
            ...new Set(
                nodeDocumentContracts
                    .byContract(contractId)
                    .map((contract) => contract.target)
            ),
        ]
        if (!resolve) {
            uncovered.push(`${contractId} (${targets.length} targets)`)
            continue
        }

        const witnesses = cases.filter(
            (entry) =>
                entry.contractId === contractId &&
                entry.expect === 'accept' &&
                entry.format === 'toml'
        )

        /* A published target with no Lantern module must not slip through unasserted. */
        for (const target of targets) {
            await assert.doesNotReject(
                () => resolve(target),
                `no Lantern template module for contract target ${contractId}/${target}`
            )
        }

        for (const witness of witnesses) {
            const codec = await resolve(witness.target)
            const key = keyFor(witness.target)
            const source = fs.readFileSync(witness.file, 'utf8')

            const imported = codec.importFromTOMLWithWarnings(source)
            assert.ok(
                key in imported,
                `${witness.id}: import returned no "${key}" key`
            )

            const first = codec.exportToTOML(imported[key] as never)
            const losses = collectDeltas(
                parseToml(source),
                parseToml(first)
            ).filter(isLoss)
            assert.deepStrictEqual(
                describe(losses),
                [],
                `${witness.id}: the round trip dropped or altered a field`
            )

            const second = codec.exportToTOML(
                codec.importFromTOMLWithWarnings(first)[key] as never
            )
            assert.equal(
                second,
                first,
                `${witness.id}: the second export is not identical to the first`
            )
        }

        covered.push(
            `${contractId} (${witnesses.length} witnesses across ${targets.length} targets)`
        )
    }

    return { covered, uncovered }
}

function assertOverlayIdentity() {
    /* The corpus cannot produce this one: an overlay caller handing the same object to both sides. */
    const source = { name: 'Danger', rating: 0, extension: false }
    const edited = carryCanonicalSource({ name: 'Edited Danger' }, source)
    const actual = overlayCanonicalSource(edited, edited)

    assert.deepStrictEqual(actual, {
        name: 'Edited Danger',
        rating: 0,
        extension: false,
    })
    assert.equal('__canonicalSource' in actual, false)
}

async function main() {
    /* Handed down by the calling script: the bundle runs from a temp directory and resolves nothing. */
    const handed = process.env.LANTERN_CONTRACT_MANIFESTS
    assert.ok(
        handed,
        'LANTERN_CONTRACT_MANIFESTS was not passed to the harness'
    )
    const cases = normalizeContractManifests(
        JSON.parse(handed)
    ) as NormalizedCase[]

    /* The witness that exists to carry `0`, `false`, empty lists and quoted keys. */
    assert.ok(
        cases.some(
            (entry) =>
                entry.expect === 'accept' &&
                entry.file
                    .replace(/\\/g, '/')
                    .endsWith(
                        'corpus/contract/valid/pnj-syntax-edge-values.toml'
                    )
        ),
        'the Adrenaline edge-values witness is not among the cases run'
    )

    assertRegistryCoverage(cases)
    const tally = assertPublishedCodecs(cases)
    const { covered, uncovered } = await assertLanternModules(cases)
    assertOverlayIdentity()

    const perContract = [...tally.entries()].map(([contractId, counts]) => {
        const targets = nodeDocumentContracts.byContract(contractId).length
        return `${contractId} ${counts.accepted} accepted / ${counts.rejected} rejected across ${targets} targets`
    })
    process.stdout.write(
        `Published codecs: ${perContract.join(' · ')}.\n` +
            `Lantern modules: ${covered.join(' · ') || 'none'}.\n` +
            `Uncovered by a Lantern module: ${uncovered.join(' · ') || 'none'}.\n`
    )
}

await main()
