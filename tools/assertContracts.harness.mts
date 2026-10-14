/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {
    ADRENALINE_DOCUMENT_CODECS,
    EtatDeCreature,
    Monstre,
} from 'schema-adrenaline'
import { MONSTRE_PRESENTATION } from 'schema-adrenaline/presentation'
import {
    PBTA_COLLECTION_PRESENTATIONS,
    type PbtaCollectionPresentation,
} from 'schema-pbta'
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml'
import {
    carryCanonicalSource,
    overlayCanonicalSource,
} from '../src/contracts/mist-engine'
import { nodeDocumentContracts } from '../src/contracts/registry.node'
import {
    LANTERN_CAPABILITIES,
    unknownCapabilities,
} from '../src/core/capabilities'
import {
    appendAtPath,
    getAtPath,
    moveAtPath,
    removeAtPath,
    setAtPath,
} from '../src/core/editor-schema/path'
import {
    actionSummary,
    cleanAction,
    hasMoreFields,
} from '../src/templates/adrenaline/monstre/editor/actionClean'
import {
    damageNatures,
    damageSides,
} from '../src/templates/adrenaline/monstre/editor/damageEnums'
import {
    DELTA_KEYS,
    acceptedEmpty,
    giveDeltaKey,
    isStateOnly,
    shownValue,
    takeBackDeltaKey,
    writeDeltaKey,
} from '../src/templates/adrenaline/monstre/editor/deltaEdit'
import {
    panelFor,
    rootKeys,
    shownKeys,
} from '../src/templates/adrenaline/monstre/editTargets'
import {
    addMonsterState,
    monsterStates,
    nextMonsterStateId,
    removeMonsterState,
    replaceMonsterState,
    resolveMonsterProfile,
    selectMonsterState,
    type MonsterDocument,
} from '../src/templates/adrenaline/monstre/states'
import { compactAgainst } from '../src/templates/adrenaline/shared/editor/schemaCompact'
import { upgradeLegacyAdrenalineRanges } from '../src/templates/adrenaline/shared/legacyRanges'
import {
    parseAdrenalineToml,
    stringifyAdrenalineToml,
} from '../src/templates/adrenaline/shared/toml'
import { collectionAdapterFor } from '../src/templates/pbta/specialized/collectionAdapters'
import {
    removeCollectionItem,
    replaceCollectionItems,
} from '../src/templates/pbta/specialized/collectionPolicy'
import { NOT_EDITABLE } from './adrenalineNotEditable.mjs'
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
        /* The export leaves empty lists out by design (`compactAgainst`): an empty list that comes
         * back absent carries nothing, so it is not a loss. */
        if (
            (Array.isArray(a) && a.length === 0 && b === undefined) ||
            (Array.isArray(b) && b.length === 0 && a === undefined)
        )
            continue
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

const record = (value: unknown): Record<string, unknown> => {
    assert.ok(value && typeof value === 'object' && !Array.isArray(value))
    return value as Record<string, unknown>
}

