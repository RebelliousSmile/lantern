/* global Buffer, console, fetch, process */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { selectLanternConsumer } from './release-train-protocol.mjs'

const root = process.cwd()
const checks = []
const JOURNEYS = {
    'schema-adrenaline': {
        id: 'adrenaline-contract-vite-build',
        commands: [
            {
                command: 'npm',
                args: ['run', 'assert:contracts'],
                check: 'contract-journey',
            },
            { command: 'npm', args: ['run', 'build'], check: 'vite-journey' },
        ],
    },
    'schema-pbta': {
        id: 'vite-frozen-install',
        commands: [
            { command: 'npm', args: ['run', 'build'], check: 'vite-build' },
            {
                command: 'node',
                args: ['tools/assert-template-chunks.mjs'],
                check: 'monsterhearts-four-assets',
            },
        ],
    },
}

function check(id, assertion, message) {
    if (!assertion) throw new Error(`${id}: ${message}`)
    checks.push(id)
}

function run(command, args, id, environment = {}) {
    const result = spawnSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, ...environment },
        shell: process.platform === 'win32',
    })
    check(
        id,
        result.status === 0,
        result.stderr || result.stdout || `${command} failed`
    )
}

export function frozenInstallCommand(store) {
    return {
        command: 'npx',
        args: [
            '--yes',
            'pnpm@10',
            'install',
            '--frozen-lockfile',
            '--ignore-scripts',
            '--store-dir',
            store,
        ],
        environment: { CI: 'true' },
    }
}

export function providerJourney(provider) {
    const journey = JOURNEYS[provider]
    check(
        'provider-assertion',
        journey,
        `release-train assertion does not support ${provider}`
    )
    return journey
}

export function packageResolution(candidate, sources) {
    const packageJson =
        sources?.packageJson ??
        JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
    const pnpmLock =
        sources?.pnpmLock ??
        readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8')
    const packageLock =
        sources?.packageLock ??
        JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
    const packageName = candidate.provider
    check(
        'package-declaration',
        packageJson.dependencies?.[packageName] === candidate.releaseUrl,
        `package.json does not declare the ${packageName} candidate URL`
    )

    const escapedUrl = candidate.releaseUrl.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    )
    check(
        'lock-importer',
        new RegExp(
            `${packageName}:\\r?\\n\\s+specifier: ${escapedUrl}\\r?\\n\\s+version: ${escapedUrl}`
        ).test(pnpmLock),
        'pnpm importer does not declare the candidate URL'
    )
    const pnpmResolution = pnpmLock.match(
        new RegExp(
            `${packageName}@${escapedUrl}:\\r?\\n\\s+resolution: \\{([^}\\r\\n]+)\\}\\r?\\n\\s+version: ${candidate.version.replaceAll('.', '\\.')}`
        )
    )
    check(
        'lock-resolution',
        Boolean(pnpmResolution) &&
            pnpmResolution[1].includes(`tarball: ${candidate.releaseUrl}`) &&
            pnpmResolution[1].includes(`integrity: ${candidate.integrity}`),
        'pnpm resolution does not declare the candidate URL, version and SRI'
    )

    check(
        'npm-lock-declaration',
        packageLock.packages?.['']?.dependencies?.[packageName] ===
            candidate.releaseUrl,
        'package-lock root does not declare the candidate URL'
    )
    const npmResolution = packageLock.packages?.[`node_modules/${packageName}`]
    check(
        'npm-lock-resolution',
        npmResolution?.resolved === candidate.releaseUrl &&
            npmResolution?.version === candidate.version &&
            npmResolution?.integrity === candidate.integrity,
        'package-lock resolution does not declare the candidate URL, version and SRI'
    )
    return {
        file: 'pnpm-lock.yaml',
        releaseUrl: candidate.releaseUrl,
        integrity: candidate.integrity,
    }
}

async function archive(candidate) {
    const response = await fetch(candidate.releaseUrl)
    check(
        'archive-download',
        response.ok,
        `candidate download failed with ${response.status}`
    )
    const bytes = Buffer.from(await response.arrayBuffer())
    check(
        'archive-sha256',
        createHash('sha256').update(bytes).digest('hex') === candidate.sha256,
        'candidate SHA-256 differs'
    )
    check(
        'archive-integrity',
        `sha512-${createHash('sha512').update(bytes).digest('base64')}` ===
            candidate.integrity,
        'candidate SHA-512 SRI differs'
    )
}

