/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ADRENALINE_DOCUMENT_CODECS } from 'schema-adrenaline'
import {
    PBTA_COLLECTION_PRESENTATIONS,
    type PbtaCollectionPresentation,
} from 'schema-pbta'
import { parse as parseToml } from 'smol-toml'
import {
    carryCanonicalSource,
    overlayCanonicalSource,
} from '../src/contracts/mist-engine'
import { nodeDocumentContracts } from '../src/contracts/registry.node'
import {
    appendAtPath,
    getAtPath,
    moveAtPath,
    removeAtPath,
    setAtPath,
} from '../src/core/editor-schema/path'
import {
    LANTERN_CAPABILITIES,
    unknownCapabilities,
} from '../src/core/capabilities'
import { normalizeContractManifests } from './contractManifests.mjs'
import { collectionAdapterFor } from '../src/templates/pbta/specialized/collectionAdapters'
import {
    removeCollectionItem,
    replaceCollectionItems,
} from '../src/templates/pbta/specialized/collectionPolicy'

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
 * template literal so esbuild expands it into a glob and bundles the template modules; it needs
 * the `.ts` extension, since the glob matches file names on disk and does not replay the resolver's
 * extension list.
 */
const LANTERN_MODULES: Record<
    string,
    ((target: string) => Promise<TemplateCodec>) | null