function assertExactLegacyMonsterMigration(before: unknown, after: unknown) {
    const source = record(before)
    const legacy = record(source.etatAlternatif)
    const base = { ...source }
    delete base.etatAlternatif
    const delta = {
        ...(legacy.caracteristiques
            ? {
                  caracteristiques: {
                      ...record(base.caracteristiques),
                      ...record(legacy.caracteristiques),
                  },
              }
            : {}),
        ...(legacy.zoneDeDetection
            ? { zoneDeDetection: legacy.zoneDeDetection }
            : {}),
        ...(legacy.deplacement ? { deplacement: legacy.deplacement } : {}),
        ...(legacy.actionsParRound !== undefined
            ? { actionsParRound: legacy.actionsParRound }
            : {}),
        ...(legacy.notes ? { notes: legacy.notes } : {}),
    }
    const expected = {
        ...base,
        etats: [
            {
                id: 'alternatif-historique',
                nom: legacy.nom,
                ...(legacy.declencheurs
                    ? { declencheurs: legacy.declencheurs }
                    : {}),
                delta,
            },
        ],
    }
    assert.deepStrictEqual(
        after,
        expected,
        'the legacy monster must migrate to the exact published canonical state'
    )

    const migratedStates = record(after).etats
    assert.ok(Array.isArray(migratedStates))
    assert.equal(migratedStates.length, 1)
    const migrated = record(migratedStates[0])
    assert.equal(migrated.id, 'alternatif-historique')
    assert.deepStrictEqual(migrated.declencheurs, legacy.declencheurs)
    const migratedDelta = record(migrated.delta)
    assert.deepStrictEqual(
        migratedDelta.caracteristiques,
        delta.caracteristiques
    )
    assert.equal(migratedDelta.zoneDeDetection, legacy.zoneDeDetection)
    assert.equal(migratedDelta.deplacement, legacy.deplacement)
    assert.equal(migratedDelta.actionsParRound, legacy.actionsParRound)
    assert.equal(migratedDelta.notes, legacy.notes)
}

function assertRawRoundTrip(
    entry: NormalizedCase,
    before: unknown,
    after: unknown
) {
    const source = record(before)
    if (
        entry.contractId === 'adrenaline' &&
        entry.target === 'monstre' &&
        source.etatAlternatif !== undefined
    ) {
        assert.equal(source.etats, undefined)
        assert.equal(source.etatActif, undefined)
        assertExactLegacyMonsterMigration(before, after)
        return
    }
    const losses = collectDeltas(before, after).filter(isLoss)
    assert.deepStrictEqual(
        describe(losses),
        [],
        `${entry.id}: the round trip dropped or altered a field`
    )
}

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
        assertRawRoundTrip(entry, codec.read(source), codec.read(rendered))
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
            assertRawRoundTrip(witness, parseToml(source), parseToml(first))

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

function assertMonsterStateHelpers() {
    const base: MonsterDocument = {
        nom: 'Rôdeur',
        caracteristiques: {
            for: { minimum: 0, current: 45, maximum: 45 },
            con: { minimum: 0, current: 60, maximum: 60 },
            dex: { minimum: 0, current: 25, maximum: 25 },
            rap: { minimum: 0, current: 30, maximum: 30 },
        },
    }
    const first = {
        id: 'etat',
        nom: 'Stimulé',
        declencheurs: ['Un bruit violent'],
        delta: {
            deplacement: '12 m par action',
            traitsSpeciaux: ['Ignore la douleur'],
        },
    }
    const second = {
        id: 'etat-2',
        nom: 'Épuisé',
        delta: { deplacement: '3 m par action' },
    }
    const source: MonsterDocument = {
        ...base,
        etats: [first, second],
        etatActif: 'etat',
    }

    assert.equal(nextMonsterStateId(monsterStates(source)), 'etat-3')
    const added = addMonsterState(source, 'Nouvel état')
    assert.equal(added.ok, true)
    if (!added.ok) assert.fail('the minimal state should be provider-valid')
    assert.deepStrictEqual(monsterStates(added.document)[2], {
        id: 'etat-3',
        nom: 'Nouvel état',
        delta: {},
    })

    const invalid = replaceMonsterState(source, 0, {
        ...first,
        id: 'Invalid ID',
    })
    assert.deepStrictEqual(invalid, { ok: false, error: 'invalid-state' })
    assert.deepStrictEqual(monsterStates(source), [first, second])

    const duplicate = replaceMonsterState(source, 0, {
        ...first,
        id: second.id,
    })
    assert.deepStrictEqual(duplicate, { ok: false, error: 'duplicate-id' })
    assert.deepStrictEqual(monsterStates(source), [first, second])

    const edited = replaceMonsterState(source, 0, {
        ...first,
        delta: { ...first.delta, deplacement: '15 m par action' },
    })
    assert.equal(edited.ok, true)
    if (!edited.ok) assert.fail('the valid state edit should succeed')
    assert.deepStrictEqual(
        monsterStates(edited.document).map((state) => state.id),
        ['etat', 'etat-2']
    )
    assert.deepStrictEqual(
        monsterStates(edited.document)[0].delta.traitsSpeciaux,
        ['Ignore la douleur']
    )

    const renamed = replaceMonsterState(source, 0, {
        ...first,
        id: 'stimule',
    })
    assert.equal(renamed.ok, true)
    if (!renamed.ok) assert.fail('the valid state rename should succeed')
    assert.equal(renamed.document.etatActif, 'stimule')

    const removed = removeMonsterState(source, 0)
    assert.equal(removed.etatActif, undefined)
    assert.deepStrictEqual(
        monsterStates(removed).map((state) => state.id),
        ['etat-2']
    )
    assert.equal(selectMonsterState(source, 'base').etatActif, undefined)
    assert.equal(selectMonsterState(base, 'etat').etatActif, undefined)

    const resolved = resolveMonsterProfile(source)
    assert.equal(resolved.nom, 'Rôdeur')
    assert.equal(resolved.deplacement, '12 m par action')
    assert.deepStrictEqual(resolved.traitsSpeciaux, ['Ignore la douleur'])
}

