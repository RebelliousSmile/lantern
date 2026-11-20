/* global process, console */
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { templateRegistry } from '../src/core/templates/registry'
import { crc32, createZip } from '../src/core/templates/shell/archiveExport'
import {
    numberedPageSlug,
    pageSlug,
    selectPages,
} from '../src/core/templates/shell/exportPages'
import { createPdfExportAction } from '../src/core/templates/shell/pdfExportAction'
import { templateLoaders } from '../src/core/templates/templateLoader'
import type { TemplateExportPage } from '../src/core/templates/types'
import {
    acceptsNotes,
    fitsRenderedPage,
    fittingPrefix,
} from '../src/templates/shared/notes/notesFit'

/** The names a sheet gives the field its notes are written into. */
const NOTES_KEYS = ['notesDePartie', 'session_notes', 'sessionNotes']

const failures: string[] = []
const needsDom: string[] = []
const check = (id: string, what: string, test: () => void) => {
    try {
        test()
    } catch (error) {
        failures.push(
            `${id}: ${what}: ${String((error as Error).message).split('\n')[0]}`
        )
    }
}

/*
 * The sheets that print a notes page: the Adrenaline player character, the Otherscape character
 * and the PbtA booklets. City of Mist and Legend in the Mist keep their own sheets without one.
 * Which sheet is in the scope is a decision of the product; what the pages of a sheet are, and
 * which one holds the notes, is read from the pages it declares, which the packs publish.
 */
const WITH_NOTES = new Set([
    'adrenaline.pj',
    'otherscape.character',
    'pbta.playbook',
    'masks.playbook',
    'the-sprawl.playbook',
    'urban-shadows.playbook',
    'monsterhearts.playbook',
])
const WITHOUT_NOTES = /^(city|legend)\./

/** What is wrong with the notes page of a sheet, by name; nothing when the scope is held. */
function notesScopeFindings(
    id: string,
    pages: TemplateExportPage[] | undefined
): string[] {
    const notes = (pages ?? []).filter((page) => page.notes)
    const last = pages?.[pages.length - 1]
    if (WITHOUT_NOTES.test(id))
        return notes.length ? [`${id}: prints a notes page, which its game does not`] : []
    if (!WITH_NOTES.has(id))
        return notes.length ? [`${id}: prints a notes page and is not in the scope of the notes`] : []
    if (!pages?.length || notes.length === 0)
        return [`${id}: declares no notes page`]
    if (notes.length > 1) return [`${id}: declares ${notes.length} notes pages`]
    return last?.notes ? [] : [`${id}: its notes page is not the last page`]
}

/* 1. Templates that declare pages draw one node per page. */
let declaring = 0
const declared = new Map<string, TemplateExportPage[] | undefined>()
for (const entry of templateRegistry) {
    const definition = (await templateLoaders[entry.id]!()).default
    const declare = definition.export.pages
    declared.set(entry.id, declare?.(definition.createExample()))
    if (!declare) continue
    declaring += 1
    const example = definition.createExample()
    const pages = declare(example)
    check(entry.id, 'pages declared', () => {
        assert.ok(pages.length > 0, 'no page')
        assert.equal(
            new Set(pages.map((p) => p.id)).size,
            pages.length,
            'duplicate id'
        )
        for (const page of pages) {
            assert.ok(/^[a-z0-9-]+$/.test(page.id), `id ${page.id}`)
            assert.ok(page.label, `label of ${page.id}`)
        }
        assert.ok(
            pages.filter((p) => p.notes).length <= 1,
            'more than one notes page'
        )
        const last = pages[pages.length - 1]
        assert.ok(
            !pages.some((p) => p.notes) || last.notes,
            'notes page is not last'
        )
    })
    try {
        const html = renderToStaticMarkup(definition.preview.render())
        const drawn: string[] = []
        const re = /data-export-page="([^"]+)"/g
        for (let m = re.exec(html); m; m = re.exec(html)) drawn.push(m[1])
        /* The preview shows what the export prints: the same pages, in the same order. */
        check(entry.id, 'every declared page is drawn, in the declared order', () => {
            assert.deepEqual(
                drawn.filter((id) => pages.some((p) => p.id === id)),
                pages.map((p) => p.id)
            )
        })
    } catch (error) {
        if (/purify/.test(String((error as Error).message)))
            needsDom.push(entry.id)
        else
            failures.push(
                `${entry.id}: preview drawn: ${(error as Error).message}`
            )
    }
}
check('registry', 'at least one template declares pages', () =>
    assert.ok(declaring > 0, 'no template declares pages')
)

