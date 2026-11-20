/* global process */
import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * The pages of an export: each template that declares pages draws a node for every
 * one of them, the page choice filters notes and archive as the panel promises, and
 * the hand-written archive is a zip whose entries, names and checksums read back.
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const work = mkdtempSync(path.join(tmpdir(), 'lantern-export-pages-'))
const bundle = path.join(work, 'pages.mjs')
try {
    await build({
        entryPoints: ['tools/assertExportPages.harness.mts'],
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
            '.toml': 'text',
            '.webp': 'empty',
            '.ttf': 'empty',
        },
        // react-dom/server is CommonJS and requires Node built-ins.
        banner: {
            js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
        },
        plugins: [
            {
                /* Template assets are Vite queries: `?raw` is the file's text, `?url` its name. */
                name: 'vite-queries',
                setup(esbuild) {
                    esbuild.onResolve({ filter: /\?(raw|url)/ }, async (args) => {
                        const [file, query] = args.path.split('?')
                        const resolved = await esbuild.resolve(file, {
                            resolveDir: args.resolveDir,
                            kind: args.kind,
                        })
                        if (resolved.errors.length > 0)
                            return { errors: resolved.errors }
                        return {
                            path: resolved.path,
                            namespace: 'vite-query',
                            pluginData: { raw: query.indexOf('raw') === 0 },
                        }
                    })
                    esbuild.onLoad({ filter: /.*/, namespace: 'vite-query' }, (args) => ({
                        contents: `export default ${JSON.stringify(
                            args.pluginData.raw
                                ? readFileSync(args.path, 'utf8')
                                : path.basename(args.path)
                        )}`,
                        loader: 'js',
                    }))
                },
            },
        ],
        logLevel: 'warning',
    })
    const run = spawnSync(process.execPath, [bundle], {
        stdio: 'inherit',
        cwd: root,
        env: { ...process.env, LANTERN_ROOT: root },
    })
    assert.equal(run.status, 0, 'Export pages')
} finally {
    rmSync(work, { recursive: true, force: true })
}