/*
 * The creature's actions editor writes through `cleanAction`: whatever a half-filled draft holds,
 * the document must still pass the published codec, and a legacy damage key must survive.
 */
function assertActionEditorOutput() {
    const codec = ADRENALINE_DOCUMENT_CODECS['monstre'] as {
        parseJson: (text: string) => unknown
    }
    const base = parseToml(
        fs.readFileSync(
            'node_modules/schema-adrenaline/examples/adrenaline/monstre/infecte-zy-2.toml',
            'utf8'
        )
    ) as Record<string, unknown>
    const messy = {
        nom: '',
        test: {
            nom: 'Morsure',
            pourcentage: 40,
        },
        degats: {
            versant: 'physique',
            profils: [
                { des: '' },
                { des: '1d10', nature: 'blessante', condition: '' },
            ],
            liant: '',
            proprietes: ['', 'Perforante'],
        },
        effets: [''],
        conditions: [],
        notes: '',
        suites: [
            { nom: '', degats: { versant: 'mental', profils: [{ des: '' }] } },
            { nom: 'Suivi' },
        ],
    }
    const cleaned = cleanAction(messy)
    assert.ok(cleaned, 'a filled action is kept')
    assert.deepStrictEqual(
        Object.keys(cleaned).sort(),
        ['degats', 'suites', 'test'],
        'blank keys, empty lists and empty objects are not written'
    )
    /* What is typed stays (a draft the panels signal); the blank name and the emptied profile leave. */
    assert.deepStrictEqual(cleaned.suites, [
        { degats: { versant: 'mental' } },
        { nom: 'Suivi' },
    ])
    assert.equal(
        cleanAction({ nom: '', degats: { profils: [{ des: '' }] } }),
        undefined
    )
    assert.deepStrictEqual(
        cleanAction({ nom: 'Coup', desDeDegats: 2, modificateurDeDegats: 1 }),
        { nom: 'Coup', desDeDegats: 2, modificateurDeDegats: 1 },
        'legacy damage keys are kept'
    )
    assert.ok(
        codec.parseJson(
            JSON.stringify(
                compactAgainst('monstre', { ...base, actions: [cleaned] })
            )
        ),
        'the cleaned action passes the published codec once exported'
    )
    assert.deepStrictEqual(
        cleaned.test,
        { nom: 'Morsure', pourcentage: 40 },
        'the editor writes the test percentage as a plain number'
    )
    // A document written earlier may hold the triplet: it is read as it is
    // and still passes the codec, as the creature accepts both forms.
    const withTriplet = cleanAction({
        nom: 'Coup',
        test: {
            nom: 'Frapper',
            pourcentage: { minimum: 0, current: 55, maximum: 55 },
        },
        suites: [
            {
                nom: 'Suivi',
                test: {
                    nom: 'Lutter',
                    pourcentage: { minimum: 0, current: 30, maximum: 30 },
                },
            },
        ],
    })
    assert.ok(withTriplet, 'an action with a triplet test is kept')
    assert.deepStrictEqual(withTriplet.test, {
        nom: 'Frapper',
        pourcentage: { minimum: 0, current: 55, maximum: 55 },
    })
    assert.ok(
        codec.parseJson(JSON.stringify({ ...base, actions: [withTriplet] })),
        'a triplet test passes the published codec on a creature'
    )
}

