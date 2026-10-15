/* global console */
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'
import monstreSchema from 'schema-adrenaline/schemas/monstre.schema.json'
import pjSchema from 'schema-adrenaline/schemas/pj.schema.json'
import pnjSchema from 'schema-adrenaline/schemas/pnj.schema.json'
import type { AdrenalinePj } from '../src/contracts/adrenaline'
import '../src/i18n'
import { translate } from '../src/i18n/text'
import { MonstreEditorPanel } from '../src/templates/adrenaline/monstre/editor/MonstreEditorPanel'
import {
    blankMonstre,
    sampleMonstre,
} from '../src/templates/adrenaline/monstre/sample'
import { exportToTOML as exportMonstre } from '../src/templates/adrenaline/monstre/toml'
import {
    PjEditorPanel,
    PjPanels,
    showsIdentityEntry,
} from '../src/templates/adrenaline/pj/editor/PjEditorPanel'
import { publishedNatures } from '../src/templates/adrenaline/pj/editor/zone'
import { blankPj, samplePj } from '../src/templates/adrenaline/pj/sample'
import {
    exportToTOML,
    importFromTOML,
} from '../src/templates/adrenaline/pj/toml'
import { PnjEditorPanel } from '../src/templates/adrenaline/pnj/editor/PnjEditorPanel'
import { blankPnj, samplePnj } from '../src/templates/adrenaline/pnj/sample'
import { exportToTOML as exportPnj } from '../src/templates/adrenaline/pnj/toml'
import { pjLimit } from '../src/templates/adrenaline/shared/editor/pjLimits'
import { compactAgainst } from '../src/templates/adrenaline/shared/editor/schemaCompact'
import { FORMATION_TYPES } from '../src/templates/adrenaline/shared/formations'
import { editTarget } from '../src/templates/adrenaline/shared/presentation'
import { PresentationBlock } from '../src/templates/adrenaline/shared/preview/PresentationBlocks'
import { WEAPON_FIELDS } from '../src/templates/adrenaline/shared/schemaFields'
import {
    monstreSections,
    pjSections,
    pnjSections,
    type PjSection,
} from '../src/templates/adrenaline/shared/sections'
import { NOT_EDITABLE_LEAVES } from './adrenalineNotEditable.mjs'
import {
    linkedStatus,
    lines,
    probePanel,
    type Failure,
    type Panel,
    type Node as SchemaNode,
    type Surface,
} from './assertAdrenalinePj.editors.mts'

/* The fields tell one another a value was validated through the document: the server has none, an event target stands in. */
const host = globalThis as unknown as { document?: EventTarget }
host.document ??= new EventTarget()

const read = (source: string) => importFromTOML(source).pj
const roundTrip = (document: AdrenalinePj) => read(exportToTOML(document))

/* The published worked example comes back from the export unchanged. */
const example = samplePj()
assert.deepEqual(roundTrip(example), example, 'the published example')

/* A sheet typed in Lantern with the 5.0.0 fields: written as TOML, read back the same. */
const typed = {
    ...example,
    parametresDuJeu: {
        ...example.parametresDuJeu,
        scenario: 'Les Brumes du Nord',
    },
    identite: {
        ...example.identite,
        contraintes: {
            professionnelles: 'Astreinte de nuit',
            familiales: 'Une fille a charge',
            engagementsExterieurs: 'Reserviste',
        },
        historique: 'Ancien urgentiste.\nDeux ans en zone de conflit.',
        personnalite: 'Calme, tetue.',
    },
    equipement: {
        ...example.equipement,
        armesPhysiques: [
            { nom: 'Matraque', nature: 'choquante' },
            { nom: 'Couteau', nature: 'blessante' },
            { nom: 'Pistolet' },
        ],
        avantagesEtImmunites: ['Vision nocturne', 'Immunise au gaz'],
    },
    etatDePartie: {
        stress: { adrenaline: 40, panique: 10 },
        malus: {
            choc: { rounds: 2 },
            divers: 'Fatigue',
            diversCercles: 3,
            total: 5,
        },
        blessures: {
            physiques: {
                premiereColonne: { heure: true, notes: 'Contusion au torse' },
                secondeColonne: { mois: true },
            },
            mentales: { premiereColonne: { jour: true } },
        },
        etats: 'Commotion\nPeur panique jusqu à la fin de la scène',
    },
} as unknown as AdrenalinePj
const back = roundTrip(typed)
assert.deepEqual(back, typed, 'a sheet with the fields added in 5.0.0')

/* A second pass changes nothing, and equipment holds no mental weapons. */
assert.equal(exportToTOML(back), exportToTOML(typed), 'a stable export')
assert.equal(
    'armesMentales' in ((back.equipement ?? {}) as object),
    false,
    'armesMentales left the equipment'
)

/* Blanks kept while typing are not part of the document. */
const typing = {
    ...typed,
    identite: { ...typed.identite, historique: '', contraintes: {} },
    equipement: { ...typed.equipement, avantagesEtImmunites: [] },
} as unknown as AdrenalinePj
const cleaned = roundTrip(typing)
assert.equal(
    (cleaned.identite as { historique?: string }).historique,
    undefined,
    'a blank text is dropped'
)

/* The natures the weapon selector offers are the legend of the reference table, and the nature typed on a sheet is one of them (so the selector shows it back). */
const natures = publishedNatures()
assert.ok(natures.length > 0, 'the legend publishes damage natures')
const weapons =
    ((example.equipement ?? {}) as { armesPhysiques?: { nature?: string }[] })
        .armesPhysiques ?? []
const typedNatures = weapons.reduce<string[]>(
    (all, weapon) => (weapon.nature ? all.concat(weapon.nature) : all),
    []
)
assert.ok(typedNatures.length > 0, 'the example types a nature on a weapon')
typedNatures.forEach((nature) =>
    assert.ok(
        natures.some((published) => published.value === nature),
        `the nature ${nature} of the example is offered by the selector`
    )
)

/*
 * The panels, rendered: every leaf of the PJ schema has a field in some panel.
 *
 * The leaves come from the schema, never from a list kept here. A document holding one distinct
 * value per leaf is rendered through the real panels (`PjPanels`), then each leaf is changed alone:
 * the markup must change and show the new value. A leaf whose change leaves the panels as they were
 * has no field. The exceptions are `NOT_EDITABLE_LEAVES`, by pointer.
 */
