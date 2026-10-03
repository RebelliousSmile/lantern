/* global console, process, fetch, Buffer */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { manifestPattern, parseMatrix } from './release-train-matrix.mjs'

/* Moves one schema pin to a published release: package.json, both lockfiles and, for a final,
   the release-train matrix. It is what the `Bump schema` workflow runs when a provider
   publishes, so a pin is never retyped by hand.

   The lockfiles are rewritten as text, not by npm or pnpm: resolving a release asset makes pnpm
   record the signed storage URL GitHub redirects to, which expires and carries no SRI. The SRI
   written here is computed from the published bytes, the very thing the pin assertion compares. */

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const HANDBOOK = 'RebelliousSmile/obsidian-handbook'
const TAG = /^v(\d+\.\d+\.\d+)(-rc\.\d+)?$/
const RESOLVED = ['dependencies', 'peerDependencies', 'optionalDependencies']

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

/** The URL `name` is pinned to; anything but a release asset of that package is refused. */
export function currentPin(source, name) {
    const url = JSON.parse(source).dependencies?.[name]
    const prefix = `https://github.com/RebelliousSmile/${name}/releases/download/`
    assert.ok(typeof url === 'string' && url.startsWith(prefix), `package.json does not pin ${name} to a release asset: ${String(url)}`)
    return url
}

/** `source` with every mention of the old asset moved to the new one. */
export function withPin(source, from, to) {
    assert.ok(source.includes(from), `nothing pins ${from}`)
    return source.split(from).join(to)
}

function edited(text, edit) {
    const eol = text.includes('\r\n') ? '\r\n' : '\n'
    const lines = text.split(eol)
    edit(lines)
    return lines.join(eol)
}

/** A pnpm lockfile whose `name` resolution carries the SRI and version of the new archive. */
export function withPnpmResolution(lock, name, url, integrity, version) {
    return edited(lock, (lines) => {
        const at = lines.indexOf(`  ${name}@${url}:`)
        assert.ok(at >= 0 && /^ {4}resolution: \{integrity: sha512-/.test(lines[at + 1] ?? ''), `pnpm-lock.yaml has no resolution for ${name}`)
        lines[at + 1] = `    resolution: {integrity: ${integrity}, tarball: ${url}}`
        assert.ok(/^ {4}version: /.test(lines[at + 2] ?? ''), `pnpm-lock.yaml records no version for ${name}`)
        lines[at + 2] = `    version: ${version}`
    })
}

/** An npm lockfile whose `name` entry carries the SRI and version of the new archive. */
export function withNpmResolution(lock, name, url, integrity, version) {
    return edited(lock, (lines) => {
        const at = lines.findIndex((line) => line.trim() === `"node_modules/${name}": {`)
        const field = (key, offset) => {
            const match = new RegExp(`^(\\s*"${key}": ")[^"]*(",?)$`).exec(lines[at + offset] ?? '')
            assert.ok(at >= 0 && match, `package-lock.json records no ${key} for ${name}`)
            return match
        }
        assert.ok(field('resolved', 2)[0].includes(`"${url}"`), `package-lock.json does not resolve ${name} to ${url}`)
        const [, versionHead, versionTail] = field('version', 1)
        lines[at + 1] = versionHead + version + versionTail
        const [, integrityHead, integrityTail] = field('integrity', 3)
        lines[at + 3] = integrityHead + integrity + integrityTail
    })
}

/** package.json of an npm archive, read without unpacking it to disk. */
export function archiveManifest(bytes) {
    const tar = gunzipSync(bytes)
    for (let offset = 0; offset + 512 <= tar.length; ) {
        const name = tar.toString('utf8', offset, offset + 100).replace(/\0.*$/, '')
        if (name === '') break
        const size = parseInt(tar.toString('utf8', offset + 124, offset + 136), 8)
        if (name === 'package/package.json') return JSON.parse(tar.toString('utf8', offset + 512, offset + 512 + size))
        offset += 512 + Math.ceil(size / 512) * 512
    }
    throw new assert.AssertionError({ message: 'archive has no package/package.json' })
}

export function integrityOf(bytes) {
    return `sha512-${createHash('sha512').update(bytes).digest('base64')}`
}

async function download(url) {
    const response = await fetch(url)
    assert.ok(response.ok, `${url} is not published: ${response.status}`)
    return Buffer.from(await response.arrayBuffer())
}

/** The published facts a lockfile needs, after proving the text rewrite is enough for them. */
export async function resolveBump(name, tag, from) {
    const to = releaseAssetUrl(name, tag)
    const bytes = await download(to)
    const manifest = archiveManifest(bytes)
    assert.equal(manifest.name, name, `${to} packs ${manifest.name}`)
    assert.equal(manifest.version, parseTag(tag).version, `${to} packs version ${manifest.version}`)
    if (from !== to) {
        const previous = archiveManifest(await download(from))
        for (const field of RESOLVED) {
            // New or moved dependencies need a real resolution, which no text rewrite can invent.
            assert.deepEqual(manifest[field] ?? {}, previous[field] ?? {}, `${name} ${tag} changes its ${field}: resolve the lockfiles by hand`)
        }
    }
    return { to, integrity: integrityOf(bytes), version: manifest.version }
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

function mainCommit(repository) {
    const result = spawnSync('git', ['ls-remote', `https://github.com/${repository}.git`, 'refs/heads/main'], { cwd: root, encoding: 'utf8' })
    if (result.error) throw result.error
    const sha = result.stdout.split(/\s+/)[0]
    assert.match(sha, /^[a-f0-9]{40}$/, `${repository} has no main`)
    return sha
}

async function main() {
    const [name, tag] = process.argv.slice(2)
    const packagePath = resolve(root, 'package.json')
    const source = readFileSync(packagePath, 'utf8')
    const from = currentPin(source, name)
    const { to, integrity, version } = await resolveBump(name, tag, from)
    if (from !== to) writeFileSync(packagePath, withPin(source, from, to))
    const locks = [
        ['package-lock.json', withNpmResolution],
        ['pnpm-lock.yaml', withPnpmResolution],
    ]
    for (const [file, withResolution] of locks) {
        const path = resolve(root, file)
        const lock = readFileSync(path, 'utf8')
        const next = withResolution(from === to ? lock : withPin(lock, from, to), name, to, integrity, version)
        if (next !== lock) writeFileSync(path, next)
    }

    if (parseTag(tag).final) {
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