/*
 * A state's delta is written through a draft: blank rows never reach the contract, a key the state
 * owns stays the state's when it is emptied, and a key the contract takes no empty form for is
 * refused. Every key of the published delta is probed, none is listed here.
 */
function assertDeltaEdit() {
    const state = { id: 'enrage', nom: 'Enragé', delta: {} } as never
    const parse = (candidate: unknown) =>
        replaceMonsterState({ etats: [state] }, 0, candidate)
    assert.ok(DELTA_KEYS.length > 0, 'the contract publishes delta keys')
    assert.ok(
        DELTA_KEYS.includes('actions') &&
            DELTA_KEYS.includes('caracteristiques'),
        'the delta keys come from the contract'
    )
    for (const key of DELTA_KEYS) {
        const empty = acceptedEmpty(key)
        const written = writeDeltaKey(state, key, undefined)
        if (empty === undefined) {
            assert.equal(
                written.ok,
                false,
                `${key}: no empty form, so emptying is refused`
            )
        } else {
            assert.ok(
                written.ok,
                `${key}: an owned key emptied keeps the form the contract accepts`
            )
            if (written.ok)
                assert.ok(
                    parse(written.state).ok,
                    `${key}: its empty form is accepted by the contract`
                )
        }
    }
    for (const key of [
        'actions',
        'comportement',
        'traitsSpeciaux',
        'competences',
    ])
        assert.deepEqual(
            acceptedEmpty(key),
            [],
            `${key} may be an empty list on a state`
        )
    // A blank row is cleaned before the write, so the contract accepts the document.
    const blank = writeDeltaKey(state, 'comportement', ['Charge', ''])
    assert.ok(blank.ok, 'a list with a blank row is written cleaned')
    if (blank.ok) {
        assert.deepEqual(blank.state.delta.comportement, ['Charge'])
        assert.ok(parse(blank.state).ok)
    }
    const nameless = writeDeltaKey(state, 'competences', [
        { nom: 'Mordre', pourcentage: 40 },
        { nom: '', pourcentage: 0 },
    ])
    assert.ok(
        nameless.ok && parse(nameless.state).ok,
        'a nameless skill row is not written'
    )
    const last = writeDeltaKey(state, 'comportement', [''])
    assert.ok(last.ok, 'emptying the last line keeps the key on the state')
    if (last.ok) assert.deepEqual(last.state.delta.comportement, [])
    assert.equal(
        writeDeltaKey(state, 'caracteristiques', {}).ok,
        false,
        'characteristics cannot be emptied on a state'
    )
    // The draft survives a write and a refused write, and gives way to a changed document.
    const draft = { value: ['Charge', ''], over: JSON.stringify(['Charge']) }
    assert.deepEqual(
        shownValue(draft, ['Charge']),
        ['Charge', ''],
        'written: the draft stays'
    )
    assert.deepEqual(shownValue(draft, ['Charge']), draft.value)
    assert.deepEqual(
        shownValue({ value: ['x', ''], over: JSON.stringify(['a']) }, ['a']),
        ['x', ''],
        'refused write: the draft stays over the unchanged document'
    )
    assert.deepEqual(
        shownValue({ value: ['x'], over: JSON.stringify(['a']) }, ['b']),
        ['b'],
        'the document changed elsewhere: the draft gives way'
    )
    assert.equal(isStateOnly('notes'), true, 'notes is a state-only key')
    assert.equal(isStateOnly('actions'), false)
}

