/* global console, process */
/**
 * "Start from the example" must show the example the schema publishes, not the
 * blank starter. Each Adrenaline template reads a published example of
 * schema-adrenaline (`?raw`), which must exist in the installed package.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const problems = []
for (const kind of ['pnj', 'monstre', 'pj']) {
    const file = join(root, 'src', 'templates', 'adrenaline', kind, 'sample.ts')
    const source = readFileSync(file, 'utf8')
    const match =
        /from '(schema-adrenaline\/examples\/adrenaline\/[^']+\.toml)\?raw'/.exec(
            source
        )
    if (!match) {
        problems.push(`${kind}: sample.ts does not read a published example`)
        continue
    }
    if (/export const sample\w+ = blank\w+/.test(source))
        problems.push(`${kind}: the example is the blank starter`)
    if (!existsSync(join(root, 'node_modules', match[1])))
        problems.push(`${kind}: ${match[1]} is not in the installed package`)
}
if (problems.length > 0) {
    for (const p of problems) console.error(`assert:adrenaline-examples: ${p}`)
    process.exit(1)
}
console.log('assert:adrenaline-examples: 3 templates start from a published example')
