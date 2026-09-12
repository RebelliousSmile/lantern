/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs, { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    normalizeManifest,
    resolveContractManifests,
} from './contractManifests.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const handbookRoot = path.resolve(here, '..', '..', 'handbook')

if (!fs.existsSync(handbookRoot)) {
    process.stdout.write(
        `Cross-repository round trip: skipped, no sibling checkout at ${path.relative(path.join(here, '..'), handbookRoot)}\n`
    )
    process.exit(0)
}

const registryFile = path.join(handbookRoot, 'src/features/blocks/registry.ts')
const tomlExportsFile = path.join(
    handbookRoot,
    'src/features/blocks/tomlExports.ts'
)
if (!fs.existsSync(registryFile) || !fs.existsSync(tomlExportsFile)) {
    process.stderr.write(
        `Cross-repository round trip: sibling checkout at ${handbookRoot} is missing the expected block registry files\n`
    )
    process.exit(1)
}

const manifests = resolveContractManifests(import.meta.url)
const mistCases = normalizeManifest('mist', manifests.mist)

const work = mkdtempSync(path.join(tmpdir(), 'lantern-cross-repo-'))
const bundle = path.join(work, 'cross-repo.mjs')
/* The bundle sandboxes `obsidian` behind this stub, matching the Handbook's own harness pattern. */
const obsidianStub = path.join(work, 'obsidian-stub.mjs')
writeFileSync(
    obsidianStub,
    `export class Notice {}\nexport class Menu {}\nexport class MenuItem {}\nexport class Editor {}\nexport class Plugin {}\nexport class PluginSettingTab {}\nexport class Setting {}\nexport class Modal {}\nexport class ItemView {}\nexport function setIcon() {}\n`
)
try {
    buildSync({
        entryPoints: ['tools/assertCrossRepo.harness.mts'],
        outfile: bundle,
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node20',
        alias: { '@': path.join(here, '..', 'src'), obsidian: obsidianStub },
        logLevel: 'warning',
    })
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        env: {
            ...process.env,
            LANTERN_MIST_CASES: JSON.stringify(mistCases),
        },
    })
    assert.equal(run.status, 0, 'cross-repository round trip harness')
} finally {
    rmSync(work, { recursive: true, force: true })
}
