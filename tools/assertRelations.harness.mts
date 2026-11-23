/* global console */
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
    ATTITUDE_LEVELS,
    RELATIONS_PRESENTATION,
    placesPerRow,
} from 'schema-adrenaline/presentation'
import relationsSchema from 'schema-adrenaline/schemas/relations.schema.json'
import type { AdrenalineRelations } from '../src/contracts/adrenaline'
import '../src/i18n'
import { nextNumber } from '../src/templates/adrenaline/relations/editor/numbers'
import { RelationsEditorPanel } from '../src/templates/adrenaline/relations/editor/RelationsEditorPanel'
import { RelationsPreview } from '../src/templates/adrenaline/relations/preview/RelationsPreview'
import {
    blankRelations,
    sampleRelations,
} from '../src/templates/adrenaline/relations/sample'
import {
    exportToTOML,
    importFromTOML,
} from '../src/templates/adrenaline/relations/toml'
import { relationsSections } from '../src/templates/adrenaline/shared/sections'

/* The fields tell one another a value was validated through the document: the server has none, an event target stands in. */
const host = globalThis as unknown as { document?: EventTarget }
host.document ??= new EventTarget()

type Edit = { doc: unknown; sheet: unknown }
const edited = globalThis as unknown as { __lanternEdit?: Edit }
const drawn = (
    component: () => ReturnType<typeof createElement>,
    doc: unknown,
    sheet: unknown
) => {
    edited.__lanternEdit = { doc, sheet }
    try {
        return renderToStaticMarkup(createElement(component))
    } finally {
        edited.__lanternEdit = undefined
    }
}
const panel = (doc: unknown, target: string, keys?: string[]) =>
    drawn(RelationsEditorPanel, doc, {
        open: true,
        target,
        ...(keys ? { keys } : {}),
    })
const preview = (doc: unknown) =>
    drawn(RelationsPreview, doc, { open: false, target: null })
const count = (markup: string, needle: string) =>
    markup.split(needle).length - 1

const read = (source: string) => importFromTOML(source).relations
const roundTrip = (document: AdrenalineRelations) =>
    read(exportToTOML(document))

/* The published worked example comes back from the export unchanged. */
const example = sampleRelations()
assert.deepEqual(roundTrip(example), example, 'the published example')

/* A sheet typed with every field of the schema: written as TOML, read back the same. */
const typed = {
    personnage: 'Ines Marchal',
    joueur: 'Camille',
    partie: 'Les Brumes du Nord',
    nombreDAutresPersonnages: 5,
    autresPersonnages: [
        {
            nom: 'Paul',
            genre: 'masculin',
            ceQueJeSais: 'Il ment sur son passé',
            ceQueJeLuiDois: 'Une nuit au chaud',
            ceQuOnMeDoit: 'Une explication',
        },
    ],
    pnjs: [
        {
            numero: 1,
            nom: 'Le maire',
            attitude: 'hostile',
            lien: { type: 'travail', description: 'Ancien patron' },
            reliesA: [2],
            resume: 'A perdu sa fille',
            notes: 'Ne boit plus',
            toucheParLeDrame: true,
        },
        { numero: 2, nom: 'La pharmacienne', attitude: 'loyale' },
    ],
} as unknown as AdrenalineRelations
assert.deepEqual(roundTrip(typed), typed, 'a sheet typed with every field')

/* The schema bounds the lists the sheet prints places for. */
const properties = (
    relationsSchema as unknown as {
        properties: Record<string, { maxItems?: number }>
    }
).properties
const tieSlots = properties.autresPersonnages.maxItems
const tieDefault = (
    relationsSchema as unknown as {
        properties: Record<string, { default?: number }>
    }
).properties.nombreDAutresPersonnages.default
const npcSlots = properties.pnjs.maxItems
assert.ok(
    typeof tieSlots === 'number' &&
        typeof npcSlots === 'number' &&
        typeof tieDefault === 'number' &&
        tieDefault <= 4 &&
        tieDefault <= tieSlots,
    'the schema publishes both list bounds and the default places, on one row of four'
)

/* The preview prints every place the schema allows, filled or not, never fewer than the entries held. */
for (const [label, doc] of [
    ['blank', blankRelations()],
    ['example', example],
    ['typed', typed],
] as const) {
    const markup = preview(doc)
    assert.equal(
        count(markup, 'data-zone="tie:'),
        Math.max(
            doc.autresPersonnages?.length ?? 0,
            doc.nombreDAutresPersonnages ?? tieDefault ?? 0
        ),
        `${label}: one printed place per count, never fewer than the characters held`
    )
    assert.equal(
        count(markup, 'data-zone="npc:'),
        npcSlots,
        `${label}: one printed place per NPC`
    )
}

