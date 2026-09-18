/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const work = mkdtempSync(path.join(tmpdir(), 'lantern-workspace-'))
const bundle = path.join(work, 'workspace.mjs')
try {
    buildSync({ entryPoints: ['tools/assertWorkspace.harness.mts'], outfile: bundle, bundle: true, platform: 'node', format: 'esm', target: 'node20', alias: { '@': path.join(here, '..', 'src') }, loader: { '.css': 'empty' }, logLevel: 'warning' })
    assert.equal(spawnSync(process.execPath, [bundle], { stdio: 'inherit' }).status, 0)
} finally { rmSync(work, { recursive: true, force: true }) }