/*
 * The gesture that creates a delta key: "give" copies the base's value (else the empty form the contract
 * accepts), "take back" removes it. Proven for every delta key the contract declares, on the Zy-2 example.
 */
function assertGiveAndTakeBack() {
    const base = parseToml(
        fs.readFileSync(
            'node_modules/schema-adrenaline/examples/adrenaline/monstre/infecte-zy-2.toml',
            'utf8'
        )
    ) as Record<string, unknown>
    assert.ok(
        Monstre.safeParse(base).success,
        'the Zy-2 example is a valid creature'
    )
    const state = { id: 'enrage', nom: 'Enragé', delta: {} } as never
    const accepts = (candidate: unknown) =>
        EtatDeCreature.safeParse(candidate).success
    let given = 0
    let drafted = 0
    for (const key of DELTA_KEYS) {
        const gift = giveDeltaKey(state, key, base[key])
        if (gift.kind === 'draft') {
            assert.equal(
                base[key] === undefined && acceptedEmpty(key) === undefined,
                true,
                `${key}: a draft is only opened when there is neither a base value nor an accepted empty form`
            )
            drafted += 1
            continue
        }
        given += 1
        assert.ok(
            accepts(gift.state),
            `${key}: giving the key yields a document the contract accepts`
        )
        const expected =
            base[key] !== undefined ? base[key] : acceptedEmpty(key)
        assert.deepEqual(
            (gift.state.delta as Record<string, unknown>)[key],
            expected,
            `${key}: the state starts from the base value, else the accepted empty form`
        )
        assert.deepEqual(
            takeBackDeltaKey(gift.state, key),
            state,
            `${key}: taking the key back restores the document as it was`
        )
        assert.equal(
            gift.state.delta === (state as { delta: unknown }).delta,
            false,
            `${key}: giving never mutates the state it was given`
        )
    }
    assert.ok(given > 0, 'at least one delta key can be given')
    assert.equal(
        given + drafted,
        DELTA_KEYS.length,
        'every delta key is either written or drafted'
    )
    // The base has no value: the contract's empty form is written when there is one.
    const emptyKey = DELTA_KEYS.find((key) => acceptedEmpty(key) !== undefined)
    assert.ok(emptyKey, 'the contract accepts an empty form for some key')
    if (emptyKey) {
        const gift = giveDeltaKey(state, emptyKey, undefined)
        assert.equal(gift.kind, 'written')
    }
}

/*
 * Clicking a zone must open a panel that edits everything the zone prints: for every block of the
 * published presentation, each root key its paths print is carried by the panel `panelFor` picks,
 * save the declared debt.
 */
function assertClickedZonesAreEditable() {
    const debt = new Set<string>(NOT_EDITABLE.monstre)
    let blocks = 0
    for (const section of MONSTRE_PRESENTATION.sections)
        for (const block of section.blocks) {
            const paths = (block.paths ?? []) as string[]
            if (paths.length === 0) continue
            blocks += 1
            const printed = rootKeys(paths).filter((key) => !debt.has(key))
            const rendered = shownKeys(panelFor(paths), rootKeys(paths))
            /* Equality, not inclusion: a panel wider than its zone is as wrong as one that is too narrow. */
            assert.deepEqual(
                rendered.slice().sort(),
                printed.slice().sort(),
                `block ${block.id}: the panel it opens (${panelFor(paths)}) renders ${rendered.join(', ') || 'nothing'}, the block prints ${printed.join(', ')}`
            )
        }
    assert.ok(blocks > 0, 'the creature presentation publishes blocks')
}