/* The notes scope: every sheet that should print notes does, last, and no other does. */
for (const [id, pages] of declared)
    for (const finding of notesScopeFindings(id, pages))
        failures.push(`notes scope: ${finding}`)
check('notes scope', 'every sheet of the scope is a registered template', () => {
    const missing = [...WITH_NOTES].filter((id) => !declared.has(id))
    assert.deepEqual(missing, [], `not registered: ${missing.join(', ')}`)
})
/* The rule itself: it names a sheet that lost its notes page, one that has it first, one that gained it. */
check('notes scope', 'the rule names the sheet that breaks it', () => {
    const page = (id: string, notes = false): TemplateExportPage => ({
        id,
        label: { text: id },
        notes,
    })
    const held = [page('recto'), page('notes', true)]
    assert.deepEqual(notesScopeFindings('masks.playbook', held), [])
    assert.match(
        notesScopeFindings('masks.playbook', [page('recto')])[0],
        /^masks\.playbook: declares no notes page/
    )
    assert.match(
        notesScopeFindings('masks.playbook', [page('notes', true), page('recto')])[0],
        /^masks\.playbook: its notes page is not the last page/
    )
    assert.match(
        notesScopeFindings('adrenaline.pj', undefined)[0],
        /^adrenaline\.pj: declares no notes page/
    )
    assert.match(
        notesScopeFindings('city.danger', held)[0],
        /^city\.danger: prints a notes page/
    )
    assert.match(
        notesScopeFindings('legend.journey', held)[0],
        /^legend\.journey: prints a notes page/
    )
    assert.deepEqual(notesScopeFindings('legend.journey', undefined), [])
})

/* 2. The page choice. */
const sheet: TemplateExportPage[] = [
    { id: 'recto', label: { text: 'Recto' } },
    { id: 'verso', label: { text: 'Verso' } },
    { id: 'notes', label: { text: 'Notes' }, notes: true },
]
const ids = (pages: TemplateExportPage[]) => pages.map((p) => p.id)
check('selectPages', 'all with notes: archive of every page', () => {
    const s = selectPages(sheet, { scope: 'all', includeNotes: true })
    assert.deepEqual(ids(s.pages), ['recto', 'verso', 'notes'])
    assert.equal(s.archive, true)
})
check('selectPages', 'notes unticked leave the export', () => {
    const s = selectPages(sheet, { scope: 'all', includeNotes: false })
    assert.deepEqual(ids(s.pages), ['recto', 'verso'])
})
check('selectPages', 'one page: no archive', () => {
    const s = selectPages(sheet, {
        scope: 'one',
        pageId: 'verso',
        includeNotes: true,
    })
    assert.deepEqual(ids(s.pages), ['verso'])
    assert.equal(s.archive, false)
})
check('selectPages', 'a lone page is not archived', () => {
    const s = selectPages(sheet.slice(0, 1), {
        scope: 'all',
        includeNotes: true,
    })
    assert.equal(s.archive, false)
})
check('selectPages', 'a dropped page falls back to the first', () => {
    const s = selectPages(sheet, {
        scope: 'one',
        pageId: 'notes',
        includeNotes: false,
    })
    assert.deepEqual(ids(s.pages), ['recto'])
})
check('selectPages', 'file names are ASCII and sorted', () => {
    assert.equal(pageSlug({ id: 'Equipe 1', label: { text: '' } }), 'equipe-1')
    assert.equal(numberedPageSlug(sheet[1], 1), '02-verso')
})

