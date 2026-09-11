/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { buildSync } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { MIST_ENGINE_CODECS } from 'schema-in-the-mist'

const work = mkdtempSync(path.join(tmpdir(), 'lantern-mist-contract-'))
const bundle = path.join(work, 'preservation.cjs')
try {
    buildSync({
        entryPoints: ['tools/assertMistContract.harness.mts'],
        outfile: bundle,
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: 'node20',
        logLevel: 'warning',
    })
    const run = spawnSync(process.execPath, [bundle], { stdio: 'inherit' })
    assert.equal(run.status, 0, 'Lantern source-overlay preservation harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}

const require = createRequire(import.meta.url)
const manifestFile = require.resolve('schema-in-the-mist/corpus/contract/cases.json')
const root = path.dirname(manifestFile)
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
let accepted = 0
let rejected = 0

for (const entry of manifest.cases) {
    const codec = MIST_ENGINE_CODECS[entry.target]
    const source = fs.readFileSync(path.join(root, entry.file), 'utf8')
    if (entry.canonical === 'accept') {
        const parsed = codec.parseToml(source)
        assert.deepStrictEqual(codec.parseToml(codec.stringifyToml(parsed)), parsed, entry.id)
        accepted += 1
    } else {
        assert.throws(() => codec.parseToml(source), undefined, entry.id)
        rejected += 1
    }
}

assert.equal(Object.keys(MIST_ENGINE_CODECS).length, 14)
process.stdout.write(`Lantern contract: ${accepted} accepted, ${rejected} rejected across 14 targets.\n`)