function assertDamageEnumerations() {
    /* The editor offers what the contract declares, and keeps a value it does not know. */
    const probe = (damage: Record<string, unknown>) =>
        EtatDeCreature.safeParse({
            id: 'e',
            nom: 'e',
            delta: { actions: [{ nom: 'Coup', degats: damage }] },
        }).success
    assert.ok(
        damageNatures().length > 0 && damageSides().length > 0,
        'the damage enumerations are readable from the published contract: its shape changed'
    )
    for (const nature of damageNatures())
        assert.ok(probe({ profils: [{ des: '1d10', nature }] }), nature)
    for (const side of damageSides())
        assert.ok(probe({ versant: side, profils: [{ des: '1d10' }] }), side)
    const kept = cleanAction({
        nom: 'Coup',
        degats: {
            versant: 'inconnu',
            profils: [{ des: '1d10', nature: 'inconnue' }],
        },
    }) as { degats: { versant: string; profils: { nature: string }[] } }
    assert.equal(kept.degats.versant, 'inconnu')
    assert.equal(kept.degats.profils[0].nature, 'inconnue')
}

function assertActionEditorSummaries() {
    assert.equal(actionSummary({}), undefined)
    assert.equal(
        actionSummary({
            nom: 'Morsure',
            test: { nom: 'Mordre', pourcentage: 45 },
            degats: { profils: [{ des: '' }, { des: '2d10' }] },
        }),
        'Morsure · Mordre 45 % · 2d10'
    )
    assert.equal(
        actionSummary({
            test: {
                nom: 'Lutte',
                pourcentage: { minimum: 0, current: 30, maximum: 30 },
            },
        }),
        'Lutte 30 %',
        'a triplet is summarised by its current value'
    )
    // What is typed stays a draft the panels signal; a percentage is never invented, and the
    // export (`compactAgainst`) leaves the incomplete test out.
    assert.deepStrictEqual(
        cleanAction({ test: { nom: '', pourcentage: 40 } }),
        { test: { pourcentage: 40 } }
    )
    assert.deepStrictEqual(cleanAction({ test: { nom: 'Mordre' } }), {
        test: { nom: 'Mordre' },
    })
    assert.equal(
        compactAgainst('monstre', { actions: [{ test: { nom: 'Mordre' } }] }),
        undefined
    )
    // Empty damage and an empty test, as the always visible fields leave them: the draft keeps the
    // zero it shows, the export writes nothing.
    assert.equal(
        compactAgainst('monstre', {
            actions: [
                cleanAction({
                    nom: '',
                    test: { nom: '', pourcentage: 0 },
                    degats: { profils: [{ des: '' }] },
                }),
            ],
        }),
        undefined
    )
    assert.equal(hasMoreFields({ nom: 'A' }), false)
    assert.equal(hasMoreFields({ degats: { liant: 'ou' } }), true)
    assert.equal(hasMoreFields({ conditions: ['Au contact'] }), true)
    assert.equal(hasMoreFields({ notes: '  ' }), false)
}

