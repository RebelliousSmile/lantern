/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs, { mkdtempSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MIST_ENGINE_CODECS } from 'schema-in-the-mist'

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const manifestFile = require.resolve(
    'schema-in-the-mist/corpus/contract/cases.json'
)
const root = path.dirname(manifestFile)

const work = mkdtempSync(path.join(tmpdir(), 'lantern-mist-contract-'))
const bundle = path.join(work, 'preservation.mjs')
try {
    buildSync({
        entryPoints: ['tools/assertMistContract.harness.mts'],
        outfile: bundle,
        bundle: true,
        platform: 'node',
        // ESM, not CJS: the harness ends on a top-level await and esbuild refuses that in CJS.
        format: 'esm',
        target: 'node20',
        // The template codecs the harness pulls in import `@/contracts/mist-engine`; keep this in
        // step with the same alias in tsconfig.json and vite.config.ts.
        alias: { '@': path.join(here, '..', 'src') },
        logLevel: 'warning',
    })
    // The bundle runs from a temp directory, so it cannot resolve the corpus package itself.
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        env: { ...process.env, MIST_CONTRACT_CASES: manifestFile },
    })
    assert.equal(run.status, 0, 'Lantern source-overlay preservation harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
let accepted = 0
let rejected = 0

for (const entry of manifest.cases) {
    const codec = MIST_ENGINE_CODECS[entry.target]
    const source = fs.readFileSync(path.join(root, entry.file), 'utf8')
    if (entry.canonical === 'accept') {
        const parsed = codec.parseToml(source)
        assert.deepStrictEqual(
            codec.parseToml(codec.stringifyToml(parsed)),
            parsed,
            entry.id
        )
        accepted += 1
    } else {
        assert.throws(() => codec.parseToml(source), undefined, entry.id)
        rejected += 1
    }
}

assert.equal(Object.keys(MIST_ENGINE_CODECS).length, 14)
process.stdout.write(
    `Lantern contract: ${accepted} accepted, ${rejected} rejected across 14 targets.\n`
)
