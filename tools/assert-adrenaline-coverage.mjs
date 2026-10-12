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
 * presentation sets (rows of pointers, row labels, subtitle pointers, placement,
 * cards, a join, a fallback card, a decoration and the side it sets) must be read by the preview of that sheet, by role and
 * not by value, so a property the package starts to publish is caught the day
 * a presentation uses it. A sheet reads with its own sources only (its preview
 * folder and its renderer), comments excluded: another sheet reading the same
 * property, or a comment naming it, proves nothing.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { NOT_EDITABLE } from './adrenalineNotEditable.mjs'

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
const BLOCK_PROPERTIES = [
    'pointerRows',
    'placement',
    'cards',
    'rowLabels',
    'subtitlePaths',
]
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
            /* Where a decoration puts its current-state mark: a published side is read, not assumed. */
            if (block.decoration?.current?.position !== undefined)
                requireRead(
                    'position',
                    `decoration "${kind}" of block "${block.id}"`,
                    accessed('position')
                )
        }
    }
}

/*
 * What a sheet publishes must be editable. A block opens an edit panel from its first document
 * path; the root key of every path a block shows must be named by the editor of that sheet (its
 * panel and the shared field components), or be declared below as not yet editable. The list is
 * the debt: it can only shrink, a key leaving it unedited again or a new one failing the gate.
 */
/* Every source file under a folder, sub-folders included (the creature editor has one form file per panel). */
const tree = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
            ? tree(join(dir, entry.name))
            : /[.]tsx?$/.test(entry.name)
              ? [join(dir, entry.name)]
              : []
    )
const editorSource = (sheet) =>
    code(
        [join(templates, sheet, 'editor'), join(templates, 'shared', 'editor')]
            .flatMap(tree)
            .map((file) => readFileSync(file, 'utf8'))
            .join('\n')
    )
let editable = 0
for (const [sheet, presentation] of sheets) {
    if (!presentation) continue
    const source = editorSource(sheet)
    const declared = new Set(NOT_EDITABLE[sheet] ?? [])
    const roots = new Set()
    for (const section of presentation.sections)
        for (const block of section.blocks)
            for (const path of block.paths ?? []) roots.add(path.split('/')[1])
    for (const root of roots) {
        /* Named as a property of the document or as a quoted key, not as a word in a label. */
        const named = new RegExp(
            `(?:document\\.${root}\\b|['"]${root}['"])`
        ).test(source)
        if (declared.has(root)) {
            if (named)
                problems.push(
                    `${sheet}: "${root}" is declared not editable but its editor names it: remove it from NOT_EDITABLE`
                )
            continue
        }
        editable += 1
        if (!named)
            problems.push(
                `${sheet}: the editor never names "${root}", which a published block shows`
            )
    }
}