/* The places share the width: one row of as many as printed up to the section columns, even rows beyond. */
{
    const maxPerRow = RELATIONS_PRESENTATION.sections[1].columns ?? 1
    for (let places = 1; places <= (tieSlots ?? 0); places += 1) {
        const markup = preview({ ...blankRelations(), nombreDAutresPersonnages: places })
        assert.ok(
            markup.indexOf(`--ties-per-row:${placesPerRow(places, maxPerRow)}`) >= 0,
            `${places} places: the row width the contract computes`
        )
    }
    assert.deepEqual(
        [1, 2, 3, 4, 5, 6].map((places) => placesPerRow(places, 4)),
        [1, 2, 3, 4, 3, 3],
        'up to four places fill one row, five and six make two rows of three'
    )
}

/* The page is one node of its own, named by the published sheet. */
assert.equal(
    count(preview(example), `data-export-page="${RELATIONS_PRESENTATION.sheet.id}"`),
    1,
    'one exportable page'
)

/* The attitude is worded by the published level; the modifier it sets is not printed, nor one typed in the document. */
{
    const level = ATTITUDE_LEVELS.find((candidate) => candidate.key === 'hostile')
    assert.ok(level, 'the contract publishes the hostile level')
    const doc = {
        ...typed,
        pnjs: [{ numero: 1, nom: 'X', attitude: 'hostile', modificateur: 'bonus 9' }],
    }
    const markup = preview(doc)
    assert.ok(markup.indexOf(level.label) >= 0, 'the attitude is printed')
    assert.equal(
        markup.indexOf('adr-pj__npc-modifier'),
        -1,
        'a hostile attitude prints no modifier'
    )
    assert.ok(
        markup.indexOf('adr-pj__npc-row') >= 0,
        'the attitude and its links share one line'
    )
    assert.equal(
        markup.indexOf('bonus 9'),
        -1,
        'a modifier typed in the document is not printed'
    )
}

/* The label of what another character owes follows their gender, which is not printed; the drama test is ticked on the NPC. */
{
    const labels = (genre?: string) =>
        preview({
            ...typed,
            autresPersonnages: [{ nom: 'Paul', ...(genre ? { genre } : {}) }],
        })
    assert.ok(labels('masculin').indexOf('Ce qu&#x27;il me doit') >= 0 || labels('masculin').indexOf('Ce qu’il me doit') >= 0 || labels('masculin').indexOf("Ce qu'il me doit") >= 0, 'masculine wording')
    assert.ok(labels('feminin').indexOf('elle me doit') >= 0, 'feminine wording')
    assert.ok(labels('neutre').indexOf('iel me doit') >= 0, 'neutral wording')
    assert.ok(labels().indexOf('iel me doit') >= 0, 'no gender: the default wording')
    assert.equal(labels('masculin').indexOf('>masculin<'), -1, 'the gender is not printed')
    assert.equal(count(preview(typed), 'adr-pj__tick--on'), 1, 'the drama test is ticked on the one NPC that carries it')
}

/* A cell the header's pointers give no value for is not printed. */
{
    const markup = preview({ personnage: 'Seul' })
    assert.equal(count(markup, 'adr-pj__card-value'), 1, 'only the filled card')
}

/* The panels: one per section, empty when nothing is opened. */
{
    const empty = drawn(RelationsEditorPanel, example, { open: false, target: null })
    assert.ok(
        empty.indexOf('Seul') === -1 && empty.indexOf('data-control') === -1,
        'a closed sheet edits nothing'
    )
    for (const section of relationsSections) {
        const key = typeof section === 'string' ? section : section.id
        if (key === 'meta') continue
        assert.ok(panel(example, key).length > 0, `${key}: the panel draws`)
    }
    const header = panel(example, 'entete')
    assert.ok(
        header.indexOf(String(example.personnage)) >= 0,
        'the header panel carries the character'
    )
    /* The length a field takes is the schema's. */
    assert.ok(
        header.indexOf('maxLength="60"') >= 0,
        'the header fields stop at the published length'
    )
}

/* A click on one NPC opens that NPC alone. */
{
    const all = panel(typed, 'pnjs')
    const one = panel(typed, 'pnjs', ['pnjs', 'npc:1'])
    assert.ok(all.indexOf('Le maire') >= 0 && all.indexOf('pharmacienne') >= 0)
    assert.ok(
        one.indexOf('value="La pharmacienne"') >= 0,
        'the clicked NPC is open in the panel'
    )
    assert.equal(
        one.indexOf('Ancien patron'),
        -1,
        'the other NPC is not opened by that click'
    )
}

/* A new NPC takes the smallest free number; a number held is never moved. */
{
    assert.equal(nextNumber([]), 1, 'the first NPC is number 1')
    assert.equal(nextNumber([{ numero: 1 }, { numero: 2 }]), 3)
    assert.equal(
        nextNumber([{ numero: 1 }, { numero: 3 }]),
        2,
        'a gap is filled before the list grows'
    )
    assert.equal(
        nextNumber(Array.from({ length: 99 }, (_, index) => ({ numero: index + 1 }))),
        undefined,
        'no number is offered once all are taken'
    )
}

console.log(
    `assert:relations: example and typed sheet round trip; ${tieSlots} ties and ${npcSlots} NPCs printed; attitude worded by the published level, no modifier printed; panels and click zones drawn`
)
