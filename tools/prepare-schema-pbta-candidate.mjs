/* global console, process */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SCHEMA_PACKAGES = [
    'schema-pbta',
    'schema-in-the-mist',
    'schema-adrenaline',
]

function fail(message) {
    throw new Error(message)
}

function readCandidates() {
    const values = process.argv.slice(2)
    if (values.length !== SCHEMA_PACKAGES.length * 2) {
        fail(
            'usage: prepare-schema-pbta-candidate <pbta-url> <pbta-sri> <mist-url> <mist-sri> <adrenaline-url> <adrenaline-sri>'
        )
    }

    return Object.fromEntries(
        SCHEMA_PACKAGES.map((name, index) => {
            const url = values[index * 2]
            const integrity = values[index * 2 + 1]
            if (
                !url.startsWith(
                    `https://github.com/RebelliousSmile/${name}/releases/download/`
                ) ||
                !url.endsWith('.tgz') ||
                !integrity.startsWith('sha512-')
            ) {
                fail(`invalid stable release URL or SRI for ${name}`)
            }
            const version = url.match(/-(\d+\.\d+\.\d+)\.tgz$/)?.[1]
            if (!version) fail(`candidate URL must name a SemVer archive for ${name}`)
            return [name, { url, integrity, version }]
        })
    )
}

function replaceDirectEntry(lock, name, candidate) {
    const escaped = name.replace('-', '\\-')
    const importer = new RegExp(
        `(      ${escaped}:\\r?\\n        specifier: )[^\\r\\n]+(\\r?\\n        version: )[^\\r\\n]+`
    )
    if (!importer.test(lock)) fail(`pnpm lock misses ${name} importer`)
    let normalized = lock.replace(importer, `$1${candidate.url}$2${candidate.url}`)

    const packageEntry = new RegExp(
        `(  ${escaped}@)[^\\r\\n]+:(\\r?\\n    resolution: \\{tarball: )[^,}\\r\\n]+(?:, integrity: [^}\\r\\n]+)?(\\}\\r?\\n    version: )[^\\r\\n]+`
    )
    if (!packageEntry.test(normalized)) {
        fail(`pnpm lock misses ${name} package entry`)
    }
    normalized = normalized.replace(
        packageEntry,
        `$1${candidate.url}:$2${candidate.url}, integrity: ${candidate.integrity}$3${candidate.version}`
    )

    const snapshots = new RegExp(`(  ${escaped}@)[^\\r\\n]+:(?=\\r?\\n)`, 'g')
    if (!snapshots.test(normalized)) fail(`pnpm lock misses ${name} snapshot entry`)
    return normalized.replace(snapshots, `$1${candidate.url}:`)
}

function normalize(lock, candidates) {
    return SCHEMA_PACKAGES.reduce(
        (current, name) => replaceDirectEntry(current, name, candidates[name]),
        lock.replace(/\r\n/g, '\n')
    )
}

function runPnpm(args) {
    const result = spawnSync('pnpm', args, {
        encoding: 'utf8',
        shell: process.platform === 'win32',
    })
    if (result.status !== 0) {
        fail(`pnpm ${args.join(' ')} failed: ${result.stderr || result.stdout}`)
    }
}

const candidates = readCandidates()
const packageBefore = readFileSync('package.json', 'utf8')
const parsedPackage = JSON.parse(packageBefore)
for (const name of SCHEMA_PACKAGES) {
    if (parsedPackage.dependencies?.[name] !== candidates[name].url) {
        fail(`package.json must already pin ${name} to its supplied candidate URL`)
    }
}

const lockBefore = readFileSync('pnpm-lock.yaml', 'utf8')
const expectedUnrelatedGraph = normalize(lockBefore, candidates)
const store = mkdtempSync(join(tmpdir(), 'lantern-schema-candidate-store-'))
try {
    runPnpm(['install', '--lockfile-only', '--ignore-scripts', '--store-dir', store])
    if (readFileSync('package.json', 'utf8') !== packageBefore) {
        fail('pnpm changed package.json while generating the candidate lock')
    }
    const normalized = normalize(readFileSync('pnpm-lock.yaml', 'utf8'), candidates)
    if (normalized !== expectedUnrelatedGraph) {
        const line = normalized
            .slice(
                0,
                [...normalized].findIndex(
                    (_, index) => normalized[index] !== expectedUnrelatedGraph[index]
                )
            )
            .split(/\r?\n/).length
        fail(
            `pnpm changed a version or transitive dependency outside the three direct schema archives near line ${line}`
        )
    }
    writeFileSync('pnpm-lock.yaml', normalized)
    runPnpm(['install', '--frozen-lockfile', '--ignore-scripts', '--store-dir', store])
} catch (error) {
    writeFileSync('pnpm-lock.yaml', lockBefore)
    throw error
} finally {
    rmSync(store, { recursive: true, force: true })
}

console.log(JSON.stringify({ status: 'ready', candidates }))
