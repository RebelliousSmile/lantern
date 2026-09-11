/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { MIST_ENGINE_CODECS } from 'schema-in-the-mist'
import { parse as parseToml } from 'smol-toml'
import {
    carryCanonicalSource,
    overlayCanonicalSource,
} from '../src/contracts/mist-engine'

/*
 * The published codecs are asserted by the calling script. What is asserted here is Lantern's own
 * template modules: every contract target has to import a canonical witness and render it back
 * without dropping a field, and a second export has to be byte-identical to the first.
 */

type TemplateCodec = {
    importFromTOMLWithWarnings(source: string): Record<string, unknown>
    exportToTOML(document: never): string
}

/*
 * The module and the key it returns are derivable from the target: no second registry to keep.
 * The specifier stays an inline template literal so esbuild expands it into a glob and bundles the
 * fourteen modules; it needs the `.ts` extension, since the glob matches file names on disk and does
 * not replay the resolver's extension list.
 */
const codecFor = (target: string) =>
    import(`../src/templates/${target}/toml.ts`) as Promise<TemplateCodec>
const keyFor = (target: string) =>
    target
        .split(/[/-]/)
        .map((part, index) =>
            index === 0 ? part : part[0].toUpperCase() + part.slice(1)
        )
        .join('')

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

/* A key the witness carried and the export lost. Materialised schema defaults run the other way. */
const isLoss = (delta: Delta) => delta.before !== undefined

async function main() {
    /* Handed down by the calling script: the bundle runs from a temp directory and resolves nothing. */
    const manifestFile = process.env.MIST_CONTRACT_CASES
    assert.ok(manifestFile, 'MIST_CONTRACT_CASES was not passed to the harness')
    const corpusRoot = path.dirname(manifestFile)
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) as {
        cases: { id: string; target: string; file: string; canonical: string }[]
    }
    const witnesses = manifest.cases.filter(
        (entry) => entry.canonical === 'accept'
    )
    const targets = Object.keys(MIST_ENGINE_CODECS)

    /* A fifteenth published target must not slip through unasserted. */
    for (const target of targets) {
        await assert.doesNotReject(
            () => codecFor(target),
            `no Lantern template module for contract target ${target}`
        )
        assert.ok(
            witnesses.some((witness) => witness.target === target),
            `no canonical witness in the contract corpus for ${target}`
        )
    }

    for (const witness of witnesses) {
        const codec = await codecFor(witness.target)
        const key = keyFor(witness.target)
        const source = fs.readFileSync(
            path.join(corpusRoot, witness.file),
            'utf8'
        )

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
            losses.map(
                (loss) =>
                    `${loss.path}: ${JSON.stringify(loss.before)} -> ${JSON.stringify(loss.after)}`
            ),
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

    process.stdout.write(
        `Lantern modules: ${witnesses.length} witnesses round-tripped across ${targets.length} targets.\n`
    )
}

await main()
