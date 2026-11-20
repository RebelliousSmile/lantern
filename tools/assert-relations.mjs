/* global process */
import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * The relations sheet, proved through its rendered preview and panel:
 *  - the published example and a sheet typed with every field of the schema are written as TOML by
 *    the editor export and read back unchanged;
 *  - the preview prints the places the schema allows (four other characters, ten NPCs) whether or not
 *    they are filled, and the attitude modifier comes from the published level;
 *  - a click zone of the sheet opens only the entry it names;
 *  - an NPC created in the panel takes the smallest free number and an existing number is never moved.
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const work = mkdtempSync(path.join(tmpdir(), 'lantern-relations-'))
const bundle = path.join(work, 'relations.mjs')
try {
    await build({
        entryPoints: ['tools/assertRelations.harness.mts'],
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
                /* The sheet's assets are Vite queries: `?raw` is the file's text, `?url` its name. */
                name: 'vite-queries',
                setup(esbuild) {
                    esbuild.onResolve(
                        { filter: /\?(raw|url)/ },
                        async (args) => {
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
                        }
                    )
                    esbuild.onLoad(
                        { filter: /.*/, namespace: 'vite-query' },
                        (args) => ({
                            contents: `export default ${JSON.stringify(
                                args.pluginData.raw
                                    ? readFileSync(args.path, 'utf8')
                                    : path.basename(args.path)
                            )}`,
                            loader: 'js',
                        })
                    )
                },
            },
            {
                /* The harness types into the rendered panels: fields report their handlers, `useState` keeps a draft between renders, the document hook reads the harness. */
                name: 'typing-doubles',
                setup(esbuild) {
                    const double = (file) => path.join(root, 'tools', file)
                    esbuild.onResolve(
                        {
                            filter: /^@\/components\/ui\/(input|textarea|checkbox|button)$/,
                        },
                        () => ({ path: double('assertAdrenalinePj.input.mts') })
                    )
                    esbuild.onResolve(
                        { filter: /^\.{1,2}\/(?:\.\.\/)*shared\/hooks$/ },
                        () => ({ path: double('assertAdrenalinePj.hooks.mts') })
                    )
                    esbuild.onResolve({ filter: /^react$/ }, () => ({
                        path: double('assertAdrenalinePj.react.mts'),
                    }))
                },
            },
            {
                /* The Radix select renders nothing on the server: the harness reads a serialising double. */
                name: 'select-double',
                setup(esbuild) {
                    esbuild.onResolve(
                        { filter: /^@\/components\/ui\/select$/ },
                        () => ({
                            path: path.join(
                                root,
                                'tools',
                                'assertAdrenalinePj.select.mts'
                            ),
                        })
                    )
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
    assert.equal(run.status, 0, 'Relations sheet')
} finally {
    rmSync(work, { recursive: true, force: true })
}
