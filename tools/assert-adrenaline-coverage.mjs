/* global console, process */
/**
 * What schema-adrenaline publishes for a sheet must be drawn by Lantern.
 *
 * The presentation of each sheet names the form of every block. A form the
 * renderer of that sheet has no case for falls back to plain lines: the sheet
 * still shows, without what the schema asked for. Every published form must
 * therefore be named by the renderer of its sheet, and every card token the
 * pack publishes (`--adrenaline-card-*`) must be read by the card styles.
 */
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
/* The installed package by default; a path argument measures another build of the provider. */
const provider = process.argv[2]
    ? resolve(process.argv[2])
    : join(root, 'node_modules', 'schema-adrenaline')
const preview = join(
    root,
    'src',
    'templates',
    'adrenaline',
    'shared',
    'preview'
)
const read = (name) => readFileSync(join(preview, name), 'utf8')

const published = await import(
    pathToFileURL(join(provider, 'dist', 'presentation.js')).href
)
const sheets = [
    ['pj', published.PJ_PRESENTATION, 'PresentationBlocks.tsx'],
    ['pnj', published.PNJ_PRESENTATION, 'CompactCard.tsx'],
    ['monstre', published.MONSTRE_PRESENTATION, 'CompactCard.tsx'],
]

const problems = []
let forms = 0
for (const [sheet, presentation, renderer] of sheets) {
    if (!presentation) {
        problems.push(`${sheet}: no presentation is published`)
        continue
    }
    const source = read(renderer)
    const seen = new Set()
    for (const section of presentation.sections)
        for (const block of section.blocks) {
            if (!block.form || seen.has(block.form)) continue
            seen.add(block.form)
            forms += 1
            if (!source.includes(`'${block.form}'`))
                problems.push(
                    `${sheet}: form "${block.form}" (block "${block.id}") is not drawn by ${renderer}`
                )
        }
}

const pack = JSON.parse(
    readFileSync(join(provider, 'handbook', 'adrenaline', 'pack.json'), 'utf8')
).pack
const cardStyles = read('compactCard.css') + read('presentationSheet.css')
const tokens = new Set()
for (const layer of Object.values(pack.style ?? {}))
    for (const group of Object.values(layer ?? {}))
        for (const token of Object.keys(group ?? {}))
            if (token.startsWith('--adrenaline-card-')) tokens.add(token)
for (const token of tokens)
    if (!cardStyles.includes(`var(${token}`))
        problems.push(`pack: token ${token} is not read by the card styles`)

if (problems.length > 0) {
    for (const p of problems) console.error(`assert:adrenaline-coverage: ${p}`)
    process.exit(1)
}
console.log(
    `assert:adrenaline-coverage: ${forms} published forms drawn across ${sheets.length} sheets, ${tokens.size} card tokens read`
)
