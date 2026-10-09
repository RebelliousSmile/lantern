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
 *
 * A pack may also publish one contract per block besides its playbook
 * (`<kind>-presentation-contract.json`: NPC, monster, mission...). Each must
 * have a template folder `src/templates/<id>/<kind>` and be wired into the
 * shared block configuration, whose regions are the contract itself.
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

const blockConfigs = readFileSync(
    join(root, 'src', 'templates', 'pbta', 'blocks', 'blockConfigs.ts'),
    'utf8'
)
const problems = []
const notes = []
const covered = []
for (const id of readdirSync(packsDir).sort()) {
    for (const name of readdirSync(join(packsDir, id)).sort()) {
        const block = /^(.+)-presentation-contract.json$/.exec(name)
        if (!block) continue
        const kind = block[1]
        const dir = join(root, 'src', 'templates', id, kind)
        if (!existsSync(dir))
            problems.push(
                `${id}: block "${kind}" is published, with no Lantern template`
            )
        else if (
            !blockConfigs.includes(`schema-pbta/packs/${id}/${name}`) ||
            !sourcesOf(dir).includes(`${id}.${kind}`)
        )
            problems.push(
                `${id}: block "${kind}" has a template folder, not wired to its published contract`
            )
        else covered.push(`${id}/${kind}`)
    }
    const file = join(packsDir, id, 'presentation-contract.json')
    if (!existsSync(file)) continue
    const template = join(root, 'src', 'templates', id, 'playbook')
    if (!existsSync(template)) {
        notes.push(`${id}: published presentation, no Lantern template`)
        continue
    }
    const contract = JSON.parse(readFileSync(file, 'utf8'))
    covered.push(`${id}/playbook`)
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
console.log(`covered: ${covered.join(', ')}`)
for (const note of notes) console.log(`note: ${note}`)
if (problems.length) {
    for (const problem of problems) console.error(`✗ ${problem}`)
    console.error(
        `presentation coverage: ${problems.length} published element(s) not covered`
    )
    process.exit(1)
}
console.log(
    'presentation coverage: every published playbook region is drawn and editable, every published block has its template'
)
