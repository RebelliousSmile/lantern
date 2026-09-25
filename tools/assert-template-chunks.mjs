/* global clearTimeout, console, fetch, process, setTimeout */
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function exited(child) {
    return child.exitCode !== null || child.signalCode !== null
}

function waitForExit(child, timeoutMs) {
    if (exited(child)) return Promise.resolve(true)
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            child.off('exit', onExit)
            resolve(false)
        }, timeoutMs)
        const onExit = () => {
            clearTimeout(timer)
            resolve(true)
        }
        child.once('exit', onExit)
    })
}

export async function terminatePreview(preview, graceMs = 1_000) {
    if (exited(preview)) return 'already-exited'
    preview.kill('SIGTERM')
    if (await waitForExit(preview, graceMs)) return 'SIGTERM'

    preview.kill('SIGKILL')
    assert.equal(
        await waitForExit(preview, graceMs),
        true,
        'Vite preview did not exit after SIGKILL'
    )
    return 'SIGKILL'
}

export async function waitForPreview(
    origin,
    preview,
    { fetcher = fetch, attempts = 100, intervalMs = 50 } = {}
) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        assert.equal(
            exited(preview),
            false,
            'Vite preview exited before becoming ready'
        )
        try {
            const response = await fetcher(origin)
            if (response.ok) return
        } catch {
            // The preview server has not bound its socket yet.
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
    assert.fail('Vite preview did not become ready')
}

export async function fetchServedFiles(origin, files, fetcher = fetch) {
    for (const file of files) {
        const response = await fetcher(`${origin}/${file}`)
        assert.equal(
            response.ok,
            true,
            `${file} returned HTTP ${response.status}`
        )
        assert.ok(
            (await response.arrayBuffer()).byteLength > 0,
            `${file} response is empty`
        )
    }
}

export function referencedJavaScript(manifest, entrySource) {
    const pending = [entrySource]
    const visited = new Set()
    while (pending.length > 0) {
        const source = pending.pop()
        if (visited.has(source)) continue
        const chunk = manifest[source]
        assert.ok(chunk, `Vite manifest is missing referenced chunk ${source}`)
        assert.match(
            chunk.file ?? '',
            /\.js$/,
            `${source} must emit JavaScript`
        )
        visited.add(source)
        pending.push(...(chunk.imports ?? []), ...(chunk.dynamicImports ?? []))
    }
    return [...visited].map((source) => manifest[source].file)
}

async function availablePort() {
    const server = createServer()
    await new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(0, '127.0.0.1', resolve)
    })
    const address = server.address()
    assert.ok(
        address && typeof address !== 'string',
        'failed to allocate preview port'
    )
    await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
    )
    return address.port
}

function emittedAsset(manifest, sourceSuffix, extension) {
    const entry = Object.entries(manifest).find(([source]) =>
        source.endsWith(sourceSuffix)
    )
    assert.ok(entry, `Vite manifest is missing ${sourceSuffix}`)

    const [, asset] = entry
    assert.match(
        asset.file,
        new RegExp(`^assets/.+\\.${extension}$`),
        `${sourceSuffix} must be emitted as a served ${extension.toUpperCase()} asset`
    )
    assert.equal(
        asset.file.includes('file:'),
        false,
        `${sourceSuffix} must never resolve to a file: URI`
    )
    assert.ok(
        statSync(path.join(root, 'dist', asset.file)).size > 0,
        `${sourceSuffix} output is empty`
    )
    return asset.file
}

async function assertServedFiles(files) {
    const port = await availablePort()
    const origin = `http://127.0.0.1:${port}`
    const preview = spawn(
        process.execPath,
        [
            path.join(root, 'node_modules/vite/bin/vite.js'),
            'preview',
            '--host',
            '127.0.0.1',
            '--port',
            String(port),
            '--strictPort',
        ],
        { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }
    )
    let output = ''
    preview.stdout.on('data', (chunk) => {
        output += chunk
    })
    preview.stderr.on('data', (chunk) => {
        output += chunk
    })

    try {
        await waitForPreview(origin, preview)
        await fetchServedFiles(origin, files)
    } catch (error) {
        if (error instanceof Error)
            error.message = `${error.message}\n${output}`
        throw error
    } finally {
        await terminatePreview(preview)
    }
}

async function main() {
    const monsterheartsPreview = readFileSync(
        path.join(
            root,
            'src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview.tsx'
        ),
        'utf8'
    )
    const manifest = JSON.parse(
        readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf8')
    )
    const entryRecord = Object.entries(manifest).find(
        ([, chunk]) => chunk.isEntry
    )
    assert.ok(entryRecord, 'Vite manifest has an application entry')
    const [entrySource, entry] = entryRecord
    assert.ok(entry.file, 'Vite entry has an output file')

    const entrySize = statSync(path.join(root, 'dist', entry.file)).size
    assert.ok(entrySize > 0, 'initial entry is empty')
    assert.ok(
        entrySize < 400 * 1024,
        `initial entry is ${entrySize} bytes, expected less than 409600`
    )

    const templateModules = (entry.dynamicImports ?? []).filter(
        (source) =>
            source.startsWith('src/templates/') &&
            source.endsWith('/definition.tsx')
    )
    assert.equal(
        templateModules.length,
        24,
        `expected 24 lazy template modules, found ${templateModules.length}`
    )

    for (const source of templateModules) {
        assert.equal(
            manifest[source]?.isDynamicEntry,
            true,
            `${source} must remain a dynamic entry`
        )
    }

    const javascript = referencedJavaScript(manifest, entrySource)
    for (const file of javascript) {
        const output = path.join(root, 'dist', file)
        assert.ok(statSync(output).size > 0, `${file} output is empty`)
        const syntax = spawnSync(process.execPath, ['--check', output], {
            encoding: 'utf8',
        })
        assert.equal(
            syntax.status,
            0,
            `${file} is not valid JavaScript\n${syntax.stderr || syntax.stdout}`
        )
    }

    const assets = [
        emittedAsset(
            manifest,
            '/monsterhearts/assets/fonts/im-fell-english-latin-400-normal.woff2',
            'woff2'
        ),
        emittedAsset(
            manifest,
            '/monsterhearts/assets/fonts/averia-serif-libre-latin-700-normal.woff2',
            'woff2'
        ),
        emittedAsset(
            manifest,
            '/monsterhearts/assets/images/thorn-heart.svg',
            'svg'
        ),
        emittedAsset(
            manifest,
            '/monsterhearts/assets/variants/drowned-lake/zine-lake.svg',
            'svg'
        ),
    ]
    assert.match(
        monsterheartsPreview,
        /thorn-heart\.svg\?url&no-inline/,
        'Monsterhearts must import the thorn heart as a Vite URL'
    )
    assert.match(
        monsterheartsPreview,
        /zine-lake\.svg\?url&no-inline/,
        'Drowned Lake must import its mark as a Vite URL'
    )
    assert.match(
        monsterheartsPreview,
        /<img\s+className="mh-game-mark"\s+src=\{gameMark\}/,
        'Monsterhearts must render the bundled game mark URL'
    )
    assert.doesNotMatch(
        monsterheartsPreview,
        /src=\{(?:assetUrls|publishedGameMark)/,
        'Monsterhearts must never render a published file: asset URL'
    )

    await assertServedFiles([...javascript, ...assets])
    console.log(
        `Template chunks verified: ${entrySize} byte entry, ${templateModules.length} lazy modules, ${javascript.length} served JavaScript files, ${assets.length} served assets.`
    )
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main().catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
}
