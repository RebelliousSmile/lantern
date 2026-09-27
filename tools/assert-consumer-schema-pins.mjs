/* global console, process */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { assertConsumerSchemaPins } from './consumer-schema-pins.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const handbookRoot = process.argv[2]
assert.ok(handbookRoot, 'usage: assert-consumer-schema-pins <pinned-handbook-root>')

const result = await assertConsumerSchemaPins({
    lanternPackage: JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')),
    lanternNpmLock: JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')),
    lanternPnpmLock: readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8'),
    handbookPackage: JSON.parse(readFileSync(resolve(handbookRoot, 'package.json'), 'utf8')),
    handbookPnpmLock: readFileSync(resolve(handbookRoot, 'pnpm-lock.yaml'), 'utf8'),
})
console.log(JSON.stringify({ status: 'passed', providers: result }, null, 2))
