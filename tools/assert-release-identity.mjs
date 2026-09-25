/* global console, process */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const COMMIT = /^[a-f0-9]{40}$/
const SHA256 = /^[a-f0-9]{64}$/

function exactKeys(value, keys, label) {
    assert.ok(
        value && typeof value === 'object' && !Array.isArray(value),
        `${label} must be an object`
    )
    assert.deepEqual(
        Object.keys(value).sort(),
        [...keys].sort(),
        `${label} has unexpected or missing fields`
    )
}

function sha256(file) {
    return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function topChangelogVersion(changelog) {
    return changelog.match(/^## \[v(\d+\.\d+\.\d+)\]/m)?.[1]
}

export function distFiles(directory) {
    const walk = (current) =>
        readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
            const absolute = path.join(current, entry.name)
            return entry.isDirectory() ? walk(absolute) : [absolute]
        })
    return walk(directory)
        .sort((left, right) => left.localeCompare(right, 'en'))
        .map((absolute) => ({
            path: path.relative(directory, absolute).split(path.sep).join('/'),
            sha256: sha256(absolute),
            size: statSync(absolute).size,
        }))
}

export function validateMetadata({ packageJson, packageLock, changelog }) {
    const version = packageJson.version
    assert.match(
        version,
        /^\d+\.\d+\.\d+$/,
        'package version must be stable SemVer'
    )
    assert.equal(
        packageLock.version,
        version,
        'package-lock version must match package version'
    )
    assert.equal(
        packageLock.packages?.['']?.version,
        version,
        'package-lock root version must match package version'
    )
    assert.equal(
        topChangelogVersion(changelog),
        version,
        'top changelog release must match package version'
    )
    return version
}

export function validateTagIdentity({ version, tag, commit, tagCommit }) {
    assert.equal(tag, `v${version}`, 'tag must match package version')
    assert.match(commit, COMMIT, 'commit must be a full SHA')
    assert.equal(tagCommit, commit, 'tag commit must match the release commit')
}

export function assertStableSchemaDependencies(dependencies) {
    for (const [name, value] of Object.entries(dependencies)) {
        if (!name.startsWith('schema-')) continue
        assert.doesNotMatch(
            value,
            /\/v[^/]+-rc\.\d+\//,
            `${name} must not use a candidate release URL`
        )
    }
}

export function createReleaseEvidence({
    version,
    tag,
    commit,
    bundleName,
    bundlePath,
    directory,
}) {
    const evidence = {
        protocol: 1,
        version,
        tag,
        commit,
        bundle: {
            name: bundleName,
            sha256: sha256(bundlePath),
        },
        files: distFiles(directory),
    }
    validateReleaseEvidence(evidence, {
        version,
        tag,
        commit,
        bundleName,
        bundlePath,
        directory,
    })
    return evidence
}

export function validateReleaseEvidence(evidence, expected) {
    exactKeys(
        evidence,
        ['protocol', 'version', 'tag', 'commit', 'bundle', 'files'],
        'release evidence'
    )
    exactKeys(evidence.bundle, ['name', 'sha256'], 'release evidence bundle')
    assert.equal(evidence.protocol, 1, 'release evidence protocol must be 1')
    assert.equal(
        evidence.version,
        expected.version,
        'evidence version must match'
    )
    assert.equal(evidence.tag, expected.tag, 'evidence tag must match')
    assert.equal(evidence.commit, expected.commit, 'evidence commit must match')
    assert.match(evidence.commit, COMMIT, 'evidence commit must be a full SHA')
    assert.equal(
        evidence.bundle.name,
        expected.bundleName,
        'evidence bundle name must match'
    )
    assert.match(
        evidence.bundle.sha256,
        SHA256,
        'evidence bundle digest must be SHA-256'
    )
    if (expected.bundlePath) {
        assert.equal(
            evidence.bundle.sha256,
            sha256(expected.bundlePath),
            'evidence bundle digest must match the archive'
        )
    }
    assert.ok(
        Array.isArray(evidence.files) && evidence.files.length > 0,
        'release evidence must list production files'
    )
    for (const [index, file] of evidence.files.entries()) {
        exactKeys(
            file,
            ['path', 'sha256', 'size'],
            `release evidence files[${index}]`
        )
        assert.ok(
            file.path &&
                !file.path.startsWith('/') &&
                !file.path.includes('..'),
            `release evidence files[${index}].path must be relative`
        )
        assert.match(
            file.sha256,
            SHA256,
            `release evidence files[${index}].sha256 must be SHA-256`
        )
        assert.ok(
            Number.isInteger(file.size) && file.size > 0,
            `release evidence files[${index}].size must be positive`
        )
    }
    const paths = evidence.files.map((file) => file.path)
    assert.deepEqual(
        paths,
        [...paths].sort((left, right) => left.localeCompare(right, 'en')),
        'release evidence files must be sorted'
    )
    assert.equal(
        new Set(paths).size,
        paths.length,
        'release evidence file paths must be unique'
    )
    if (expected.directory) {
        assert.deepEqual(
            evidence.files,
            distFiles(expected.directory),
            'release evidence files must match dist'
        )
    }
    return evidence
}

