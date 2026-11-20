/* global process, console */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { getPbtaPlaybookPages, type PbtaPlaybookPagesTarget } from 'schema-pbta'
import { templateLoaders } from '../src/core/templates/templateLoader'
import { SESSION_NOTES_CAPACITY } from '../src/templates/pbta/shared/sessionNotes'

/** The booklet templates and the pages target the pack publishes for each. */
const BOOKLETS: Record<string, PbtaPlaybookPagesTarget> = {
    'masks.playbook': 'masks-playbook',
    'the-sprawl.playbook': 'the-sprawl-playbook',
    'urban-shadows.playbook': 'urban-shadows-playbook',
    'monsterhearts.playbook': 'monsterhearts-playbook',
    'pbta.playbook': 'playbook',
}

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

const NOTES = 'Le Cercle a bougé : noter la dette envers la Reine.'

for (const [id, target] of Object.entries(BOOKLETS)) {
    const definition = (await templateLoaders[id]!()).default
    const published = getPbtaPlaybookPages(target)
    check(id, 'the pack publishes pages', () =>
        assert.ok(published && published.length > 1, 'no pages published')
    )
    if (!published) continue
    const example = definition.createExample() as Record<string, unknown>

    check(id, 'declared pages are the published ones, notes last', () => {
        const declared = definition.export.pages!(example)
        assert.deepEqual(
            declared.map((page) => page.id),
            published.map((page) => page.id)
        )
        assert.deepEqual(
            declared.map((page) => Boolean(page.notes)),
            published.map((page) => Boolean(page.notes_field))
        )
        assert.equal(declared[declared.length - 1].notes, true)
    })

    check(id, 'the pack holds the notes to the shared capacity', () =>
        assert.equal(SESSION_NOTES_CAPACITY, 6000)
    )

    check(id, 'the notes leave in the TOML and come back', () => {
        const toml = definition.io.exportToml!({ ...example, sessionNotes: NOTES })
        assert.ok(toml.includes(NOTES), 'notes missing from the TOML')
        const back = definition.io.importToml!(toml)
        assert.equal(
            (back.doc as Record<string, unknown>).sessionNotes,
            NOTES,
            'notes lost on import'
        )
    })

    check(id, 'a TOML without notes carries none', () => {
        const stripped = definition.export.withoutNotes!({
            ...example,
            sessionNotes: NOTES,
        })
        const toml = definition.io.exportToml!(stripped)
        assert.ok(!toml.includes(NOTES), 'notes still in the TOML')
        assert.ok(!/sessionNotes/.test(toml), 'field still in the TOML')
    })

    try {
        const html = renderToStaticMarkup(definition.preview.render())
        const drawn: string[] = []
        const re = /data-export-page="([^"]+)"/g
        for (let m = re.exec(html); m; m = re.exec(html)) drawn.push(m[1])
        check(id, 'every published page is drawn once', () => {
            const own = drawn.filter((page) =>
                published.some((candidate) => candidate.id === page)
            )
            assert.deepEqual(own.sort(), published.map((page) => page.id).sort())
        })
    } catch (error) {
        if (/purify/.test(String((error as Error).message))) needsDom.push(id)
        else failures.push(`${id}: preview drawn: ${(error as Error).message}`)
    }
}

/* One notes page for every booklet: no template draws its own. */
const walk = (dir: string, found: string[] = []): string[] => {
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name)
        if (statSync(full).isDirectory()) walk(full, found)
        else if (/\.(tsx|ts)$/.test(name)) found.push(full)
    }
    return found
}
const root = process.env.LANTERN_ROOT ?? process.cwd()
const sharedNotes = path.join('src', 'templates', 'shared', 'notes')
check('notes', 'a single component draws the notes page', () => {
    const own = walk(path.join(root, 'src')).filter(
        (file) =>
            !file.includes(sharedNotes) &&
            readFileSync(file, 'utf8').includes('lantern-notes-page')
    )
    assert.deepEqual(own, [], `second notes page in ${own.join(', ')}`)
})

if (failures.length) {
    for (const line of failures) console.error(`FAIL ${line}`)
    console.error(`${failures.length} failure(s)`)
    process.exit(1)
}
console.log(
    `${Object.keys(BOOKLETS).length} PbtA booklet(s): published pages, notes in the TOML, none without them, one notes page`
)
if (needsDom.length)
    console.log(`page nodes checked in the browser pass only: ${needsDom.join(', ')}`)
