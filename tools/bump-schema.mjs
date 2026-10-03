/* global console, process, fetch */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { manifestPattern, parseMatrix } from './release-train-matrix.mjs'

/* Moves one schema pin to a published release: package.json, both lockfiles and, for a final,
   the release-train matrix. It is what the `Bump schema` workflow runs when a provider
   publishes, so a pin is never retyped by hand. */

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const HANDBOOK = 'RebelliousSmile/obsidian-handbook'
const TAG = /^v(\d+\.\d+\.\d+)(-rc\.\d+)?$/

function parseTag(tag) {
    const match = TAG.exec(tag)
    assert.ok(match, `tag must be vX.Y.Z or vX.Y.Z-rc.N, found ${String(tag)}`)
    return { version: match[1], final: match[2] === undefined }
}

/** The canonical asset URL of `tag`: a candidate archive carries the final version. */
export function releaseAssetUrl(name, tag) {
    assert.ok(['schema-adrenaline', 'schema-in-the-mist', 'schema-pbta'].includes(name), `unknown schema package: ${String(name)}`)
    return `https://github.com/RebelliousSmile/${name}/releases/download/${tag}/${name}-${parseTag(tag).version}.tgz`
}

/** package.json with `name` pinned to `url`, every other byte kept. */
export function withPin(source, name, url) {
    const current = JSON.parse(source).dependencies?.[name]
    assert.equal(typeof current, 'string', `package.json does not pin ${name}`)
    const line = `"${name}": "${current}"`
    assert.ok(source.includes(line), `package.json pins ${name} in an unexpected form`)
    return source.replace(line, `"${name}": "${url}"`)
}

/** The train manifest a provider publishes for the final `version`. */
export function trainManifestPath(name, version) {
    const path = name === 'schema-in-the-mist' ? `release-trains/v${version}.json` : `release-train/${name}-v${version}.json`
    assert.match(path, manifestPattern(name))
    return path
}

/** The matrix text once `name` is registered at `providerRef` and Handbook at `handbookRef`. */
export function withFinal(text, name, version, providerRef, handbookRef) {
    const matrix = parseMatrix(JSON.parse(text))
    const entry = matrix.providers.find((item) => item.provider === name)
    assert.ok(entry, `matrix does not list ${name}`)
    const path = trainManifestPath(name, version)
    matrix.handbook.ref = handbookRef
    entry.ref = providerRef
    if (!entry.manifests.some((manifest) => manifest.path === path)) entry.manifests.push({ path, validatorRef: providerRef })
    parseMatrix(matrix)
    const indent = /\n([ \t]+)"/.exec(text)?.[1] ?? '    '
    return JSON.stringify(matrix, null, indent) + (text.endsWith('\n') ? '\n' : '')
}

function run(command, args) {
    const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' && command !== 'git' })
    if (result.error) throw result.error
    assert.equal(result.status, 0, `${command} ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`)
    return result.stdout.trim()
}

function mainCommit(repository) {
    const sha = run('git', ['ls-remote', `https://github.com/${repository}.git`, 'refs/heads/main']).split(/\s+/)[0]
    assert.match(sha, /^[a-f0-9]{40}$/, `${repository} has no main`)
    return sha
}

async function main() {
    const [name, tag] = process.argv.slice(2)
    const url = releaseAssetUrl(name, tag)
    const { version, final } = parseTag(tag)
    const published = await fetch(url, { method: 'HEAD' })
    assert.ok(published.ok, `${url} is not published: ${published.status}`)

    const packagePath = resolve(root, 'package.json')
    const source = readFileSync(packagePath, 'utf8')
    const next = withPin(source, name, url)
    if (next !== source) {
        writeFileSync(packagePath, next)
        // The only installs allowed to rewrite a lockfile; CI then installs frozen.
        run('npm', ['install', '--package-lock-only', '--ignore-scripts'])
        run('pnpm', ['install', '--lockfile-only', '--ignore-scripts'])
    }

    if (final) {
        // Not the final tag: a provider may tag a commit that precedes its train manifest.
        const providerRef = mainCommit(`RebelliousSmile/${name}`)
        const path = trainManifestPath(name, version)
        const manifest = await fetch(`https://raw.githubusercontent.com/RebelliousSmile/${name}/${providerRef}/${path}`, { method: 'HEAD' })
        assert.ok(manifest.ok, `${name} has no ${path} on main: ${manifest.status}`)
        const matrixPath = resolve(root, 'release-train.matrix.json')
        const text = readFileSync(matrixPath, 'utf8')
        writeFileSync(matrixPath, withFinal(text, name, version, providerRef, mainCommit(HANDBOOK)))
    }
    console.log(`${name} pinned to ${tag}.`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await main()
}