export function validateRelease(
    release,
    { tag, commit, bundleName, evidenceName }
) {
    exactKeys(
        release,
        ['tagName', 'targetCommitish', 'isDraft', 'isPrerelease', 'assets'],
        'GitHub Release'
    )
    assert.equal(release.tagName, tag, 'GitHub Release tag must match')
    assert.equal(
        release.targetCommitish,
        commit,
        'GitHub Release target must match the tagged commit'
    )
    assert.equal(release.isDraft, false, 'GitHub Release must not be a draft')
    assert.equal(
        release.isPrerelease,
        false,
        'GitHub Release must not be a prerelease'
    )
    assert.deepEqual(
        [...release.assets].sort(),
        [bundleName, evidenceName].sort(),
        'GitHub Release must contain exactly the bundle and evidence'
    )
}

function metadata() {
    return {
        packageJson: JSON.parse(
            readFileSync(path.join(root, 'package.json'), 'utf8')
        ),
        packageLock: JSON.parse(
            readFileSync(path.join(root, 'package-lock.json'), 'utf8')
        ),
        changelog: readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'),
    }
}

function option(name) {
    const index = process.argv.indexOf(name)
    return index === -1 ? undefined : process.argv[index + 1]
}

function main() {
    const source = metadata()
    const version = validateMetadata(source)
    const tag = option('--tag')
    if (!tag) {
        console.log(`Release metadata verified for v${version}.`)
        return
    }

    const commit = option('--commit')
    const tagCommit = option('--tag-commit') ?? commit
    validateTagIdentity({ version, tag, commit, tagCommit })
    assertStableSchemaDependencies(source.packageJson.dependencies)

    const bundlePath = path.resolve(option('--bundle'))
    const bundleName = path.basename(bundlePath)
    const evidencePath = option('--evidence')
        ? path.resolve(option('--evidence'))
        : undefined
    const directory = path.resolve(option('--dist') ?? 'dist')
    if (process.argv.includes('--write-evidence')) {
        const evidence = createReleaseEvidence({
            version,
            tag,
            commit,
            bundleName,
            bundlePath,
            directory,
        })
        assert.ok(evidencePath, '--evidence is required with --write-evidence')
        writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
    } else {
        assert.ok(
            evidencePath,
            '--evidence is required for release verification'
        )
        validateReleaseEvidence(
            JSON.parse(readFileSync(evidencePath, 'utf8')),
            {
                version,
                tag,
                commit,
                bundleName,
                bundlePath,
                directory,
            }
        )
    }

    const releasePath = option('--release')
    if (releasePath) {
        validateRelease(
            JSON.parse(readFileSync(path.resolve(releasePath), 'utf8')),
            {
                tag,
                commit,
                bundleName,
                evidenceName: path.basename(evidencePath),
            }
        )
    }
    console.log(`Release identity verified for ${tag} at ${commit}.`)
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main()
}
