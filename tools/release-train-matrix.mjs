/* global console, process */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { build } from 'esbuild'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const COMMIT = /^[a-f0-9]{40}$/
const REPOSITORIES = {
    'schema-pbta': 'RebelliousSmile/schema-pbta',
    'schema-adrenaline': 'RebelliousSmile/schema-adrenaline',
    'schema-in-the-mist': 'RebelliousSmile/schema-in-the-mist',
}
const JOURNEY_CHECKS = {
    'schema-pbta': ['vite-build', 'monsterhearts-four-assets', 'executable-chunks'],
    'schema-adrenaline': ['contract-journey', 'vite-journey', 'executable-chunks'],
    'schema-in-the-mist': ['mist-contracts', 'mist-vite-assets', 'executable-chunks'],
}

function exactKeys(value, keys, label) {
    assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
    assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} fields differ`)
}

export function manifestPattern(provider) {
    if (provider === 'schema-in-the-mist') return /^release-trains\/v\d+\.\d+\.\d+\.json$/
    return new RegExp(`^release-train/${provider}-v\\d+\\.\\d+\\.\\d+\\.json$`)
}

export function parseMatrix(raw) {
    exactKeys(raw, ['protocol', 'handbook', 'providers'], 'matrix')
    assert.equal(raw.protocol, 1, 'matrix protocol must be 1')
    exactKeys(raw.handbook, ['repository', 'ref'], 'matrix.handbook')
    assert.equal(raw.handbook.repository, 'RebelliousSmile/obsidian-handbook')
    assert.match(raw.handbook.ref, COMMIT)
    assert.ok(Array.isArray(raw.providers) && raw.providers.length === 3, 'matrix must name three providers')
    const names = new Set()
    const tuples = new Set()
    for (const item of raw.providers) {
        exactKeys(item, ['provider', 'repository', 'ref', 'manifests'], 'matrix provider')
        assert.equal(item.repository, REPOSITORIES[item.provider], `unknown or wrong provider: ${item.provider}`)
        assert.match(item.ref, COMMIT, `${item.provider} ref must be a full commit`)
        assert.ok(!names.has(item.provider), `duplicate provider: ${item.provider}`)
        names.add(item.provider)
        assert.ok(Array.isArray(item.manifests) && item.manifests.length > 0, `${item.provider} has no manifests`)
        for (const manifest of item.manifests) {
            exactKeys(manifest, ['path', 'validatorRef'], 'matrix manifest')
            assert.match(manifest.path, manifestPattern(item.provider), `${item.provider} manifest path is not canonical`)
            assert.match(manifest.validatorRef, COMMIT, `${item.provider} validator ref must be a full commit`)
            const tuple = `${item.repository}:${manifest.path}`
            assert.ok(!tuples.has(tuple), `duplicate manifest: ${tuple}`)
            tuples.add(tuple)
        }
    }
    assert.deepEqual([...names].sort(), Object.keys(REPOSITORIES).sort())
    return raw
}

export function discoverManifests(paths, provider) {
    return paths.filter((path) => manifestPattern(provider).test(path)).sort()
}

function run(command, args, cwd) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: 'utf8',
        shell: process.platform === 'win32' && command === 'npm',
        maxBuffer: 10 * 1024 * 1024,
    })
    if (result.status !== 0) {
        throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${result.stdout ?? ''}${result.stderr ?? ''}`)
    }
    return result.stdout.trim()
}

function validator(provider) {
    if (provider === 'schema-adrenaline') return { entry: 'tools/assert-release-train.ts', argument: true }
    if (provider === 'schema-pbta') return { entry: 'tools/validate-release-train.ts', argument: true }
    return { entry: 'tools/validate-release-train.ts', argument: false }
}

async function validateProviderManifest(provider, repositoryRoot, manifestPath, bundlePath) {
    const selected = validator(provider)
    const result = await build({
        entryPoints: [join(repositoryRoot, selected.entry)],
        bundle: true,
        platform: 'node',
        format: 'esm',
        write: false,
        logLevel: 'silent',
    })
    assert.equal(result.outputFiles.length, 1)
    writeFileSync(bundlePath, result.outputFiles[0].contents)
    run(process.execPath, [bundlePath, ...(selected.argument ? [manifestPath] : [])], repositoryRoot)
}

async function validateProvider(provider, workspace) {
    const repositoryRoot = join(workspace, provider.provider)
    run('git', ['clone', '--quiet', '--filter=blob:none', '--no-checkout', `https://github.com/${provider.repository}.git`, repositoryRoot], workspace)
    const paths = run('git', ['ls-tree', '-r', '--name-only', provider.ref], repositoryRoot).split(/\r?\n/)
    assert.deepEqual(
        provider.manifests.map(({ path }) => path).sort(),
        discoverManifests(paths, provider.provider),
        `${provider.provider} registry does not cover its pinned published manifests`
    )
    const validated = []
    for (const manifest of provider.manifests) {
        run('git', ['checkout', '--quiet', '--detach', manifest.validatorRef], repositoryRoot)
        assert.equal(run('git', ['rev-parse', 'HEAD'], repositoryRoot), manifest.validatorRef)
        const raw = JSON.parse(readFileSync(join(repositoryRoot, manifest.path), 'utf8'))
        assert.ok(JSON.stringify(raw).includes('RebelliousSmile/lantern'), `${manifest.path} does not name Lantern`)
        await validateProviderManifest(provider.provider, repositoryRoot, manifest.path, join(workspace, 'validator.mjs'))
        validated.push(manifest.path)
    }
    return validated
}

export function journeyCoverage(matrix) {
    return matrix.providers.flatMap(({ provider, ref, manifests }) =>
        manifests.map(({ path, validatorRef }) => ({
            provider,
            ref,
            manifest: path,
            validatorRef,
            checks: JOURNEY_CHECKS[provider],
        }))
    )
}

async function main() {
    const matrix = parseMatrix(JSON.parse(readFileSync(join(root, 'release-train.matrix.json'), 'utf8')))
    const workspace = mkdtempSync(join(tmpdir(), 'lantern-release-matrix-'))
    try {
        for (const provider of matrix.providers) await validateProvider(provider, workspace)
    } finally {
        rmSync(workspace, { recursive: true, force: true })
    }
    run('npm', ['run', 'build'], root)
    run('npm', ['run', 'assert:contracts'], root)
    run(process.execPath, ['tools/assert-template-chunks.mjs'], root)
    const coverage = journeyCoverage(matrix)
    console.log(JSON.stringify({ status: 'passed', manifests: coverage.length, providers: matrix.providers.length, coverage }, null, 2))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await main()
}
