/* global console, process */
/**
 * Every region the schema publishes for a pack must be drawn by the pack's
 * Lantern template (preview) and be editable in it (editor).
 *
 * The contract is `packs/<id>/presentation-contract.json` of schema-pbta:
 * regions with the model fields they hold. A region id must appear in the
 * preview sources (the renderer is keyed by it, `data-region="<id>"`), and
 * every field of every region must be named in the editor sources. A pack with
 * a contract and no template is a finding, not a failure; a template that
 * leaves a published region undrawn or uneditable fails.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packsDir = join(root, 'node_modules', 'schema-pbta', 'packs')

function sourcesOf(dir) {
    if (!existsSync(dir)) return ''
    return readdirSync(dir)
        .map((name) => {
            const path = join(dir, name)
            if (statSync(path).isDirectory()) return sourcesOf(path)
            return /\.(tsx?|css)$/.test(name) ? readFileSync(path, 'utf8') : ''
        })
        .join('\n')
}

const word = (text, name) =>
    new RegExp(`(^|[^A-Za-z0-9_])${name}([^A-Za-z0-9_]|$)`).test(text)

const problems = []
const notes = []
for (const id of readdirSync(packsDir).sort()) {
    const file = join(packsDir, id, 'presentation-contract.json')
    if (!existsSync(file)) continue
    const template = join(root, 'src', 'templates', id, 'playbook')
    if (!existsSync(template)) {
        notes.push(`${id}: published presentation, no Lantern template`)
        continue
    }
    const contract = JSON.parse(readFileSync(file, 'utf8'))
    const preview = sourcesOf(join(template, 'preview'))
    const editor = sourcesOf(join(template, 'editor'))
    for (const region of contract.regions) {
        if (!preview.includes(region.id))
            problems.push(
                `${id}: region "${region.id}" is not drawn by the preview`
            )
        for (const field of region.fields) {
            const leaf = field.split('.').pop()
            if (!word(editor, leaf))
                problems.push(
                    `${id}: field "${field}" (region "${region.id}") is not editable in the editor`
                )
        }
    }
    const placed = new Set((contract.rows ?? []).flat(2))
    if (
        (contract.rows ?? []).length &&
        !preview.includes('rows') &&
        !preview.includes('Rows')
    ) {
        problems.push(
            `${id}: the preview does not lay the ${contract.rows.length} published rows out in columns`
        )
    }
    for (const region of contract.regions) {
        if (!placed.has(region.id) && contract.rows?.length)
            notes.push(
                `${id}: region "${region.id}" is in no row (fallback "unplaced")`
            )
    }
}
for (const note of notes) console.log(`note: ${note}`)
if (problems.length) {
    for (const problem of problems) console.error(`✗ ${problem}`)
    console.error(
        `presentation coverage: ${problems.length} published element(s) not covered`
    )
    process.exit(1)
}
console.log(
    'presentation coverage: every published region is drawn and editable'
)