type Node = {
    type?: string
    properties?: Record<string, Node>
    items?: Node
    oneOf?: Node[]
    const?: unknown
    enum?: unknown[]
    minimum?: number
    maximum?: number
}
type Leaf = {
    pointer: string
    kind: 'text' | 'number' | 'enum' | 'flag' | 'list'
    order: number
    node: Node
}

const leaves: Leaf[] = []
const collect = (node: Node, pointer: string) => {
    /* A constant is the variant a value is of, not a value typed. */
    if (node.const !== undefined) return
    const properties = node.properties
    if (node.type === 'object' && properties) {
        Object.keys(properties).forEach((key) =>
            collect(properties[key], `${pointer}/${key}`)
        )
        return
    }
    const variants = node.type === 'array' ? node.items?.oneOf : undefined
    if (variants) {
        variants.forEach((variant, index) =>
            collect(variant, `${pointer}[]#${index}`)
        )
        return
    }
    if (node.type === 'array' && node.items?.type === 'object') {
        collect(node.items, `${pointer}[]`)
        return
    }
    const kind: Leaf['kind'] =
        node.type === 'array'
            ? 'list'
            : node.enum
              ? 'enum'
              : node.type === 'boolean'
                ? 'flag'
                : node.type === 'integer' || node.type === 'number'
                  ? 'number'
                  : 'text'
    leaves.push({ pointer, kind, order: leaves.length, node })
}
const schemaRoot = pjSchema as unknown as Node
collect(schemaRoot, '')
assert.ok(leaves.length > 60, 'the schema yields its leaves')

const valueOf = (leaf: Leaf, changed: boolean): unknown => {
    const step = changed ? 1 : 0
    const { node } = leaf
    if (leaf.kind === 'flag') return !changed
    if (leaf.kind === 'number') {
        const low = node.minimum ?? 0
        const high = node.maximum ?? low + 5000
        /*
         * The three numbers of a triplet get three distinct values in the order the document keeps
         * (minimum < current < maximum, each with room to move by one): a value that equals a
         * neighbour, or that sits on a bound, would let a field that confuses them pass. A scalar
         * gets a value of its own.
         */
        const role = /\/(minimum|current|maximum)$/.exec(leaf.pointer)?.[1]
        const span = Math.max(high - low, 6)
        const base =
            role === 'minimum'
                ? low + 2
                : role === 'current'
                  ? low + Math.floor(span / 2)
                  : role === 'maximum'
                    ? low + span - 2
                    : Math.min(Math.max(low, 100 + leaf.order * 3), high - 1)
        return base + step
    }
    const choices = (node.type === 'array' ? node.items?.enum : node.enum) ?? []
    if (choices.length > 1)
        return node.type === 'array' ? [choices[step]] : choices[step]
    const text = `${changed ? 'm' : 'v'}-${leaf.order}`
    return node.type === 'array' ? [text] : text
}

/* The document, one value per leaf; `changed` alters the single leaf with that pointer. */
const build = (node: Node, pointer: string, changed?: string): unknown => {
    if (node.const !== undefined) return node.const
    const properties = node.properties
    if (node.type === 'object' && properties) {
        return Object.keys(properties).reduce<Record<string, unknown>>(
            (all, key) => ({
                ...all,
                [key]: build(properties[key], `${pointer}/${key}`, changed),
            }),
            {}
        )
    }
    const variants = node.type === 'array' ? node.items?.oneOf : undefined
    if (variants)
        return variants.map((variant, index) =>
            build(variant, `${pointer}[]#${index}`, changed)
        )
    if (node.type === 'array' && node.items?.type === 'object')
        return [build(node.items, `${pointer}[]`, changed)]
    const leaf = leaves.find((entry) => entry.pointer === pointer)
    assert.ok(leaf, `leaf ${pointer}`)
    return valueOf(leaf, changed === pointer)
}
const baseDocument = build(schemaRoot, '') as Record<string, unknown>

/* Block ids of the zones a click can open, by the document path they print. */
const blockIds = (prefix: string) =>
    (
        PJ_PRESENTATION.sections as readonly {
            blocks: readonly { id: string; paths: readonly string[] }[]
        }[]
    ).flatMap((section) =>
        section.blocks
            .filter((block) =>
                block.paths.some((path) => path.indexOf(prefix) === 0)
            )
            .map((block) => block.id)
    )

/* Every panel, whole (the section list) and zone by zone (a click on the sheet). */
const variants: { target: PjSection; keys?: string[] }[] = [
    ...pjSections.map((section) => ({ target: section.id as PjSection })),
    ...FORMATION_TYPES.flatMap((type) =>
        [0, 1, 2, 3, 4].map((rank) => ({
            target: 'formations' as PjSection,
            keys: [
                ...blockIds('/formations'),
                `formation:${type}`,
                `skill:${type}:${rank}`,
            ],
        }))
    ),
    ...[0, 1, 2, 3].map((index) => ({
        target: 'equipment' as PjSection,
        keys: [...blockIds('/equipement/'), `weapon:${index}`],
    })),
]
const render = (
    document: Record<string, unknown>,
    target: PjSection,
    keys?: string[]
) =>
    renderToStaticMarkup(
        createElement(PjPanels, {
            document,
            set: () => undefined,
            target,
            keys,
        })
    )
const panels = (document: Record<string, unknown>) =>
    variants
        .map(({ target, keys }) => render(document, target, keys))
        .join('\n<!--panel-->\n')

const baseMarkup = panels(baseDocument)
const notEditable = new Set<string>(NOT_EDITABLE_LEAVES.pj)
const editable: string[] = []
const lacking: string[] = []
leaves.forEach((leaf) => {
    const changed = build(schemaRoot, '', leaf.pointer) as Record<
        string,
        unknown
    >
    const markup = panels(changed)
    const next = valueOf(leaf, true)
    const value = String(Array.isArray(next) ? next[0] : next)
    /* A field shows the value as its own: one more input or text holding exactly it than in the base. */
    const shownIn = (source: string) =>
        (source.match(new RegExp(`(?:value="|>)${value}(?:"|<)`, 'g')) ?? [])
            .length
    const shown =
        markup !== baseMarkup &&
        (leaf.kind === 'enum'
            ? /* A selector shows it selected: a text field holding the value is a free-text enumeration, which is not a field of it. */
              markup.indexOf(`<option value="${value}" selected`) >= 0
            : leaf.kind === 'text' || leaf.kind === 'number'
              ? shownIn(markup) > shownIn(baseMarkup)
              : true)
    if (shown) editable.push(leaf.pointer)
    else lacking.push(leaf.pointer)
})
const missing = lacking.filter((pointer) => !notEditable.has(pointer))
assert.deepEqual(
    missing,
    [],
    `leaves of pj.schema.json without a field in the PJ panels: ${missing.join(', ')}`
)
const stale = editable.filter((pointer) => notEditable.has(pointer))
assert.deepEqual(
    stale,
    [],
    `declared not editable but a field carries them, remove from NOT_EDITABLE_LEAVES: ${stale.join(', ')}`
)
const unknown = [...notEditable].filter(
    (pointer) => !leaves.some((leaf) => leaf.pointer === pointer)
)
assert.deepEqual(unknown, [], 'NOT_EDITABLE_LEAVES names leaves of the schema')

