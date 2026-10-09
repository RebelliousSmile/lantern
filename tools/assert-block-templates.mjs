/* global process */
import { buildSync } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * The PbtA block templates (a pack's NPC, monster, mission... besides its
 * playbook) are proved against the published pack: registered and loadable,
 * sections equal to the presentation contract, blank and example equal to the
 * valid corpus, TOML export accepted by the codec and read back unchanged.
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const work = mkdtempSync(path.join(tmpdir(), 'lantern-blocks-'))
const bundle = path.join(work, 'blocks.mjs')
try {
    buildSync({
        entryPoints: ['tools/assertBlockTemplates.harness.mts'],
        outfile: bundle,
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node20',
        jsx: 'automatic',
        alias: { '@': path.join(root, 'src') },
        loader: {
            '.css': 'empty',
            '.svg': 'empty',
            '.woff2': 'empty',
            '.webp': 'empty',
            '.ttf': 'empty',
        },
        // react-dom/server is CommonJS and requires Node built-ins.
        banner: {
            js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
        },
        logLevel: 'warning',
    })
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        cwd: root,
        env: { ...process.env, LANTERN_ROOT: root },
    })
    assert.equal(run.status, 0, 'PbtA block templates')
} finally {
    rmSync(work, { recursive: true, force: true })
}
