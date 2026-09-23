/* global console */
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const monsterheartsPreview = readFileSync(
    path.join(
        root,
        'src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview.tsx'
    ),
    'utf8'
)
const manifest = JSON.parse(
    readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf8')
)
const entry = Object.values(manifest).find((chunk) => chunk.isEntry)

function emittedAsset(sourceSuffix) {
    const entry = Object.entries(manifest).find(([source]) =>
        source.endsWith(sourceSuffix)
    )
    assert.ok(entry, `Vite manifest is missing ${sourceSuffix}`)

    const [, asset] = entry
    assert.match(
        asset.file,
        /^assets\/.+\.svg$/,
        `${sourceSuffix} must be emitted as a served SVG asset`
    )
    assert.equal(
        asset.file.includes('file:'),
        false,
        `${sourceSuffix} must never resolve to a file: URI`
    )
    assert.ok(
        statSync(path.join(root, 'dist', asset.file)).size > 0,
        `${sourceSuffix} output is empty`
    )
}

assert.ok(entry, 'Vite manifest has an application entry')
assert.ok(entry.file, 'Vite entry has an output file')

const entrySize = statSync(path.join(root, 'dist', entry.file)).size
assert.ok(
    entrySize < 400 * 1024,
    `initial entry is ${entrySize} bytes, expected less than 409600`
)

const templateModules = (entry.dynamicImports ?? []).filter((source) =>
    source.startsWith('src/templates/') && source.endsWith('/definition.tsx')
)
assert.equal(
    templateModules.length,
    24,
    `expected 24 lazy template modules, found ${templateModules.length}`
)

for (const source of templateModules) {
    assert.equal(
        manifest[source]?.isDynamicEntry,
        true,
        `${source} must remain a dynamic entry`
    )
}

emittedAsset('/monsterhearts/assets/images/thorn-heart.svg')
emittedAsset('/monsterhearts/assets/variants/drowned-lake/zine-lake.svg')
assert.match(monsterheartsPreview, /thorn-heart\.svg\?url&no-inline/, 'Monsterhearts must import the thorn heart as a Vite URL')
assert.match(monsterheartsPreview, /zine-lake\.svg\?url&no-inline/, 'Drowned Lake must import its mark as a Vite URL')
assert.match(monsterheartsPreview, /<img\s+className="mh-game-mark"\s+src=\{gameMark\}/, 'Monsterhearts must render the bundled game mark URL')
assert.doesNotMatch(monsterheartsPreview, /src=\{(?:assetUrls|publishedGameMark)/, 'Monsterhearts must never render a published file: asset URL')

console.log(
    `Template chunks verified: ${entrySize} byte entry, ${templateModules.length} lazy modules.`
)
