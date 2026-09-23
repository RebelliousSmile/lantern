/* global Buffer, console, fetch, process */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { selectLanternConsumer } from './release-train-protocol.mjs'

const root = process.cwd()
const checks = []

function check(id, assertion, message) {
    if (!assertion) throw new Error(`${id}: ${message}`)
    checks.push(id)
}

function run(command, args, id) {
    const result = spawnSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        shell: process.platform === 'win32',
    })
    check(id, result.status === 0, result.stderr || result.stdout || `${command} failed`)
}

export function frozenInstallCommand(store) {
    return {
        command: 'npx',
        args: ['--yes', 'pnpm@10', 'install', '--frozen-lockfile', '--ignore-scripts', '--store-dir', store],
    }
}

function packageResolution(candidate) {
    const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
    check('package-declaration', packageJson.dependencies?.['schema-pbta'] === candidate.releaseUrl, 'package.json does not declare the candidate URL')

    const lock = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8')
    const escapedUrl = candidate.releaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const escapedIntegrity = candidate.integrity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    check('lock-importer', new RegExp(`schema-pbta:\\r?\\n\\s+specifier: ${escapedUrl}\\r?\\n\\s+version: ${escapedUrl}`).test(lock), 'pnpm importer does not declare the candidate URL')
    check('lock-resolution', new RegExp(`schema-pbta@${escapedUrl}:\\r?\\n\\s+resolution: \\{tarball: ${escapedUrl}, integrity: ${escapedIntegrity}\\}\\r?\\n\\s+version: ${candidate.version.replaceAll('.', '\\.')}`).test(lock), 'pnpm resolution does not declare the candidate URL, version and SRI')
    return { file: 'pnpm-lock.yaml', releaseUrl: candidate.releaseUrl, integrity: candidate.integrity }
}

async function archive(candidate) {
    const response = await fetch(candidate.releaseUrl)
    check('archive-download', response.ok, `candidate download failed with ${response.status}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    check('archive-sha256', createHash('sha256').update(bytes).digest('hex') === candidate.sha256, 'candidate SHA-256 differs')
    check('archive-integrity', `sha512-${createHash('sha512').update(bytes).digest('base64')}` === candidate.integrity, 'candidate SHA-512 SRI differs')
}

function assertRepositoryUnchanged(before) {
    const after = spawnSync('git', ['diff', '--quiet'], { cwd: root, shell: process.platform === 'win32' })
    check('repository-clean', before === 0 && after.status === 0, 'proof changed a tracked Lantern file')
}

export function createEvidence({ candidate, consumer, installed, lock, journeyChecks }) {
    return {
        protocol: 1,
        status: 'passed',
        candidate,
        consumer: {
            role: consumer.role,
            repository: consumer.repository,
            ref: consumer.ref,
            resolved: {
                version: installed.version,
                releaseUrl: candidate.releaseUrl,
                integrity: candidate.integrity,
            },
        },
        lock,
        journey: { id: 'vite-frozen-install', status: 'passed', checks: journeyChecks },
    }
}

async function main() {
    const arguments_ = process.argv.slice(2).filter((value) => value !== '--')
    if (arguments_.length !== 1) throw new Error('release-train assertion requires exactly one manifest path')
    const manifestPath = resolve(arguments_[0])
    const evidencePath = `${manifestPath}.evidence.json`
    const { candidate, consumer } = selectLanternConsumer(JSON.parse(readFileSync(manifestPath, 'utf8')), root)
    const before = spawnSync('git', ['diff', '--quiet'], { cwd: root, shell: process.platform === 'win32' }).status
    const lock = packageResolution(candidate)
    await archive(candidate)

    const store = mkdtempSync(resolve(tmpdir(), 'lantern-release-train-store-'))
    try {
        const install = frozenInstallCommand(store)
        run(install.command, install.args, 'frozen-install')
    } finally {
        rmSync(store, { recursive: true, force: true })
    }

    const installed = JSON.parse(readFileSync(resolve(root, 'node_modules/schema-pbta/package.json'), 'utf8'))
    check('installed-version', installed.version === candidate.version, `installed ${installed.version}, expected ${candidate.version}`)
    run('npm', ['run', 'assert:template-chunks'], 'vite-journey')
    assertRepositoryUnchanged(before)

    const evidence = createEvidence({ candidate, consumer, installed, lock, journeyChecks: checks })
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
    console.log(JSON.stringify(evidence))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error.message)
        process.exitCode = 1
    })
}