/* The nature selector offers every published nature, and shows the one typed on the weapon. */
const weaponKey = WEAPON_FIELDS.pj[0]
const equipmentWith = (nature?: string) =>
    render(
        {
            equipement: {
                [weaponKey]: [
                    { nom: 'Matraque', ...(nature ? { nature } : {}) },
                ],
            },
        },
        'equipment',
        [...blockIds('/equipement/'), 'weapon:0']
    )
const option = (value: string) =>
    new RegExp(`<option value="${value}"( selected="")?[^>]*>([^<]*)</option>`)
natures.forEach((nature) => {
    const offered = option(nature.value).exec(equipmentWith())
    assert.ok(offered, `the selector offers the nature ${nature.value}`)
    assert.equal(offered[2], nature.label, `${nature.value} is labelled`)
    const typedOn = equipmentWith(nature.value)
    assert.ok(
        option(nature.value).exec(typedOn)?.[1],
        `the selector shows the nature ${nature.value} typed on the weapon`
    )
    natures
        .filter((other) => other.value !== nature.value)
        .forEach((other) =>
            assert.ok(
                !option(other.value).exec(typedOn)?.[1],
                `only ${nature.value} is selected`
            )
        )
})

/*
 * Typing through the rendered panel. The panel is rendered, a field is found by its label, the
 * handlers it hands its input are called as the browser would, and what the panel wrote is read
 * back from the document: a field that writes to another key, or a click that writes, fails here.
 */
type Event = {
    target: { value: string }
    currentTarget: { value: string }
    key?: string
}
type Control = Record<string, ((event: Event) => void) | undefined>
const hooks = globalThis as unknown as {
    __lanternControls?: Control[]
    __lanternSlots?: { values: unknown[]; cursor: number }
}
hooks.__lanternControls = []
const escapeRegExp = (source: string) =>
    source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const typingSession = (
    start: Record<string, unknown>,
    target: PjSection,
    keys?: string[]
) => {
    let current = JSON.parse(JSON.stringify(start)) as Record<string, unknown>
    const writes: string[] = []
    const store = { values: [] as unknown[], cursor: 0 }
    let markup = ''
    const draw = () => {
        hooks.__lanternControls!.length = 0
        store.cursor = 0
        hooks.__lanternSlots = store
        try {
            markup = renderToStaticMarkup(
                createElement(PjPanels, {
                    document: current,
                    set: (key: string, value: unknown) => {
                        writes.push(key)
                        current = { ...current, [key]: value }
                    },
                    target,
                    keys,
                })
            )
        } finally {
            hooks.__lanternSlots = undefined
        }
    }
    draw()
    const controls = (label: string): Control[] =>
        [
            ...markup.matchAll(
                new RegExp(
                    `>${escapeRegExp(label)}</(?:span|label)>(?:<[^>]*>)*?<input[^>]*data-control="(\\d+)"`,
                    'g'
                )
            ),
        ].map((found) => hooks.__lanternControls![Number(found[1])])
    return {
        writes,
        document: () => current,
        markup: () => markup,
        /** Types `value` in the `nth` field named `label` (counted from the end when negative), then validates it. */
        type: (label: string, value: string, nth = 0) => {
            const found = controls(label)
            assert.ok(found.length > 0, `a field named "${label}"`)
            const index = nth < 0 ? found.length + nth : nth
            const event = { target: { value }, currentTarget: { value } }
            found[index].onChange?.(event)
            draw()
            const again = controls(label)[index]
            again.onKeyDown?.({ ...event, key: 'Enter' })
            draw()
        },
    }
}
const ui = (key: string) => translate(key as Parameters<typeof translate>[0])
type Session = ReturnType<typeof typingSession>

/* A number typed in the stress block lands on its own key, and a number out of bounds is held and signalled. */
{
    const panic = ui('adrenaline:pj.sheet.panic')
    const adrenaline = ui('adrenaline:pj.sheet.adrenaline')
    const stress = (session: Session) =>
        (
            (session.document().etatDePartie ?? {}) as Record<
                string,
                Record<string, unknown>
            >
        ).stress ?? {}
    const session = typingSession({}, 'health')
    session.type(panic, '3')
    assert.deepEqual(
        stress(session),
        { panique: 3 },
        'panic is written to panique'
    )
    session.type(adrenaline, '2')
    assert.deepEqual(
        stress(session),
        { panique: 3, adrenaline: 2 },
        'adrenaline is written to adrenaline, panic is left as it was'
    )
    const bound = pjLimit('/etatDePartie/stress/panique')
    assert.ok(bound?.max !== undefined, 'the schema bounds the panic')
    session.type(panic, String(bound.max + 100))
    assert.equal(
        stress(session).panique,
        bound.max,
        'a panic above the published bound is brought back to it'
    )
    assert.ok(
        session.markup().includes('role="alert"'),
        'the bound that held the panic is signalled'
    )
}

/*
 * A triplet that holds nothing yet takes the first number typed as it is typed. The minimum is
 * bounded by the current value only once the triplet is set: typing it first never brings it back
 * to 0, nor writes a 0/0/0 that was not typed.
 */
{
    const minimum = ui('adrenaline:shared.range.min')
    const session = typingSession({}, 'parameters')
    session.type(minimum, '5')
    const written = JSON.stringify(session.document())
    assert.ok(
        written.indexOf('"minimum":5') >= 0,
        `a minimum typed first on an empty triplet is kept as typed: ${written}`
    )
    assert.ok(
        session.markup().indexOf('role="alert"') < 0,
        'the minimum typed first on an empty triplet is not signalled as out of bounds'
    )
}

