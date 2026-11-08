/* global process */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getSampleOtherscapeChallenge } from '../src/templates/otherscape/challenge/sample'
import * as challenge from '../src/templates/otherscape/challenge/toml'
import { getSampleOtherscapeCharacterTrope } from '../src/templates/otherscape/character-trope/sample'
import * as trope from '../src/templates/otherscape/character-trope/toml'
import {
    blankCharacterTheme,
    blankLoadoutItem,
    blankTagCombo,
    isCompleteCombo,
    MAX_THEMES,
} from '../src/templates/otherscape/character/model'
import { getSampleOtherscapeCharacter } from '../src/templates/otherscape/character/sample'
import * as character from '../src/templates/otherscape/character/toml'
import { getSampleOtherscapePowerSet } from '../src/templates/otherscape/power-set/sample'
import * as powerSet from '../src/templates/otherscape/power-set/toml'
import { getSampleOtherscapeThemeKit } from '../src/templates/otherscape/theme-kit/sample'
import * as themeKit from '../src/templates/otherscape/theme-kit/toml'
import { getSampleOtherscapeTheme } from '../src/templates/otherscape/theme/sample'
import * as theme from '../src/templates/otherscape/theme/toml'

/*
 * The character sheet (the name, up to four themes, tag combos, loadout and its loaded flag), the
 * fields schema-in-the-mist added to the theme (description, Special), the theme kit (description, Special), the power set
 * (rating, optional rating, tags and statuses), the challenge (rating, beside the scale) and the character trope (the page of each kit it
 * cites) go through Lantern's codecs and the published contract unchanged:
 *
 * - each sample exports, and the export parses back through the schema to the same document;
 * - each valid corpus file parses, carries the new fields, and survives the round trip;
 * - the corpus files the schema refuses are refused here too;
 * - what the editor can leave half-done (a Special with no description, an optional rating
 *   without a rating, a cleared page) never reaches the file.
 */

const corpus = process.env.LANTERN_MIST_CORPUS
assert.ok(
    corpus,
    'LANTERN_MIST_CORPUS names the schema-in-the-mist contract corpus'
)
const read = (kind: 'valid' | 'invalid', name: string) =>
    readFileSync(path.join(corpus, kind, `otherscape--${name}.toml`), 'utf8')

// The codecs carry the canonical source on the document; comparing plain data keeps the proof on
// the fields themselves.
const plain = (value: unknown) => {
    const copy = JSON.parse(JSON.stringify(value)) as Record<string, unknown>
    delete copy.__canonicalSource
    return copy
}

type Codec<D> = {
    name: string
    sample: () => D
    exportToTOML: (document: D) => string
    parse: (text: string) => D
}

