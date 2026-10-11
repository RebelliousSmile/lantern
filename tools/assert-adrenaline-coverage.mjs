/* global console, process */
/**
 * What schema-adrenaline publishes for a sheet must be drawn by Lantern.
 *
 * The presentation of each sheet names the form of every block. A form the
 * renderer of that sheet has no case for falls back to plain lines: the sheet
 * still shows, without what the schema asked for. Every published form must
 * therefore be named by the renderer of its sheet, and every card token the
 * pack publishes (`--adrenaline-card-*`) must be read by the card styles.
 *
 * The same holds for what a sheet says beyond its forms: a property the
 * presentation sets (rows of pointers, placement, cards, a join, a fallback
 * card, a decoration) must be read by the preview of that sheet, by role and
 * not by value, so a property the package starts to publish is caught the day
 * a presentation uses it. A sheet reads with its own sources only (its preview
 * folder and its renderer), comments excluded: another sheet reading the same
 * property, or a comment naming it, proves nothing.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
/* The installed package by default; a path argument measures another build of the provider. */
const provider = process.argv[2]
    ? resolve(process.argv[2])
    : join(root, 'node_modules', 'schema-adrenaline')
const templates = join(root, 'src', 'templates', 'adrenaline')
const preview = join(templates, 'shared', 'preview')
const read = (name) => readFileSync(join(preview, name), 'utf8')

/* Source code without its comments (block comments, then line comments outside a string or URL). */
const code = (source) =>
    source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:'"`/])\/\/.*$/gm, '$1')

/* What one sheet reads: its own preview sources and its shared renderer. */
const sheetSource = (sheet, renderer) => {
    const own = join(templates, sheet, 'preview')
    let files = []
    try {
        files = readdirSync(own)
            .filter((name) => /\.tsx?$/.test(name))
            .map((name) => readFileSync(join(own, name), 'utf8'))
    } catch {
        files = []
    }
    return code([...files, read(renderer)].join('\n'))
}

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
    const source = code(read(renderer))
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

/*
 * Properties a section, a block or the presentation may set. One is read when its sheet accesses it
 * by name (`.cards`); a decoration is read when its sheet names its kind as a string.
 */
const SECTION_PROPERTIES = ['cards', 'joinedTo', 'fallbackCard']
const BLOCK_PROPERTIES = ['pointerRows', 'placement', 'cards']
let properties = 0
const seenProperties = new Set()
for (const [sheet, presentation, renderer] of sheets) {
    if (!presentation) continue
    const source = sheetSource(sheet, renderer)
    const requireRead = (name, where, pattern) => {
        const key = `${sheet}:${name}`
        if (seenProperties.has(key)) return
        seenProperties.add(key)
        properties += 1
        if (!pattern.test(source))
            problems.push(
                `${sheet}: ${name} (${where}) is published but the ${sheet} preview does not read it`
            )
    }
    const accessed = (property) => new RegExp('\\.' + property + '\\b')
    if (presentation.cards !== undefined)
        requireRead('cards', 'presentation', accessed('cards'))
    for (const entry of presentation.cards ?? [])
        if (entry.existsWhenAny !== undefined)
            requireRead(
                'existsWhenAny',
                `card "${entry.id}"`,
                accessed('existsWhenAny')
            )
    for (const section of presentation.sections) {
        for (const property of SECTION_PROPERTIES)
            if (section[property] !== undefined)
                requireRead(
                    property,
                    `section "${section.id}"`,
                    accessed(property)
                )
        for (const block of section.blocks) {
            for (const property of BLOCK_PROPERTIES)
                if (block[property] !== undefined)
                    requireRead(
                        property,
                        `block "${block.id}"`,
                        accessed(property)
                    )
            const kind = block.decoration?.kind
            if (kind)
                requireRead(
                    `decoration "${kind}"`,
                    `block "${block.id}"`,
                    new RegExp(`'${kind}'`)
                )
        }
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
    `assert:adrenaline-coverage: ${forms} published forms drawn across ${sheets.length} sheets, ${properties} layout properties read, ${tokens.size} card tokens read`
)