/* The paper sheet prints neither a shield nor a toughness: the protections panel offers neither. */
{
    const session = typingSession({}, 'protections')
    const markup = session.markup()
    for (const key of [
        'adrenaline:shared.protection.shield',
        'adrenaline:shared.protection.toughness',
    ]) {
        assert.ok(
            markup.indexOf(`>${ui(key)}<`) < 0,
            `the protections panel carries no field named ${key}`
        )
    }
    assert.ok(
        markup.indexOf(ui('adrenaline:shared.protection.armour')) >= 0,
        'the armour stays in the protections panel'
    )
}

/* Opening an empty weapon line writes nothing; the first thing typed in it adds that line alone. */
{
    const written = (
        (example.equipement as Record<string, unknown[]>)[weaponKey] ?? []
    ).length
    const opened = typingSession(
        JSON.parse(JSON.stringify(example)),
        'equipment',
        [...blockIds('/equipement/'), `weapon:${written}`]
    )
    assert.deepEqual(
        opened.writes,
        [],
        'a click on an empty weapon line writes nothing'
    )
    opened.type(ui('fields.name'), 'Hache', -1)
    const weaponsAfter = (
        opened.document().equipement as Record<
            string,
            Record<string, unknown>[]
        >
    )[weaponKey]
    assert.equal(weaponsAfter.length, written + 1, 'one weapon line is added')
    assert.equal(
        weaponsAfter[written].nom,
        'Hache',
        'the line holds what was typed'
    )
    assert.deepEqual(
        weaponsAfter.slice(0, written),
        (example.equipement as Record<string, unknown[]>)[weaponKey],
        'the lines already written are untouched'
    )
}

