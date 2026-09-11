/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveContractManifests } from './contractManifests.mjs'

/*
 * Resolves the three corpus manifests, bundles the harness, and runs it. Everything asserted lives
 * in the harness: it is the side that can import `src/contracts/registry.node.ts`.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const manifests = resolveContractManifests(import.meta.url)

const work = mkdtempSync(path.join(tmpdir(), 'lantern-contracts-'))
const bundle = path.join(work, 'contracts.mjs')
try {
    buildSync({
        entryPoints: ['tools/assertContracts.harness.mts'],
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
    // The bundle runs from a temp directory, so it cannot resolve the corpus packages itself.
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        env: {
            ...process.env,
            LANTERN_CONTRACT_MANIFESTS: JSON.stringify(manifests),
        },
    })
    assert.equal(run.status, 0, 'contract conformance harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}
