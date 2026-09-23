/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveContractManifests } from './contractManifests.mjs'
import { resolveProviderDescriptors } from './providerDescriptors.mjs'

/*
 * Resolves the three corpus manifests and each provider's cross-tool descriptor, bundles the
 * harness, and runs it. Everything asserted lives in the harness: it is the side that can import
 * `src/contracts/registry.node.ts` and `src/core/capabilities.ts`.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const manifests = resolveContractManifests(import.meta.url)
const descriptors = resolveProviderDescriptors(import.meta.url)

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
        // The capability surface folds `templateRegistry`, which reaches every preview and so every
        // per-template stylesheet. Node cannot import CSS; dropping those imports is enough, and no
        // DOM stub is needed, since nothing here renders a preview. The same is true for Vite-only
        // font and image URLs: exercise the React module shape without asking the Node bundle to
        // materialize browser assets.
        loader: { '.css': 'empty', '.svg': 'empty', '.woff2': 'empty' },
        logLevel: 'warning',
    })
    // The bundle runs from a temp directory, so it resolves neither the corpus packages nor the
    // provider descriptors itself.
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        env: {
            ...process.env,
            LANTERN_CONTRACT_MANIFESTS: JSON.stringify(manifests),
            LANTERN_PROVIDER_DESCRIPTORS: JSON.stringify(descriptors),
        },
    })
    assert.equal(run.status, 0, 'contract conformance harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}