> = {
    mist: (target) =>
        import(`../src/templates/${target}/toml.ts`) as Promise<TemplateCodec>,
    pbta: (target) => {
        const modules: Record<string, () => Promise<TemplateCodec>> = {
            playbook: () =>
                import(
                    '../src/templates/pbta/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'salvage-run-playbook': () =>
                import(
                    '../src/templates/pbta/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'monsterhearts-playbook': () =>
                import(
                    '../src/templates/monsterhearts/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'urban-shadows-playbook': () =>
                import(
                    '../src/templates/urban-shadows/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'masks-playbook': () =>
                import(
                    '../src/templates/masks/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'monster-of-the-week-playbook': () =>
                import(
                    '../src/templates/monster-of-the-week/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
            'the-sprawl-playbook': () =>
                import(
                    '../src/templates/the-sprawl/playbook/toml.ts'
                ) as Promise<TemplateCodec>,
        }
        const resolve = modules[target]
        if (!resolve)
            return Promise.reject(
                new Error(`no specialized Lantern module for pbta/${target}`)
            )
        return resolve()
    },
    adrenaline: (target) =>
        import(
            `../src/templates/adrenaline/${target}/toml.ts`
        ) as Promise<TemplateCodec>,
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
        ].filter(
            (target) => contractId !== 'pbta' || target.endsWith('-playbook')
        )
        if (!resolve) {
            uncovered.push(`${contractId} (${targets.length} targets)`)
            continue
        }

        const witnesses = cases.filter(
            (entry) =>
                entry.contractId === contractId &&
                entry.expect === 'accept' &&
                entry.format === 'toml' &&
                (contractId !== 'pbta' || entry.target.endsWith('-playbook'))
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
            const key =
                witness.target === 'playbook' ||
                witness.target === 'salvage-run-playbook'
                    ? 'playbook'
                    : keyFor(witness.target)
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

async function assertLinkedCreationRoundTrip(cases: NormalizedCase[]) {
    const witness = cases.find(
        (entry) =>
            entry.contractId === 'pbta' &&
            entry.target === 'playbook' &&
            entry.expect === 'accept' &&
            entry.file
                .replace(/\\/g, '/')
                .endsWith('corpus/contract/valid/playbook-complete.toml')
    )
    assert.ok(
        witness,
        'the linked creation playbook witness is not among the cases run'
    )

    const resolvePbta = LANTERN_MODULES.pbta
    assert.ok(resolvePbta, 'the PbtA Lantern module resolver is unavailable')
    const codec = await resolvePbta('playbook')
    const imported = codec.importFromTOMLWithWarnings(
        fs.readFileSync(witness.file, 'utf8')
    )
    const rendered = codec.exportToTOML(imported.playbook as never)
    const parsed = parseToml(rendered) as Record<string, unknown>

    assert.deepStrictEqual(parsed.attributes, {
        ready: false,
        potential: 0,
        'quoted key': ['alpha', 'beta'],
    })
    assert.deepStrictEqual(parsed.creation, [
        {
            label: 'Which tool exported this document?',
            options: [
                { value: 'lantern', label: 'Lantern' },
                { value: 'handbook', label: 'Handbook' },
            ],
            selection: { min: 1, max: 1 },
            attribute: 'quoted key',
        },
    ])
}

async function assertUrbanShadowsCreationRoundTrip(cases: NormalizedCase[]) {
    const witness = cases.find(
        (entry) =>
            entry.contractId === 'pbta' &&
            entry.target === 'urban-shadows-playbook' &&
            entry.expect === 'accept' &&
            entry.file
                .replace(/\\/g, '/')
                .endsWith(
                    'corpus/contract/valid/urban-shadows-playbook-complete.toml'
                )
    )
    assert.ok(
        witness,
        'the Urban Shadows linked creation witness is not among the cases run'
    )

    const resolvePbta = LANTERN_MODULES.pbta
    assert.ok(resolvePbta, 'the PbtA Lantern module resolver is unavailable')
    const codec = await resolvePbta('urban-shadows-playbook')
    const imported = codec.importFromTOMLWithWarnings(
        fs.readFileSync(witness.file, 'utf8')
    )
    const rendered = codec.exportToTOML(imported.urbanShadowsPlaybook as never)
    const parsed = parseToml(rendered) as Record<string, unknown>

    assert.deepStrictEqual(parsed.attributes, {
        mortalRelationships: [
            'younger-sibling',
            'loyal-significant-other',
            'struggling-best-friend',
        ],
    })
    assert.deepStrictEqual(parsed.mortalRelationships, [
        {
            key: 'younger-sibling',
            label: 'Younger sibling',
            description: 'Relies on you for transportation and advice.',
        },
        {
            key: 'loyal-significant-other',
            label: 'Loyal significant other',
            description:
                'Keeps choosing you when the city makes that dangerous.',
        },
        {
            key: 'struggling-best-friend',
            label: 'Struggling best friend',
            description: 'Always gets into messy altercations.',
        },
    ])
    assert.deepStrictEqual(parsed.creation, [
        {
            label: 'Choose three mortal relationships.',
            options: [
                { value: 'younger-sibling', label: 'Younger sibling' },
                {
                    value: 'loyal-significant-other',
                    label: 'Loyal significant other',
                },
                {
                    value: 'struggling-best-friend',
                    label: 'Struggling best friend',
                },
            ],
            selection: { min: 3, max: 3 },
            attribute: 'mortalRelationships',
        },
    ])
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

function assertEditorSchemaPaths() {
    const source = {
        mode: 'inline',
        hidden: { note: 'retain me' },
        moves: [{ name: 'First' }],
    }
    const renamed = setAtPath(source, ['moves', 0, 'name'], 'Renamed')
    assert.equal(getAtPath(renamed, ['moves', 0, 'name']), 'Renamed')
    assert.equal(getAtPath(source, ['moves', 0, 'name']), 'First')

    const appended = appendAtPath(renamed, ['moves'], { name: 'Blank' })
    assert.equal(getAtPath(appended, ['moves', 1, 'name']), 'Blank')
    const moved = moveAtPath(appended, ['moves'], 1, 0)
    assert.equal(getAtPath(moved, ['moves', 0, 'name']), 'Blank')
    const removed = removeAtPath(moved, ['moves'], 0)
    assert.equal(getAtPath(removed, ['moves', 0, 'name']), 'Renamed')
    assert.equal(getAtPath(removed, ['hidden', 'note']), 'retain me')
}

function assertPbtaCollectionAdapters() {
    for (const descriptor of PBTA_COLLECTION_PRESENTATIONS) {
        assert.ok(
            collectionAdapterFor(descriptor.itemEditor),
            `no Lantern adapter for ${descriptor.itemEditor}`
        )
    }
    assert.equal(
        collectionAdapterFor('not-a-published-adapter'),
        null,
        'unknown adapter keys must not select a fallback editor'
    )

    const fixed: PbtaCollectionPresentation = {
        target: 'masks-playbook',
        path: 'items',
        label: 'Items',
        itemEditor: 'pbta-text',
        creationVariant: 'text',
        cardinality: 'fixed',
        reorder: true,
    }
    const source = { items: ['first', 'second'] }
    assert.deepStrictEqual(
        removeCollectionItem(source, fixed, 0),
        source,
        'fixed collections retain their items'
    )
    assert.deepStrictEqual(
        replaceCollectionItems(source, fixed, ['edited', 'second']),
        { items: ['edited', 'second'] },
        'fixed collections still allow item edits'
    )
}

type DeclaredPack = {
    dialect: string
    id: string
    file: string
    lantern: string[]
    targets: string[]
}

type DeclaredProvider = {
    contractId: string
    packageName: string
    provider: string
    descriptorFile: string
    capabilities: string[]
    packs: DeclaredPack[]
}

type ProviderDescriptors = {
    published: DeclaredProvider[]
    unpublished: string[]
}

/*
 * The fifth layer: a provider's own declarations, confronted with the capability surface.
 *
 * A schema package states in its `cross-tool-provider.json` what it expects this app to implement,
 * and a PbtA pack restates the claim for itself. Before this layer those strings were checked
 * against nothing. Reading them is `tools/providerDescriptors.mjs`' job; deciding what an unknown
 * token costs is this one's, and the two verdicts differ on purpose:
 *
 *   - an unknown token in `capabilities.lantern`, or in a pack's `requirements.lantern`, fails the
 *     run: it is a claim on Lantern that Lantern does not honour;
 *   - a pack's `documents[].target` with no matching `edit:<contractKey>` is only reported. A pack
 *     may legitimately carry a document addressed to another consumer — `schema-pbta/packs/salvage-run`
 *     names `salvage-run-playbook` today and asks nothing of Lantern beyond `edit:pbta`. A pack that
 *     does want the fine guarantee declares `edit:pbta/salvage-run-playbook`, and the first rule
 *     refuses that until the template ships.
 */
function assertDeclaredCapabilities(descriptors: ProviderDescriptors): string {
    const perProvider: string[] = []
    const uneditable: string[] = []

    for (const provider of descriptors.published) {
        for (const token of unknownCapabilities(provider.capabilities)) {
            assert.fail(
                `Provider "${provider.provider}" declares capabilities.lantern token "${token}", ` +
                    `which this build of Lantern does not publish. Known tokens: ${LANTERN_CAPABILITIES.join(', ')}`
            )
        }

        let targets = 0
        for (const pack of provider.packs) {
            for (const token of unknownCapabilities(pack.lantern)) {
                assert.fail(
                    `Pack "${pack.id}" of provider "${provider.provider}" requires Lantern token ` +
                        `"${token}", which this build does not publish: ${pack.file}`
                )
            }

            for (const target of pack.targets) {
                targets += 1
                const key = `${provider.contractId}/${target}`
                if (!LANTERN_CAPABILITIES.includes(`edit:${key}`)) {
                    uneditable.push(`${pack.id}:${key}`)
                }
            }
        }

        perProvider.push(
            `${provider.contractId} ${provider.capabilities.length} declared across ` +
                `${provider.packs.length} packs / ${targets} targets`
        )
    }

    return (
        `Declared capabilities: ${perProvider.join(' · ') || 'none'}; ` +
        `not editable here: ${uneditable.join(' · ') || 'none'}; ` +
        `no descriptor published: ${descriptors.unpublished.join(' · ') || 'none'}.`
    )
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

    const declared = process.env.LANTERN_PROVIDER_DESCRIPTORS
    assert.ok(
        declared,
        'LANTERN_PROVIDER_DESCRIPTORS was not passed to the harness'
    )
    const descriptors = JSON.parse(declared) as ProviderDescriptors

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
    await assertLinkedCreationRoundTrip(cases)
    await assertUrbanShadowsCreationRoundTrip(cases)
    assertOverlayIdentity()
    assertEditorSchemaPaths()
    assertPbtaCollectionAdapters()
    const declaredLine = assertDeclaredCapabilities(descriptors)

    const perContract = [...tally.entries()].map(([contractId, counts]) => {
        const targets = nodeDocumentContracts.byContract(contractId).length
        return `${contractId} ${counts.accepted} accepted / ${counts.rejected} rejected across ${targets} targets`
    })
    process.stdout.write(
        `Published codecs: ${perContract.join(' · ')}.\n` +
            `Lantern modules: ${covered.join(' · ') || 'none'}.\n` +
            `Uncovered by a Lantern module: ${uncovered.join(' · ') || 'none'}.\n` +
            `${declaredLine}\n`
    )
}

await main()