/* The sheet: each weapon line is its own click zone, each wound sits in the column the document names. */
{
    type SheetBlock = {
        id: string
        paths: string[]
        decoration?: {
            kind?: string
            columns?: { key: string }[]
            durations?: string[]
        }
    }
    const blocks = (
        PJ_PRESENTATION.sections as unknown as { blocks: SheetBlock[] }[]
    ).flatMap((section) => section.blocks)
    const drawBlock = (block: SheetBlock, source: unknown) =>
        renderToStaticMarkup(
            createElement(PresentationBlock, {
                block,
                source: source as Record<string, unknown>,
                onOpen: () => undefined,
            })
        )
    const weaponBlocks = blocks.filter((block) =>
        block.paths.some(
            (path: string) => path.indexOf(`/equipement/${weaponKey}`) === 0
        )
    )
    assert.ok(weaponBlocks.length > 0, 'the sheet prints the weapon lines')
    weaponBlocks.forEach((block) => {
        const zones = [
            ...drawBlock(block, example).matchAll(/data-zone="weapon:(\d+)"/g),
        ].map((found) => Number(found[1]))
        assert.ok(zones.length >= 3, 'the sheet has several weapon lines')
        assert.deepEqual(
            zones,
            zones.map((_, index) => index),
            'each weapon line carries its own index as click zone'
        )
    })

    const woundBlocks = blocks.filter(
        (block) => block.decoration?.kind === 'wound-circles'
    )
    assert.ok(woundBlocks.length > 0, 'the sheet prints wounds')

    /* As on the paper: one panel per column, one line (circle, then duration) per published duration, then a writing area. */
    woundBlocks.forEach((block) => {
        const { columns, durations, circles } = block.decoration as {
            columns: { key: string }[]
            durations: string[]
            circles: number
        }
        assert.ok(circles >= 1, `${block.id}: the wounds print circles`)
        const path = (block.paths[0] as string).split('/').filter(Boolean)
        const nest = (leaf: unknown) => {
            let node: unknown = leaf
            for (let index = path.length - 1; index >= 0; index -= 1)
                node = { [path[index]]: node }
            return node
        }
        const linesOf = (source: unknown) =>
            drawBlock(block, source)
                .split('adr-pj__wound-line')
                .slice(1)
                .map((line) => ({
                    marks: line.split('adr-pj__dot-mark').length - 1,
                    filled: line.split('adr-pj__dot-filled').length - 1,
                }))
        const nothing = linesOf({})
        assert.equal(
            nothing.length,
            columns.length * durations.length,
            `${block.id}: one line per duration and column`
        )
        nothing.forEach((line, index) => {
            assert.equal(
                line.marks,
                circles,
                `${block.id}: line ${index} prints every circle`
            )
            assert.equal(
                line.filled,
                0,
                `${block.id}: an absent wound ticks no circle`
            )
        })
        /* One wound ticked: its own line fills, no other, and the entered text lands in the writing area. */
        durations.forEach((duration, row) =>
            columns.forEach((column, col) => {
                const source = nest({
                    [column.key]: { [duration]: true, notes: 'Contusion' },
                })
                const html = drawBlock(block, source)
                const lines = linesOf(source)
                assert.deepEqual(
                    lines.map((line) => line.filled),
                    lines.map((_, index) =>
                        index === col * durations.length + row ? circles : 0
                    ),
                    `${block.id}: ${duration} in ${column.key} ticks its own line only`
                )
                assert.ok(
                    html.indexOf('Contusion') >= 0,
                    `${block.id}: the entered text is printed in the writing area`
                )
            })
        )
    })

    /* Blank lines: the contract says how many a ruled list or a weapon list prints, the sheet follows it. */
    const lined = blocks.filter(
        (block) =>
            (block.form === 'ruled-list' || block.form === 'weapon-lines') &&
            typeof (block as { minimumRows?: number }).minimumRows === 'number'
    )
    assert.ok(lined.length >= 3, 'the sheet has lists with a published minimum')
    lined.forEach((block) => {
        const minimum = (block as { minimumRows?: number })
            .minimumRows as number
        const marker =
            block.form === 'weapon-lines'
                ? 'data-zone="weapon:'
                : 'adr-pj__ruled-line'
        const count = (source: unknown) =>
            drawBlock(block, source).split(marker).length - 1
        const path = (block.paths[0] as string).split('/').filter(Boolean)
        const nest = (leaf: unknown) => {
            let node: unknown = leaf
            for (let index = path.length - 1; index >= 0; index -= 1)
                node = { [path[index]]: node }
            return node
        }
        const item = (index: number) =>
            block.form === 'weapon-lines'
                ? { nom: `arme ${index}` }
                : `ligne ${index}`
        assert.equal(
            count({}),
            minimum,
            `${block.id}: an empty sheet prints the ${minimum} lines the contract publishes`
        )
        assert.equal(
            count(nest([item(1)])),
            minimum,
            `${block.id}: one entry fills one of the ${minimum} lines`
        )
        assert.equal(
            count(nest(Array.from({ length: minimum + 2 }, (_, i) => item(i)))),
            minimum + 2,
            `${block.id}: entries beyond the minimum are all printed`
        )
    })

    /* Locations: each covered location ticks exactly its own first box, the others none. */
    const gridBlocks = blocks.filter(
        (block) => block.decoration?.kind === 'location-grid'
    )
    assert.ok(gridBlocks.length > 0, 'the sheet prints the location grids')
    gridBlocks.forEach((block) => {
        const grid = block.decoration as unknown as {
            side: string
            boxes: number
            locations: { id: string }[]
        }
        const path = (block.paths[0] as string).split('/').filter(Boolean)
        const coverKey = grid.side === 'physical' ? 'armure' : 'caractere'
        const nest = (leaf: unknown) => {
            let node: unknown = { [coverKey]: leaf }
            for (let index = path.length - 1; index >= 0; index -= 1)
                node = { [path[index]]: node }
            return node
        }
        const rows = (source: unknown) =>
            drawBlock(block, source)
                .split('<div class="adr-pj__location">')
                .slice(1)
                .map((row) => ({
                    marks: row.split('adr-pj__dot-mark').length - 1,
                    filled: row.split('adr-pj__dot-filled').length - 1,
                }))
        assert.ok(grid.locations.length >= 3, `${block.id}: several locations`)
        rows({}).forEach((row, index) => {
            assert.equal(
                row.filled,
                0,
                `${block.id}: no cover ticks location ${index}`
            )
        })
        grid.locations.forEach((location, index) => {
            const found = rows(nest({ localisations: [location.id] }))
            assert.equal(
                found.length,
                grid.locations.length,
                `${block.id}: every location is printed`
            )
            found.forEach((row, at) => {
                assert.equal(
                    row.marks,
                    grid.boxes,
                    `${block.id}: location ${at} prints its boxes`
                )
                assert.equal(
                    row.filled,
                    at === index ? 1 : 0,
                    `${block.id}: ${location.id} covered ticks one box of its own row and no other`
                )
            })
        })
        const two = rows(
            nest({
                localisations: [grid.locations[0].id, grid.locations[2].id],
            })
        )
        assert.deepEqual(
            two.map((row) => row.filled),
            grid.locations.map((_, index) =>
                index === 0 || index === 2 ? 1 : 0
            ),
            `${block.id}: two covered locations tick two rows`
        )
        const unknown = rows(nest({ localisations: ['nowhere'] }))
        assert.equal(
            unknown.reduce((sum, row) => sum + row.filled, 0),
            0,
            `${block.id}: an unknown location ticks nothing`
        )
    })

    /* Stress: the value picks one die of its own card, the other card stays untouched. */
    const stressBlocks = blocks.filter(
        (block) => block.decoration?.kind === 'dice-options'
    )
    assert.ok(stressBlocks.length > 0, 'the sheet prints the stress dice')
    stressBlocks.forEach((block) => {
        const dice = block.decoration as unknown as {
            favorable?: string[]
            defavorable?: string[]
        }
        const path = (block.paths[0] as string).split('/').filter(Boolean)
        const nest = (leaf: unknown) => {
            let node: unknown = leaf
            for (let index = path.length - 1; index >= 0; index -= 1)
                node = { [path[index]]: node }
            return node
        }
        const cards = (source: unknown) =>
            drawBlock(block, source)
                .split('adr-pj__stress-card')
                .slice(1)
                .map((card) =>
                    card
                        .split('adr-pj__stress-roll')
                        .slice(1)
                        .map(
                            (roll) =>
                                roll.split('adr-pj__dot-filled').length - 1
                        )
                )
        const keys = [
            ['adrenaline', dice.favorable ?? []],
            ['panique', dice.defavorable ?? []],
        ] as const
        keys.forEach(([key, list], cardIndex) => {
            assert.ok(
                list.length >= 2,
                `${block.id}: ${key} offers several dice`
            )
            for (let value = 1; value <= list.length; value += 1) {
                const found = cards(nest({ [key]: value }))
                found.forEach((rolls, index) => {
                    assert.deepEqual(
                        rolls,
                        rolls.map((_, roll) =>
                            index === cardIndex && roll === value - 1 ? 1 : 0
                        ),
                        `${block.id}: ${key} ${value} ticks the die ${value} of its card only`
                    )
                })
            }
            ;[0, list.length + 1, 99].forEach((value) => {
                cards(nest({ [key]: value })).forEach((rolls) =>
                    assert.deepEqual(
                        rolls,
                        rolls.map(() => 0),
                        `${block.id}: ${key} ${value} ticks no die`
                    )
                )
            })
        })
    })
}

/*
 * Every field of every editor, used from a start document, and the document read back: what each
 * writes is declared by the schema of its type, a real export after it raises nothing, the field
 * shows what it wrote, and nothing is written behind it. PJ, PNJ and creature alike.
 */
type Block = {
    id: string
    paths: string[]
    pointerRows?: { path: string }[][]
}
const sheetBlocks = (
    PJ_PRESENTATION.sections as unknown as { blocks: Block[] }[]
).flatMap((section) => section.blocks)
const setOn =
    (state: { doc: Record<string, unknown> }) =>
    (key: string, value: unknown) => {
        const next = { ...state.doc }
        if (value === undefined) delete next[key]
        else next[key] = value
        state.doc = next
    }