function assertLegacyRangeKeyPresence() {
    /* Each target is given a source of its own form: the keys a source lacks stay absent, none is restored. */
    const playerSource = {
        caracteristiques: { for: 45, con: 60 },
        sante: { physique: { superficiel: { base: 2 } } },
    }
    const upgraded = upgradeLegacyAdrenalineRanges(
        playerSource,
        'adrenaline/pj'
    ) as {
        caracteristiques: Record<string, unknown>
        sante: { physique: { superficiel: Record<string, unknown> } }
    }
    assert.deepStrictEqual(Object.keys(upgraded.caracteristiques), [
        'for',
        'con',
    ])
    for (const key of ['dex', 'rap', 'per'])
        assert.equal(
            Object.hasOwn(upgraded.caracteristiques, key),
            false,
            `adrenaline/pj: the absent "${key}" is not restored`
        )
    assert.deepStrictEqual(Object.keys(upgraded.sante.physique), [
        'superficiel',
    ])
    assert.deepStrictEqual(Object.keys(upgraded.sante.physique.superficiel), [
        'base',
    ])
    assert.equal(
        Object.values(upgraded.caracteristiques).some(
            (value) => value === undefined
        ),
        false
    )
    /* The 5.0.0 player sheet carries a characteristic as a plain number, not a triplet. */
    assert.equal(upgraded.caracteristiques.for, 45)
    assert.deepStrictEqual(playerSource.caracteristiques, { for: 45, con: 60 })

    /* A creature or a PNJ keeps the plain number, key for key. */
    const creatureSource = {
        caracteristiques: { for: 45, con: 60, dex: 25, rap: 30 },
        etatAlternatif: {
            nom: 'Stimulé',
            caracteristiques: { rap: 55, per: 50 },
        },
    }
    const npcSource = {
        caracteristiques: { for: 30, per: 40 },
        sante: { physique: { superficiel: { base: 2 } } },
    }
    for (const [target, own] of [
        ['adrenaline/monstre', creatureSource],
        ['adrenaline/pnj', npcSource],
    ] as const)
        assert.deepStrictEqual(
            upgradeLegacyAdrenalineRanges(own, target),
            own,
            `${target} keeps its plain numbers`
        )
    const player = upgradeLegacyAdrenalineRanges(
        { caracteristiques: { for: 45 } },
        'adrenaline/pj'
    ) as { caracteristiques: { for: number } }
    assert.equal(player.caracteristiques.for, 45)

    /* The real round trip an import and an export make: read the TOML, write it back. */
    const roundTrip = (target: string, toml: string) => {
        const read = parseAdrenalineToml<Record<string, unknown>>(target, toml)
        return {
            read,
            written: parseAdrenalineToml<Record<string, unknown>>(
                target,
                stringifyAdrenalineToml(target, read)
            ),
        }
    }
    const published = (target: string, file: string) =>
        parseToml(
            fs.readFileSync(
                `node_modules/schema-adrenaline/examples/${target}/${file}`,
                'utf8'
            )
        ) as { caracteristiques: Record<string, unknown> }
    const asNumbers = (document: {
        caracteristiques: Record<string, unknown>
    }) => {
        for (const key of Object.keys(document.caracteristiques))
            document.caracteristiques[key] = (
                document.caracteristiques[key] as { current: number }
            ).current
        return document
    }
    for (const [target, file] of [
        ['adrenaline/monstre', 'infecte-zy-2.toml'],
        ['adrenaline/pnj', 'agent-de-securite.toml'],
    ]) {
        const document = asNumbers(published(target, file))
        const entered = { ...document.caracteristiques }
        const { read, written } = roundTrip(target, stringifyToml(document))
        for (const result of [read, written])
            assert.deepStrictEqual(
                result.caracteristiques,
                entered,
                `${target}: plain numbers stay numbers through the round trip`
            )
    }
    /* The 5.0.0 player sheet: a plain number stays a plain number, and an older triplet is read
     * as its current value. */
    const sheet = published('adrenaline/pj', 'figurant-minimal.toml')
    sheet.caracteristiques.for = 40
    sheet.caracteristiques.con = { minimum: 10, current: 35, maximum: 50 }
    const { read: pj, written: pjWritten } = roundTrip(
        'adrenaline/pj',
        stringifyToml(sheet)
    )
    for (const result of [pj, pjWritten]) {
        const values = result.caracteristiques as Record<string, unknown>
        assert.equal(
            values.for,
            40,
            'adrenaline/pj: a plain number stays a plain number through the round trip'
        )
        assert.equal(
            values.con,
            35,
            'adrenaline/pj: an older triplet is read as its current value'
        )
    }
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
    assertMonsterStateHelpers()
    assertLegacyRangeKeyPresence()
    assertActionEditorOutput()
    assertActionEditorSummaries()
    assertDamageEnumerations()
    assertDeltaEdit()
    assertGiveAndTakeBack()
    assertClickedZonesAreEditable()
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