function assertRepositoryUnchanged(before) {
    const after = spawnSync('git', ['diff', '--quiet'], {
        cwd: root,
        shell: process.platform === 'win32',
    })
    check(
        'repository-clean',
        before === 0 && after.status === 0,
        'proof changed a tracked Lantern file'
    )
}

export function createEvidence({
    candidate,
    consumer,
    installed,
    lock,
    journeyId,
    journeyChecks,
}) {
    const evidence = {
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
        journey: { id: journeyId, status: 'passed', checks: journeyChecks },
    }
    assertEvidenceShape(evidence)
    return evidence
}

function exactKeys(value, keys, label) {
    if (
        !(
            value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            Object.keys(value).sort().join() === [...keys].sort().join()
        )
    ) {
        throw new Error(`${label} has unexpected or missing fields`)
    }
}

export function assertEvidenceShape(evidence) {
    exactKeys(
        evidence,
        ['protocol', 'status', 'candidate', 'consumer', 'lock', 'journey'],
        'evidence'
    )
    exactKeys(
        evidence.candidate,
        [
            'provider',
            'releaseUrl',
            'sha256',
            'integrity',
            'version',
            'stagingTag',
            'finalTag',
            'providerCommit',
        ],
        'evidence.candidate'
    )
    exactKeys(
        evidence.consumer,
        ['role', 'repository', 'ref', 'resolved'],
        'evidence.consumer'
    )
    exactKeys(
        evidence.consumer.resolved,
        ['version', 'releaseUrl', 'integrity'],
        'evidence.consumer.resolved'
    )
    exactKeys(
        evidence.lock,
        ['file', 'releaseUrl', 'integrity'],
        'evidence.lock'
    )
    exactKeys(evidence.journey, ['id', 'status', 'checks'], 'evidence.journey')
    assert.match(
        evidence.consumer.ref,
        /^[a-f0-9]{40}$/,
        'evidence.consumer.ref must be a full commit SHA'
    )
    if (evidence.candidate.provider === 'schema-pbta') {
        assert.ok(
            evidence.journey.checks.includes('vite-build') &&
                evidence.journey.checks.includes('monsterhearts-four-assets'),
            'PbtA evidence must include vite-build and monsterhearts-four-assets'
        )
    }
    return evidence
}

async function main() {
    const arguments_ = process.argv.slice(2).filter((value) => value !== '--')
    if (arguments_.length !== 1)
        throw new Error(
            'release-train assertion requires exactly one manifest path'
        )
    const manifestPath = resolve(arguments_[0])
    const evidencePath = `${manifestPath}.evidence.json`
    const { candidate, consumer } = selectLanternConsumer(
        JSON.parse(readFileSync(manifestPath, 'utf8')),
        root
    )
    const journey = providerJourney(candidate.provider)
    const before = spawnSync('git', ['diff', '--quiet'], {
        cwd: root,
        shell: process.platform === 'win32',
    }).status
    const lock = packageResolution(candidate)
    await archive(candidate)

    const store = mkdtempSync(resolve(tmpdir(), 'lantern-release-train-store-'))
    try {
        const install = frozenInstallCommand(store)
        run(
            install.command,
            install.args,
            'frozen-install',
            install.environment
        )
    } finally {
        rmSync(store, { recursive: true, force: true })
    }

    const installed = JSON.parse(
        readFileSync(
            resolve(root, `node_modules/${candidate.provider}/package.json`),
            'utf8'
        )
    )
    check(
        'installed-version',
        installed.version === candidate.version,
        `installed ${installed.version}, expected ${candidate.version}`
    )
    for (const command of journey.commands)
        run(command.command, command.args, command.check)
    assertRepositoryUnchanged(before)

    const evidence = createEvidence({
        candidate,
        consumer,
        installed,
        lock,
        journeyId: journey.id,
        journeyChecks: checks,
    })
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
    console.log(JSON.stringify(evidence))
}

if (
    process.argv[1] &&
    resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main().catch((error) => {
        console.error(error.message)
        process.exitCode = 1
    })
}
