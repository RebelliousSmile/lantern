/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * Bundles the Otherscape field harness and runs it against the contract corpus of the installed
 * schema-in-the-mist, so the proof follows whichever schema Lantern is pinned to.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const schemaRoot = path.dirname(
    require.resolve('schema-in-the-mist/package.json')
)
const corpus = path.join(schemaRoot, 'corpus', 'contract')

const work = mkdtempSync(path.join(tmpdir(), 'lantern-otherscape-fields-'))
const bundle = path.join(work, 'otherscape-fields.mjs')
try {
    buildSync({
        entryPoints: ['tools/assertOtherscapeFields.harness.mts'],
        outfile: bundle,
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node20',
        // Same alias as tsconfig.json and vite.config.ts.
        alias: { '@': path.join(here, '..', 'src') },
        loader: {
            '.css': 'empty',
            '.svg': 'empty',
            '.woff2': 'empty',
            '.toml': 'text',
            '.webp': 'empty',
            '.ttf': 'empty',
        },
        logLevel: 'warning',
    })
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        env: { ...process.env, LANTERN_MIST_CORPUS: corpus },
    })
    assert.equal(run.status, 0, 'Otherscape field harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}