/*
 * A state may define its own value for these keys in its `delta`, and the card prints that instead of
 * the base: the creature editor reads and writes each of them through the one edited-source function
 * (the delta of the state card that opened the sheet when it defines the key, else the base), never
 * straight on the document.
 */
{
    const monstreSource = editorSource('monstre')
    const contract = await import(
        pathToFileURL(join(provider, 'dist', 'index.js')).href
    )
    /* Every key a state may redefine, as the published delta declares it; a key the base has no counterpart for is the state's own. */
    const deltaKeys = Object.keys(contract.DeltaEtatDeCreature.shape).filter(
        (key) => key in contract.Monstre.shape
    )
    if (deltaKeys.length === 0)
        problems.push('monstre: the published delta declares no key to serve')
    if (!/[.]profile/.test(monstreSource) || !/[.]delta/.test(monstreSource))
        problems.push(
            'monstre: the editor never edits the delta of the state card that opened it (sheet.profile)'
        )
    /*
     * The role, not a text: outside the states panel (which edits the deltas it lists by hand), no
     * delta key may be read or written except as the argument of editedSource. Once those calls are
     * set aside, the key must not appear at all in the panel code: neither as a property of the
     * document or of the draft being updated, nor as a quoted key.
     */
    const own = join(templates, 'monstre', 'editor')
    /* The editor files by name: the hook, the forms, and the pure logic. */
    const files = Object.fromEntries(
        tree(own).map((file) => [
            file.slice(own.length + 1).replace(/\\/g, '/'),
            code(readFileSync(file, 'utf8')),
        ])
    )
    /* The states form edits the deltas it lists, one source per state (`sourceFor`): the one panel that is not about the clicked card. */
    const outsideStates = Object.entries(files)
        .filter(([name]) => name !== 'forms/StatesForm.tsx')
        .map(([, body]) => body)
        .join('\n')
    if (!files['forms/StatesForm.tsx'])
        problems.push('monstre: the states form could not be set apart')
    /*
     * The one gesture that creates a delta key: the user gives a state its own values. Only the hook
     * calls `giveDeltaKey` (from `giveKeys`), and only the hook and the delta logic write a delta;
     * no field creates one by being typed into.
     */
    for (const [name, body] of Object.entries(files)) {
        if (name === 'deltaEdit.ts') continue
        if (name !== 'useMonstreEdit.tsx') {
            for (const word of [
                'giveDeltaKey',
                'writeDeltaKey',
                'takeBackDeltaKey',
            ])
                if (body.includes(word))
                    problems.push(
                        `monstre: ${name} calls ${word}: only the edit hook may create, write or remove a delta key`
                    )
            if (/\bdelta\s*[:=]/.test(body))
                problems.push(
                    `monstre: ${name} writes a delta by hand: a delta key is created by the give gesture only`
                )
        }
        if (
            !['useMonstreEdit.tsx', 'forms/StatesForm.tsx'].includes(name) &&
            body.includes('sourceFor(')
        )
            problems.push(
                `monstre: ${name} picks a profile by hand with sourceFor: the panel of a clicked card edits editedSource`
            )
    }
    const hook = files['useMonstreEdit.tsx'] ?? ''
    if (
        (hook.match(/giveDeltaKey[(]/g) ?? []).length !== 1 ||
        !/const giveKeys = [\s\S]*?giveDeltaKey[(]/.test(hook)
    )
        problems.push(
            'monstre: giveDeltaKey must be called once, from giveKeys, the only way a delta key is created'
        )
    const stripped = outsideStates
        .replace(/editedSource[(]\s*'[A-Za-z]+'\s*[)]/g, '')
        .replace(/shows[(]([^()]*)[)]/g, '')
        .replace(/target === '[a-z]+'/g, '')
        .replace(/case '[a-z]+':/g, '')
        /* Texts (translation keys, class names) are blanked; a quoted bare word, a possible key, is kept. */
        .replace(/(['"`])((?:(?!\1)[^\\\n])*)\1/g, (whole, quote, body) =>
            /^[A-Za-z]+$/.test(body) ? whole : '""'
        )
    for (const key of deltaKeys) {
        if (
            !new RegExp(String.raw`editedSource[(]\s*'${key}'\s*[)]`).test(
                outsideStates
            )
        )
            problems.push(
                `monstre: the published delta key "${key}" is not served by editedSource, so a click on a state card edits the base`
            )
        const direct = new RegExp(
            `(?:[A-Za-z_]+[.]${key}(?![A-Za-z])|['"\`]${key}['"\`])`
        ).exec(stripped)
        if (direct)
            problems.push(
                `monstre: the editor reads or writes "${key}" outside editedSource (${direct[0]}), bypassing the profile`
            )
    }
}

/*
 * A click on a zone opens one panel (editTargets.ts), and that panel must carry every key the zone
 * prints. The table says which keys each panel carries; here each claim is read against the panel's own
 * region of the editor: a key it lists but its region never names (as an edited source, a document
 * property or a quoted key) is a claim without an editor behind it.
 */
{
    const table = code(
        readFileSync(join(templates, 'monstre', 'editTargets.ts'), 'utf8')
    )
    const own = join(templates, 'monstre', 'editor')
    const dispatcher = code(
        readFileSync(join(own, 'MonstreEditorPanel.tsx'), 'utf8')
    )
    /* The form each panel name opens, as the dispatcher's switch declares it. */
    const formOf = Object.fromEntries(
        [
            ...dispatcher.matchAll(
                /case '([a-z]+)':\s*return <([A-Za-z]+) \/>/g
            ),
        ].map(([, panel, form]) => [panel, form])
    )
    const fields = code(readFileSync(join(own, 'fieldHelpers.ts'), 'utf8'))
    const entries = [...table.matchAll(/\[\s*'([a-z]+)',\s*\[([^\]]*)\]\s*\]/g)]
    if (entries.length === 0)
        problems.push('monstre: editTargets.ts lists no panel')
    const claimed = new Set()
    for (const [, panel, list] of entries) {
        const file = formOf[panel]
            ? join(own, 'forms', `${formOf[panel]}.tsx`)
            : null
        let region = null
        try {
            region = file ? code(readFileSync(file, 'utf8')) + fields : null
        } catch {
            region = null
        }
        if (region === null) {
            problems.push(
                `monstre: panel "${panel}" has no form behind it in the editor`
            )
            continue
        }
        for (const [, key] of list.matchAll(/'([A-Za-z]+)'/g)) {
            claimed.add(key)
            /* The key as the form names it: an edited source, a document property, a quoted key or a `shows` argument. The state list is the states form's `states`. */
            const named = new RegExp(
                String.raw`(?:editedSource[(]\s*'${key}'\s*[)]|document[.]${key}(?![A-Za-z])|['"]${key}['"])`
            )
            /* The field is rendered only through the `shows` gate: the key must be an argument of one (or one of the creature fields the form filters through it). */
            const gated = new RegExp(
                String.raw`shows[(]\s*'${key}'\s*[)]|\[\s*'${key}',\s*'`
            )
            if (!gated.test(region))
                problems.push(
                    `monstre: panel "${panel}" lists "${key}" but its form renders no field behind shows('${key}')`
                )
            const used =
                named.test(region) ||
                (panel === 'states' &&
                    key === 'etats' &&
                    /states[.]map/.test(region))
            if (!used)
                problems.push(
                    `monstre: editTargets.ts says panel "${panel}" carries "${key}", its form never names it`
                )
        }
        /* The other direction: a field gated on a key the panel does not list would be rendered for a zone that does not print it. */
        const listed = [...list.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1])
        for (const [, key] of region.matchAll(/shows[(]\s*'([A-Za-z]+)'/g))
            if (!listed.includes(key))
                problems.push(
                    `monstre: the form of panel "${panel}" renders a field behind shows('${key}'), which editTargets.ts does not list for it`
                )
    }
    for (const key of NOT_EDITABLE.monstre)
        if (claimed.has(key))
            problems.push(
                `monstre: "${key}" is declared not editable but a panel claims it`
            )
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
    `assert:adrenaline-coverage: ${forms} published forms drawn across ${sheets.length} sheets, ${properties} layout properties read, ${tokens.size} card tokens read, ${editable} document keys named by an editor`
)
