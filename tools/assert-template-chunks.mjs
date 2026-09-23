/* global console */
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(
    readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf8')
)
const entry = Object.values(manifest).find((chunk) => chunk.isEntry)

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

console.log(
    `Template chunks verified: ${entrySize} byte entry, ${templateModules.length} lazy modules.`
)
