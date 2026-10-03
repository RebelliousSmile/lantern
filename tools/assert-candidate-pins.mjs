/* global console, process */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { assertCandidateSchemaPins, candidatePin } from './consumer-schema-pins.mjs'

/* The check of a tree that adopts a schema candidate. `--detect` only answers whether the tree
   is one (exit 0) or not (exit 1), which is how the `Check` workflow picks its gate. */

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const lanternPackage = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

if (process.argv.includes('--detect')) {
    const names = Object.keys(lanternPackage.dependencies).filter((name) => name.startsWith('schema-'))
    process.exit(names.some((name) => candidatePin(lanternPackage, name) !== null) ? 0 : 1)
}

const result = await assertCandidateSchemaPins({
    lanternPackage,
    lanternNpmLock: JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')),
    lanternPnpmLock: readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8'),
})
console.log(JSON.stringify({ status: 'passed', providers: result }, null, 2))