const pjSurface: Surface = {
    name: 'PJ',
    schema: pjSchema as unknown as SchemaNode,
    /* A formation line is created in the column of its type. */
    identity: ['/formations[]/type'],
    addLabel: ui('actions.add'),
    validate: (document) =>
        void exportToTOML(document as unknown as AdrenalinePj),
    exported: (document) => compactAgainst('pj', document),
    element: (panel, state) =>
        createElement(PjPanels, {
            document: state.doc,
            set: setOn(state),
            target: panel.target as PjSection,
            keys: panel.keys,
        }),
}
const pnjSurface: Surface = {
    name: 'PNJ',
    schema: pnjSchema as unknown as SchemaNode,
    addLabel: ui('actions.add'),
    validate: (document) => void exportPnj(document as never),
    exported: (document) => compactAgainst('pnj', document),
    element: () => createElement(PnjEditorPanel),
}
const monstreSurface: Surface = {
    name: 'creature',
    schema: monstreSchema as unknown as SchemaNode,
    addLabel: ui('actions.add'),
    validate: (document) => void exportMonstre(document as never),
    /* A state's `delta` spells "this state has no value" with an empty form the contract accepts. */
    emptyForms: ['/etats[]/delta/'],
    /* The id of a state is generated, the name is typed. */
    identity: ['/etats[]/id'],
    exported: (document) => compactAgainst('monstre', document),
    element: () => createElement(MonstreEditorPanel),
}
const named = (target: string, keys?: string[]): Panel => ({
    name: keys ? `${target}[${keys.join(',')}]` : target,
    target,
    keys,
})
const pjPanels: Panel[] = [
    ...variants.map(({ target, keys }) => named(target, keys)),
    /* A block that prints no document path opens nothing: the preview gives it no click. */
    ...sheetBlocks
        .filter((block) => block.paths.length > 0)
        .map((block) => named(editTarget(block as never), [block.id])),
    ...[0, 1, 2, 3, 4].map((index) =>
        named('equipment', [...blockIds('/equipement/'), `weapon:${index}`])
    ),
].filter(
    (panel, at, all) =>
        all.findIndex((other) => other.name === panel.name) === at
)
/* The published example, its first training stripped of its name and its second of its percentage. */
const unnamedTrainings = ((): Record<string, unknown> => {
    const doc = JSON.parse(JSON.stringify(example)) as {
        formations?: Record<string, unknown>[]
    }
    const columns = doc.formations ?? []
    assert.ok(columns.length >= 2, 'the example holds several trainings')
    assert.ok(
        columns.every(
            (column) =>
                Array.isArray(column.competences) &&
                column.competences.length > 0
        ),
        'the trainings of the example hold skills'
    )
    delete columns[0].nom
    delete columns[1].pourcentage
    return doc as Record<string, unknown>
})()
const failures: Failure[] = []
const proved: Record<string, number> = {}
const writtenBy = new Map<string, Set<string>>()
const runAll = (
    surface: Surface,
    panels: Panel[],
    starts: { name: string; doc: Record<string, unknown> }[]
) =>
    panels.forEach((panel) =>
        starts.forEach((start) => {
            const run = probePanel(surface, panel, start.doc, start.name)
            proved[surface.name] = (proved[surface.name] ?? 0) + run.controls
            failures.push(...run.failures)
            const key = `${surface.name}|${panel.name}`
            const all = writtenBy.get(key) ?? new Set<string>()
            run.written.forEach((pointer) => all.add(pointer))
            writtenBy.set(key, all)
        })
    )
runAll(pjSurface, pjPanels, [
    { name: 'example', doc: example as unknown as Record<string, unknown> },
    {
        name: 'blank sheet',
        doc: blankPj() as unknown as Record<string, unknown>,
    },
    { name: 'every leaf', doc: baseDocument },
    /*
     * Complete skills under a training that lacks its name, or its percentage: they stay on the
     * sheet and the export leaves them out, so every field of them must point at the status that says so.
     */
    { name: 'unnamed trainings', doc: unnamedTrainings },
])
runAll(
    pnjSurface,
    pnjSections.map((section) => named(section.id)),
    [
        {
            name: 'example',
            doc: samplePnj() as unknown as Record<string, unknown>,
        },
        {
            name: 'blank sheet',
            doc: blankPnj() as unknown as Record<string, unknown>,
        },
    ]
)
runAll(
    monstreSurface,
    monstreSections.map((section) => named(section.id)),
    [
        {
            name: 'example',
            doc: sampleMonstre() as unknown as Record<string, unknown>,
        },
        {
            name: 'blank sheet',
            doc: blankMonstre() as unknown as Record<string, unknown>,
        },
    ]
)

