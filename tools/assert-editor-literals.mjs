/* global console */
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * Guard: an editor never writes a user-visible English string into its markup.
 *
 * The role is "every string an editor shows goes through useUiText()", not a count: zero hard-coded
 * literals are allowed under src/templates/** /editor/** (.tsx), apart from the explicit allow-list
 * below. Preview text, stored values and seed values are out of scope: they are not user-interface
 * strings and live outside the editor folders or outside the JSX and attribute positions scanned here.
 *
 * What counts as a literal, after the comments are stripped:
 *   - JSX text that starts with a letter ("<Label>Name</Label>", "Remove <b>");
 *   - a placeholder / aria-label / title / label attribute given a string ("placeholder="key"");
 *   - a template-literal or string aria-label ("aria-label={`Remove ${x}`}");
 *   - a placeholder / label / title / ariaLabel default ("placeholder = 'Add option'").
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const templatesRoot = path.join(here, '..', 'src', 'templates')

/*
 * Each entry names one file, one scanned string and why it is not a user-visible string. A new entry
 * needs a reason; an entry that no longer matches anything fails the guard so the list cannot rot.
 */
const ALLOWED = [
    {
        file: 'pbta/playbook/editor/ChoiceSetsEditor.tsx',
        text: 'placeholder=move.slug',
        reason: 'A move identifier example, not a word: slugs are technical and stay as written.',
    },
    {
        file: 'pbta/playbook/editor/MovesEditor.tsx',
        text: 'placeholder=move.slug',
        reason: 'A move identifier example, not a word: slugs are technical and stay as written.',
    },
    {
        file: 'monsterhearts/playbook/editor/MonsterheartsPlaybookEditorPanel.tsx',
        text: 'placeholder=move.slug',
        reason: 'A move identifier example, not a word: slugs are technical and stay as written.',
    },
]

const JSX_TEXT_BEFORE_TAG = />\s*([A-Z][A-Za-z][^<>{}]*?)\s*</g
const JSX_TEXT_BEFORE_EXPR = />\s*([A-Z][A-Za-z][^<>{}]*?)\s*\{/g
const ATTRIBUTE =
    /\b(placeholder|aria-label|ariaLabel|title|label)="([A-Za-z][^"]*)"/g
const ATTRIBUTE_EXPR =
    /\b(placeholder|aria-label|ariaLabel|title|label)=\{\s*(?:`([^`]*[A-Za-z]{2}[^`]*)`|'([^']*[A-Za-z]{2}[^']*)'|"([^"]*[A-Za-z]{2}[^"]*)")\s*\}/g
const DEFAULT_PROP =
    /\b(placeholder|label|title|ariaLabel)\s*=\s*'([A-Za-z][^']*)'/g

/*
 * A ">" that is a TypeScript comparison and a later "<" that opens a generic enclose a stretch of code,
 * not a sentence (for instance "NAME_TAG_INDEX + 1 + offset const [editingIndex] = useState"). Wording
 * shown to a user has none of: an assignment, a semicolon, brackets, a call "name(" or a boolean operator.
 */
function looksLikeCode(text) {
    return /[=;[\]]|&&|\|\||\w\(|\) /.test(text)
}

function stripComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

/** Everything the scan treats as a hard-coded string in one file's source. */
export function findLiterals(source) {
    const code = stripComments(source)
    const hits = []
    const squash = (value) => value.split(/\s+/).join(' ').trim()
    for (const match of code.matchAll(JSX_TEXT_BEFORE_TAG)) {
        const text = squash(match[1])
        if (text.length > 1 && !looksLikeCode(text)) hits.push(text)
    }
    for (const match of code.matchAll(JSX_TEXT_BEFORE_EXPR)) {
        const text = squash(match[1])
        if (text.length > 1 && !looksLikeCode(text)) hits.push(text)
    }
    for (const match of code.matchAll(ATTRIBUTE))
        hits.push(`${match[1]}=${match[2]}`)
    for (const match of code.matchAll(ATTRIBUTE_EXPR)) {
        const value = match[2] ?? match[3] ?? match[4]
        // A template made of interpolations only ("${a} - ${b}") carries no wording of its own.
        if (/[A-Za-z]{2}/.test(value.replace(/\$\{[^}]*\}/g, ''))) {
            hits.push(`${match[1]}=${value}`)
        }
    }
    for (const match of code.matchAll(DEFAULT_PROP))
        hits.push(`${match[1]}=${match[2]}`)
    return hits
}

function* editorFiles(directory, insideEditor = false) {
    for (const name of readdirSync(directory).sort()) {
        const entry = path.join(directory, name)
        if (statSync(entry).isDirectory()) {
            yield* editorFiles(entry, insideEditor || name === 'editor')
        } else if (insideEditor && name.endsWith('.tsx')) {
            yield entry
        }
    }
}

/* The scan must keep catching what it is meant to catch: proved on a fixture on every run. */
const fixture = `
    export function Fixture() {
        return (
            <div>
                <Label>Plain label</Label>
                <Input placeholder="key" aria-label={\`Remove \${name}\`} />
                <Button title='Quoted'>{value}</Button>
                Some text {value}
            </div>
        )
    }
    function Defaults({ placeholder = 'Add option' }) {}
`
const expected = [
    'Plain label',
    'placeholder=key',
    'aria-label=Remove ${name}',
    'placeholder=Add option',
]
const found = findLiterals(fixture)
for (const text of expected)
    assert.ok(
        found.includes(text),
        `The literal scan no longer catches ${JSON.stringify(text)} (found ${JSON.stringify(found)}).`
    )
assert.deepEqual(
    findLiterals(
        '<Label>{text("fields.name")}</Label>\n<Input placeholder={text("x")} />\n// <b>Commented</b>'
    ),
    [],
    'The literal scan reports translated markup or comments.'
)

const failures = []
const used = new Set()
let scanned = 0
for (const file of editorFiles(templatesRoot)) {
    scanned += 1
    const relative = path
        .relative(templatesRoot, file)
        .split(path.sep)
        .join('/')
    for (const text of findLiterals(readFileSync(file, 'utf8'))) {
        const index = ALLOWED.findIndex(
            (entry) => entry.file === relative && entry.text === text
        )
        if (index >= 0) used.add(index)
        else failures.push(`${relative}: ${JSON.stringify(text)}`)
    }
}

const stale = ALLOWED.filter((_, index) => !used.has(index)).map(
    (entry) => `${entry.file}: ${JSON.stringify(entry.text)}`
)

assert.ok(scanned > 0, 'No editor .tsx file found under src/templates.')
assert.deepEqual(
    failures,
    [],
    `Hard-coded user-visible strings in editors (route them through useUiText()):\n  ${failures.join('\n  ')}`
)
assert.deepEqual(
    stale,
    [],
    `Allow-list entries that match nothing any more (remove them):\n  ${stale.join('\n  ')}`
)
console.log(
    `Editor literals ok: ${scanned} editor files, ${ALLOWED.length} allow-listed.`
)