const codecs = [
    {
        name: 'challenge',
        sample: getSampleOtherscapeChallenge,
        exportToTOML: challenge.exportToTOML,
        parse: (text: string) =>
            challenge.importFromTOMLWithWarnings(text).otherscapeChallenge,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapeChallenge>>,
    {
        name: 'theme-kit',
        sample: getSampleOtherscapeThemeKit,
        exportToTOML: themeKit.exportToTOML,
        parse: (text: string) =>
            themeKit.importFromTOMLWithWarnings(text).otherscapeThemeKit,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapeThemeKit>>,
    {
        name: 'power-set',
        sample: getSampleOtherscapePowerSet,
        exportToTOML: powerSet.exportToTOML,
        parse: (text: string) =>
            powerSet.importFromTOMLWithWarnings(text).otherscapePowerSet,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapePowerSet>>,
    {
        name: 'character-trope',
        sample: getSampleOtherscapeCharacterTrope,
        exportToTOML: trope.exportToTOML,
        parse: (text: string) =>
            trope.importFromTOMLWithWarnings(text).otherscapeCharacterTrope,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapeCharacterTrope>>,
    {
        name: 'theme',
        sample: getSampleOtherscapeTheme,
        exportToTOML: theme.exportToTOML,
        parse: (text: string) =>
            theme.importFromTOMLWithWarnings(text).otherscapeTheme,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapeTheme>>,
    {
        name: 'character',
        sample: getSampleOtherscapeCharacter,
        exportToTOML: character.exportToTOML,
        parse: (text: string) =>
            character.importFromTOMLWithWarnings(text).otherscapeCharacter,
    } satisfies Codec<ReturnType<typeof getSampleOtherscapeCharacter>>,
]

for (const codec of codecs) {
    const run = codec as Codec<unknown>
    const sample = run.sample()
    assert.deepEqual(
        plain(run.parse(run.exportToTOML(sample))),
        plain(sample),
        `${codec.name}: the sample survives export and import`
    )

    const fromCorpus = run.parse(read('valid', codec.name))
    assert.deepEqual(
        plain(run.parse(run.exportToTOML(fromCorpus))),
        plain(fromCorpus),
        `${codec.name}: the valid corpus file survives export and import`
    )
}

// ---------- The new fields are read, not dropped ----------
const kit = themeKit.importFromTOMLWithWarnings(
    read('valid', 'theme-kit')
).otherscapeThemeKit
assert.ok(kit.description.trim(), 'theme-kit: the description is read')
assert.ok(
    kit.special.name.trim() && kit.special.description.trim(),
    'theme-kit: the Special is read'
)

const set = powerSet.importFromTOMLWithWarnings(
    read('valid', 'power-set')
).otherscapePowerSet
assert.equal(set.rating, 1, 'power-set: the rating is read')
assert.equal(set.optional_rating, 1, 'power-set: the optional rating is read')
assert.deepEqual(
    set.tags_and_statuses,
    ['{enraged-2}', '{skin like scrap iron}', '{will not stay down}'],
    'power-set: the tags and statuses are read with their braces'
)

const rated = challenge.importFromTOMLWithWarnings(
    read('valid', 'challenge')
).otherscapeChallenge
assert.equal(rated.rating, 2, 'challenge: the rating is read')
assert.equal(rated.scale, 1, 'challenge: the scale is read beside it')

const cited = trope.importFromTOMLWithWarnings(
    read('valid', 'character-trope')
).otherscapeCharacterTrope
const pages = [...cited.theme_kits, ...cited.choices].map((ref) => ref.page)
assert.deepEqual(
    pages,
    [96, 104, 118, 121, 130, 142],
    'character-trope: the page of every cited kit is read'
)

const themeWithSpecial = theme.importFromTOMLWithWarnings(
    read('valid', 'theme-special')
).otherscapeTheme
assert.ok(themeWithSpecial.description.trim(), 'theme: the description is read')
assert.ok(
    themeWithSpecial.special.name.trim() &&
        themeWithSpecial.special.description.trim(),
    'theme: the Special is read'
)

// The counts are read off the corpus file itself, so a longer sheet does not
// make this proof stale.
const vesperText = read('valid', 'character')
const tables = (name: string) =>
    vesperText
        .split(String.fromCharCode(10))
        .filter((line) => line.trim() === `[[${name}]]`).length
const vesper =
    character.importFromTOMLWithWarnings(vesperText).otherscapeCharacter
assert.ok(
    vesper.themes.length > 0 && vesper.themes.length <= MAX_THEMES,
    'character: the themes are read, within the limit'
)
assert.equal(
    vesper.themes.length,
    tables('themes'),
    'character: every theme of the file is read'
)
assert.equal(
    vesper.tag_combos.length,
    tables('tag_combos'),
    'character: every tag combo of the file is read'
)
assert.equal(
    vesper.loadout.length,
    tables('loadout'),
    'character: every loadout item of the file is read'
)
assert.equal(
    vesper.loadout.filter((item) => item.loaded === true).length,
    (vesperText.match(/^loaded\s*=\s*true/gm) ?? []).length,
    'character: the loaded flag of every item is read'
)
assert.ok(
    vesper.themes.every((entry) => entry.special.name.trim()),
    'character: the Special of each theme is read'
)

// ---------- What the schema refuses, Lantern refuses ----------
const refused = [
    'challenge-rating-six',
    'character-crew-theme',
    'character-five-themes',
    'character-negative-power',
    'character-trope-page-zero',
    'power-set-rating-six',
]
for (const name of refused) {
    // The longest codec name that prefixes the file wins: `character-trope-*`
    // belongs to the trope, not to the character.
    const codec = codecs
        .filter((entry) => name.startsWith(entry.name))
        .sort((a, z) => z.name.length - a.name.length)[0]
    assert.ok(codec, `${name}: a codec reads it`)
    assert.throws(
        () => (codec as Codec<unknown>).parse(read('invalid', name)),
        `${name}: the schema refuses it`
    )
}

// ---------- Half-done edits never reach the file ----------
const halfSpecial = getSampleOtherscapeThemeKit()
halfSpecial.special = { name: 'Street Medic', description: '  ' }
halfSpecial.description = ''
const halfKitText = themeKit.exportToTOML(halfSpecial)
assert.doesNotMatch(
    halfKitText,
    /\[special\]/,
    'theme-kit: a half-filled Special is not written'
)
assert.doesNotMatch(
    halfKitText,
    /^description\s*=/m,
    'theme-kit: a blank description is not written'
)

const unrated = getSampleOtherscapePowerSet()
unrated.rating = null
unrated.tags_and_statuses = []
const unratedText = powerSet.exportToTOML(unrated)
assert.doesNotMatch(
    unratedText,
    /rating\s*=/,
    'power-set: no rating writes neither rating'
)
assert.doesNotMatch(
    unratedText,
    /tags_and_statuses/,
    'power-set: an empty list is not written'
)
assert.equal(
    powerSet.importFromTOMLWithWarnings(unratedText).otherscapePowerSet
        .optional_rating,
    null,
    'power-set: the optional rating comes back empty without a rating'
)

const unratedChallenge = getSampleOtherscapeChallenge()
unratedChallenge.rating = null
assert.doesNotMatch(
    challenge.exportToTOML(unratedChallenge),
    /^rating\s*=/m,
    'challenge: no rating is not written'
)

const unpaged = getSampleOtherscapeCharacterTrope()
for (const ref of [...unpaged.theme_kits, ...unpaged.choices]) {
    delete ref.page
}
const unpagedText = trope.exportToTOML(unpaged)
assert.doesNotMatch(
    unpagedText,
    /page\s*=/,
    'character-trope: a cleared page is not written'
)

// ---------- A character's half-done edits never reach the file ----------
const draft = getSampleOtherscapeCharacter()
const completeCombos = draft.tag_combos.filter(isCompleteCombo).length
draft.tag_combos.push(blankTagCombo())
draft.loadout.push(blankLoadoutItem())
const draftText = character.exportToTOML(draft)
assert.equal(
    (draftText.match(/^\[\[tag_combos\]\]/gm) ?? []).length,
    completeCombos,
    'character: an incomplete tag combo is not written'
)
assert.equal(
    (draftText.match(/^\[\[loadout\]\]/gm) ?? []).length,
    draft.loadout.length,
    'character: a new loadout item is written'
)
assert.equal(
    (draftText.match(/^loaded\s*=\s*false/gm) ?? []).length,
    draft.loadout.filter((item) => item.loaded === false).length,
    'character: an item left unloaded is written as such'
)

const crowded = getSampleOtherscapeCharacter()
const extra = blankCharacterTheme('self')
while (crowded.themes.length <= MAX_THEMES) crowded.themes.push(extra)
assert.equal(
    (character.exportToTOML(crowded).match(/^\[\[themes\]\]/gm) ?? []).length,
    MAX_THEMES,
    'character: no more than the limit of themes reaches the file'
)

console.log(
    `assert:otherscape-fields: ${codecs.length} samples and ${codecs.length} corpus files round trip through the schema; ` +
        'description, Special, rating, optional rating, tags and statuses, pages and the character sheet are read; ' +
        `${refused.length} refused corpus files are refused; half-done edits are not written`
)