/*
 * A click zone opens exactly the fields the contract prints there: the leaves the zone's fields
 * wrote are the leaves under the paths its blocks print (and, for a path no block prints, the ones
 * next to what the zone prints), never those of another block.
 */
{
    const strip = (pointer: string) => pointer.replace(/\[\]|#\d+/g, '')
    const under = (pointer: string, root: string) =>
        pointer === root || pointer.indexOf(`${root}/`) === 0
    const parent = (pointer: string) =>
        pointer.slice(0, pointer.lastIndexOf('/'))
    const pointersOf = (block: Block) => [
        ...block.paths,
        ...(block.pointerRows ?? []).flatMap((row) =>
            row.map((cell) => cell.path)
        ),
    ]
    const printed = sheetBlocks.flatMap(pointersOf).map(strip)
    const declared = new Set(leaves.map((leaf) => strip(leaf.pointer)))
    const notEditableStripped = new Set([...notEditable].map(strip))
    /*
     * Who owns a leaf: the block that prints the most specific pointer holding it. A leaf no block
     * prints (a hidden path of the contract) goes to the zone that prints its siblings, as the
     * editor's `zoneCarries` does, and to no other.
     */
    const wanted = (own: string[], leaf: string) => {
        const covering = printed.filter((pointer) => under(leaf, pointer))
        if (covering.length > 0) {
            const nearest = covering.reduce((best, pointer) =>
                pointer.length > best.length ? pointer : best
            )
            return own.indexOf(nearest) >= 0
        }
        return own.some((pointer) => parent(pointer) === parent(leaf))
    }
    pjPanels
        .filter((panel) => panel.keys && panel.keys.length > 0)
        .forEach((panel) => {
            const ids = (panel.keys ?? []).filter((key) =>
                sheetBlocks.some((block) => block.id === key)
            )
            const own = sheetBlocks
                .filter((block) => ids.indexOf(block.id) >= 0)
                .flatMap(pointersOf)
                .map(strip)
            const wrote = new Set(
                [...(writtenBy.get(`PJ|${panel.name}`) ?? [])].map(strip)
            )
            const extra = [...wrote].filter(
                (pointer) => declared.has(pointer) && !wanted(own, pointer)
            )
            if (extra.length > 0)
                failures.push({
                    where: `PJ / ${panel.name}`,
                    what: `proposes fields the contract prints elsewhere: ${extra.join(', ')}`,
                })
            /* A list zone folds its rows: what a row opens is what the zone offers there. */
            const refined = pjPanels.filter(
                (other) =>
                    other !== panel &&
                    (panel.keys ?? []).every(
                        (key) => (other.keys ?? []).indexOf(key) >= 0
                    )
            )
            const reachable = new Set(wrote)
            for (const other of refined)
                for (const pointer of writtenBy.get(`PJ|${other.name}`) ?? [])
                    reachable.add(strip(pointer))
            const lacking = [...declared].filter(
                (pointer) =>
                    wanted(own, pointer) &&
                    !reachable.has(pointer) &&
                    !notEditableStripped.has(pointer) &&
                    !/^\/(?:parametresDuJeu|identite)$/.test(pointer)
            )
            const rows = panel.keys?.some((key) => /^(skill|weapon):/.test(key))
            if (lacking.length > 0 && !rows)
                failures.push({
                    where: `PJ / ${panel.name}`,
                    what: `lacks fields the contract prints there: ${lacking.join(', ')}`,
                })
        })
}

/* The way into an empty identity depends on the identity, never on a zone having been clicked. */
{
    const entry = ui('adrenaline:pj.form.addIdentity')
    const drawn = (doc: unknown, sheet: unknown) => {
        const edit = globalThis as unknown as { __lanternEdit?: unknown }
        edit.__lanternEdit = { doc, sheet }
        try {
            return renderToStaticMarkup(createElement(PjEditorPanel))
        } finally {
            edit.__lanternEdit = undefined
        }
    }
    const blankSheet = blankPj() as unknown as Record<string, unknown>
    assert.ok(
        drawn(blankSheet, { open: false, target: null }).indexOf(entry) >= 0,
        'a blank sheet with no zone open offers the identity'
    )
    pjSections
        .filter((section) => section.id !== 'identity')
        .forEach((section) =>
            assert.ok(
                drawn(blankSheet, {
                    open: true,
                    target: section.id,
                    keys: [section.id],
                }).indexOf(entry) >= 0,
                `a blank sheet with the ${section.id} panel open still offers the identity`
            )
        )
    assert.ok(
        !showsIdentityEntry(blankSheet, 'identity'),
        'the identity panel does not offer itself'
    )
    assert.ok(
        !showsIdentityEntry(
            example as unknown as Record<string, unknown>,
            'equipment'
        ),
        'a sheet with an identity does not offer it again'
    )
}

/*
 * A click on the way into an empty identity opens one zone of it, as on a sheet that holds one: a
 * panel of at most as many fields as the largest zone of the example, and nothing written. There is
 * no browser in the harness: the height (630 px at most) is held by the number of fields, which is
 * what the measure of the panel in a browser followed.
 */
{
    type Recorded = Record<string, unknown> & { kind: string }
    type Edit = {
        doc: Record<string, unknown>
        sheet: { open: boolean; target: string | null; keys?: string[] }
    }
    const globals = globalThis as unknown as {
        __lanternEdit?: Edit
        __lanternControls?: Recorded[]
        __lanternSlots?: { values: unknown[]; cursor: number }
    }
    const drawWith = (edit: Edit) => {
        const controls: Recorded[] = []
        globals.__lanternEdit = edit
        globals.__lanternControls = controls
        globals.__lanternSlots = { values: [], cursor: 0 }
        try {
            const markup = renderToStaticMarkup(createElement(PjEditorPanel))
            return { markup, controls }
        } finally {
            globals.__lanternEdit = undefined
            globals.__lanternControls = undefined
            globals.__lanternSlots = undefined
        }
    }
    const fieldsOf = (markup: string) =>
        (
            markup.match(
                /<(?:input|textarea)\b[^>]*data-control=|<select\b/g
            ) ?? []
        ).length
    const identityCount = (doc: Record<string, unknown>, keys: string[]) =>
        fieldsOf(
            drawWith({
                doc,
                sheet: { open: true, target: 'identity', keys },
            }).markup
        )
    const zones = sheetBlocks
        .filter(
            (block) =>
                block.paths.length > 0 &&
                block.paths.every((path) => path.indexOf('/identite') === 0)
        )
        .map((block) => block.id)
    assert.ok(zones.length >= 3, 'the sheet prints the identity in zones')
    const exampleDoc = example as unknown as Record<string, unknown>
    const largest = Math.max(
        ...zones.map((id) => identityCount(exampleDoc, [id]))
    )
    const whole = identityCount(exampleDoc, [])
    assert.ok(
        largest < whole,
        'a zone of the identity holds fewer fields than the whole section'
    )
    const blankDoc = blankPj() as unknown as Record<string, unknown>
    const closedEdit = (): Edit => ({
        doc: JSON.parse(JSON.stringify(blankDoc)),
        sheet: { open: false, target: null },
    })
    const waysIn = (drawn: ReturnType<typeof drawWith>) =>
        drawn.controls.filter(
            (control) =>
                control.kind === 'button' &&
                typeof control.onClick === 'function'
        )
    assert.equal(
        waysIn(drawWith(closedEdit())).length,
        zones.length,
        'a blank sheet offers one way into each zone of the identity'
    )
    zones.forEach((zone, at) => {
        /* The panel keeps the document it was drawn with: each way is clicked on its own draw. */
        const edit = closedEdit()
        const entry = waysIn(drawWith(edit))[at]
        ;(entry.onClick as (event: unknown) => void)({})
        assert.deepEqual(
            edit.doc,
            blankDoc,
            `opening the identity zone ${at} writes nothing`
        )
        assert.deepEqual(
            edit.sheet.keys,
            [zone],
            `way ${at} into the identity opens its own zone`
        )
        assert.ok(
            fieldsOf(drawWith(edit).markup) <= largest,
            `the zone ${zone} of a blank sheet holds no more fields than the largest of the example`
        )
    })
}

/*
 * A skill under a training that lacks its name or its percentage stays on the sheet, and the export
 * leaves it out with the training. Every field of that column, its name, its percentage and its
 * skills, points at the status that says so, from the first draw and without anything typed; a whole
 * training points at none. This holds the signal itself, not only the one that follows a typing.
 */
{
    type Recorded = Record<string, unknown> & { kind: string }
    type Edit = {
        doc: Record<string, unknown>
        sheet: { open: boolean; target: string | null; keys?: string[] }
    }
    const globals = globalThis as unknown as {
        __lanternEdit?: Edit
        __lanternControls?: Recorded[]
        __lanternSlots?: { values: unknown[]; cursor: number }
    }
    const drawn = (doc: Record<string, unknown>) => {
        const controls: Recorded[] = []
        globals.__lanternEdit = {
            doc,
            /* The column of the training, its first skill open: its skill fields are drawn. */
            sheet: {
                open: true,
                target: 'formations',
                keys: ['skill:professionnelle:0'],
            },
        }
        globals.__lanternControls = controls
        globals.__lanternSlots = { values: [], cursor: 0 }
        try {
            const markup = renderToStaticMarkup(createElement(PjEditorPanel))
            return { markup, controls }
        } finally {
            globals.__lanternEdit = undefined
            globals.__lanternControls = undefined
            globals.__lanternSlots = undefined
        }
    }
    const inputs = (controls: Recorded[]) =>
        controls.filter((control) => control.kind !== 'button')
    const whole = {
        type: 'professionnelle',
        nom: 'Terrain',
        pourcentage: 30,
        competences: [{ nom: 'Marcher', pourcentage: 20 }],
    }
    const withoutName = { ...whole, nom: undefined }
    const withoutPercentage = { ...whole, pourcentage: undefined }
    const column = (formation: Record<string, unknown>) => ({
        ...(JSON.parse(JSON.stringify(blankPj())) as Record<string, unknown>),
        formations: [JSON.parse(JSON.stringify(formation))],
    })
    ;[
        { name: 'a training without a name', formation: withoutName },
        {
            name: 'a training without a percentage',
            formation: withoutPercentage,
        },
    ].forEach(({ name, formation }) => {
        const run = drawn(column(formation))
        const fields = inputs(run.controls)
        assert.ok(
            fields.length >= 4,
            `${name} draws its name, its percentage and its skill`
        )
        const unlinked = fields.filter(
            (control) => !linkedStatus(control, run.markup)
        )
        assert.equal(
            unlinked.length,
            0,
            `${name}: ${unlinked.length} of ${fields.length} fields point at no status that says the export leaves them out`
        )
    })
    {
        const run = drawn(column(whole))
        const fields = inputs(run.controls)
        assert.ok(fields.length >= 3, 'a whole training draws its fields')
        assert.ok(
            fields.every((control) => !linkedStatus(control, run.markup)),
'a whole training points at no status'
        )
    }
}

/*
 * A state that owns a text cannot leave it empty (the contract takes no empty string). Emptying the
 * field keeps the stored text in the document, and the field says so itself: it is flagged invalid
 * and names the alert that explains it. A field the write was not refused for carries neither.
 */
{
    type Control = { kind: string; onChange?: (event: unknown) => void }
    type Edit = {
        doc: Record<string, unknown>
        sheet: {
            open: boolean
            target: string | null
            profile?: string
            keys?: string[]
        }
    }
    const globals = globalThis as unknown as {
        __lanternEdit?: Edit
        __lanternControls?: Control[]
        __lanternSlots?: { values: unknown[]; cursor: number }
    }
    const label = ui('adrenaline:monstre.form.detectionRange')
    const stored = '10 m'
    const edit: Edit = {
        doc: {
            ...(JSON.parse(JSON.stringify(blankMonstre())) as Record<
                string,
                unknown
            >),
            etats: [
                { id: 'sombre', nom: 'Sombre', delta: { zoneDeDetection: stored } },
            ],
        },
        sheet: {
            open: true,
            target: 'statistics',
            profile: 'sombre',
            keys: ['zoneDeDetection'],
        },
    }
    const slots = { values: [] as unknown[], cursor: 0 }
    const draw = () => {
        const controls: Control[] = []
        globals.__lanternEdit = edit
        globals.__lanternControls = controls
        slots.cursor = 0
        globals.__lanternSlots = slots
        try {
            return {
                markup: renderToStaticMarkup(createElement(MonstreEditorPanel)),
                controls,
            }
        } finally {
            globals.__lanternEdit = undefined
            globals.__lanternControls = undefined
            globals.__lanternSlots = undefined
        }
    }
    const fieldOf = (drawn: ReturnType<typeof draw>) => {
        const found = new RegExp(
            `>${escapeRegExp(label)}</(?:span|label)>(?:<[^>]*>)*?<input([^>]*)data-control="([0-9]+)"([^>]*)>`
        ).exec(drawn.markup)
        assert.ok(found, 'the detection field is drawn')
        return {
            attributes: `${found[1]}${found[3]}`,
            control: drawn.controls[Number(found[2])],
        }
    }
    const before = fieldOf(draw())
    assert.ok(
        before.attributes.indexOf('aria-invalid') < 0,
        'a detection range that holds its text is not flagged'
    )
    before.control.onChange?.({ target: { value: '' }, currentTarget: { value: '' } })
    const after = draw()
    const emptied = fieldOf(after)
    const kept = (edit.doc.etats as { delta: Record<string, unknown> }[])[0]
    assert.equal(
        kept.delta.zoneDeDetection,
        stored,
        'emptying the detection range of a state keeps the stored text in the document'
    )
    assert.ok(
        /aria-invalid="true"/.test(emptied.attributes),
        'the emptied detection range is flagged invalid'
    )
    const described = /aria-describedby="([^"]+)"/.exec(emptied.attributes)
    assert.ok(described, 'the emptied detection range names its explanation')
    const alert = new RegExp(
        `<p id="${escapeRegExp(described[1])}"[^>]*role="alert"`
    )
    assert.ok(
        alert.test(after.markup),
        'the explanation the field names is the alert that says the state keeps its text'
    )
}

const fields = lines(failures)
/* Every defect, for a run that has to be read whole (the message below keeps the first sixty). */
if (process.env.LANTERN_GUARD_DUMP)
    writeFileSync(
        process.env.LANTERN_GUARD_DUMP,
        fields.join(String.fromCharCode(10))
    )
assert.deepEqual(
    fields,
    [],
    `${fields.length} defects of the editors:\n${fields.slice(0, 60).join('\n')}`
)

console.log(
    `assert:adrenaline-pj: round trips lossless; ${editable.length} of ${leaves.length} schema leaves have a field (${notEditable.size} declared not editable); the nature selector offers and shows ${natures.length} natures; typing through the panels writes the key each field names; ${Object.keys(
        proved
    )
        .map((name) => `${proved[name]} ${name} fields used`)
        .join(
            ', '
        )}, each written to a declared path and exported without error`
)