/* 3. The archive reads back. */
check('archive', 'crc32 of a known text', () =>
    assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926)
)
check('archive', 'zip round trip', () => {
    const entries = [
        { name: '01-recto.png', data: new Uint8Array([1, 2, 3, 4, 5]) },
        {
            name: '02-verso.png',
            data: new Uint8Array(1000).map((_, i) => i % 251),
        },
    ]
    const zip = createZip(entries)
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
    const eocd = zip.length - 22
    assert.equal(view.getUint32(eocd, true), 0x06054b50, 'end record')
    assert.equal(view.getUint16(eocd + 10, true), entries.length)
    let at = view.getUint32(eocd + 16, true)
    const decoder = new TextDecoder()
    for (const entry of entries) {
        assert.equal(view.getUint32(at, true), 0x02014b50, 'central header')
        assert.equal(view.getUint32(at + 16, true), crc32(entry.data), 'crc')
        const size = view.getUint32(at + 24, true)
        assert.equal(size, entry.data.length)
        const nameLength = view.getUint16(at + 28, true)
        const extra = view.getUint16(at + 30, true)
        const comment = view.getUint16(at + 32, true)
        const local = view.getUint32(at + 42, true)
        assert.equal(
            decoder.decode(zip.subarray(at + 46, at + 46 + nameLength)),
            entry.name
        )
        assert.equal(view.getUint32(local, true), 0x04034b50, 'local header')
        const start =
            local +
            30 +
            view.getUint16(local + 26, true) +
            view.getUint16(local + 28, true)
        assert.deepEqual(
            Array.from(zip.subarray(start, start + size)),
            Array.from(entry.data)
        )
        at += 46 + nameLength + extra + comment
    }
})

/* 5. The notes page: capacity, page height, and the sheet without its notes. */
check('notes', 'a text is accepted within capacity and page', () => {
    assert.equal(
        acceptsNotes('abc', 5, () => true),
        true
    )
    assert.equal(
        acceptsNotes('abcdef', 5, () => true),
        false
    )
    assert.equal(
        acceptsNotes('abc', 5, () => false),
        false
    )
})
check('notes', 'a paste is cut where the page ends', () => {
    const twelve = (text: string) => text.length <= 12
    assert.equal(fittingPrefix('x'.repeat(40), 100, twelve), 'x'.repeat(12))
    assert.equal(fittingPrefix('x'.repeat(40), 7, twelve), 'x'.repeat(7))
    assert.equal(fittingPrefix('short', 100, twelve), 'short')
    assert.equal(
        fittingPrefix('anything', 100, () => false),
        ''
    )
})
check('notes', 'no page mounted: everything fits', () =>
    assert.equal(fitsRenderedPage({} as ParentNode)('any text'), true)
)
for (const entry of templateRegistry) {
    const definition = (await templateLoaders[entry.id]!()).default
    const without = definition.export.withoutNotes
    if (!without) continue
    check(entry.id, 'withoutNotes drops the notes and keeps the rest', () => {
        const example = definition.createExample() as Record<string, unknown>
        /* Each game names its notes field its own way; the sheet drops its own and nothing else. */
        const filled: Record<string, unknown> = { ...example }
        for (const key of NOTES_KEYS) filled[key] = 'x'
        const stripped = without(filled) as Record<string, unknown>
        const dropped = Object.keys(filled).filter((key) => !(key in stripped))
        assert.equal(dropped.length, 1, `dropped ${dropped.join(', ')}`)
        assert.ok(NOTES_KEYS.includes(dropped[0]), `dropped ${dropped[0]}`)
    })
}

/* 4. The PDF action the panel installs. */
check('pdf', 'action identity', () => {
    const action = createPdfExportAction()
    assert.equal(action.id, 'pdf')
    assert.equal(action.label, 'export.pdf')
    assert.equal(action.buttonLabel, 'export.exportPdf')
})

if (failures.length) {
    for (const line of failures) console.error(`FAIL ${line}`)
    console.error(`${failures.length} failure(s)`)
    process.exit(1)
}
console.log(
    `${declaring} template(s) declaring pages: page, choice, archive and PDF proofs ok`
)
if (needsDom.length)
    console.log(
        `page nodes checked in the browser pass only: ${needsDom.join(', ')}`
    )
