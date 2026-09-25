/* global console */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
    assertStableSchemaDependencies,
    createReleaseEvidence,
    validateMetadata,
    validateRelease,
    validateReleaseEvidence,
    validateTagIdentity,
} from './assert-release-identity.mjs'

const version = '0.16.1'
const tag = `v${version}`
const commit = 'a'.repeat(40)
const packageJson = {
    version,
    dependencies: {
        'schema-pbta':
            'https://github.com/RebelliousSmile/schema-pbta/releases/download/v8.4.3/schema-pbta-8.4.3.tgz',
    },
}
const packageLock = { version, packages: { '': { version } } }
const changelog = `# Changelog\n\n## [${tag}] - 2026-09-25\n`

assert.equal(validateMetadata({ packageJson, packageLock, changelog }), version)
assert.throws(
    () =>
        validateMetadata({
            packageJson: { ...packageJson, version: '0.16.0' },
            packageLock,
            changelog,
        }),
    /package-lock version/
)
assert.throws(
    () =>
        validateMetadata({
            packageJson,
            packageLock: { ...packageLock, version: '0.16.0' },
            changelog,
        }),
    /package-lock version/
)
assert.throws(
    () =>
        validateMetadata({
            packageJson,
            packageLock: {
                ...packageLock,
                packages: { '': { version: '0.16.0' } },
            },
            changelog,
        }),
    /root version/
)
assert.throws(
    () =>
        validateMetadata({
            packageJson,
            packageLock,
            changelog: changelog.replace(tag, 'v0.16.0'),
        }),
    /top changelog/
)
validateTagIdentity({ version, tag, commit, tagCommit: commit })
assert.throws(
    () =>
        validateTagIdentity({
            version,
            tag: 'v0.16.0',
            commit,
            tagCommit: commit,
        }),
    /tag must match/
)
assert.throws(
    () =>
        validateTagIdentity({
            version,
            tag,
            commit,
            tagCommit: 'b'.repeat(40),
        }),
    /tag commit/
)
assert.throws(
    () =>
        validateTagIdentity({
            version,
            tag,
            commit: 'main',
            tagCommit: 'main',
        }),
    /full SHA/
)
assertStableSchemaDependencies(packageJson.dependencies)
assert.throws(
    () =>
        assertStableSchemaDependencies({
            'schema-pbta':
                'https://github.com/RebelliousSmile/schema-pbta/releases/download/v8.4.3-rc.1/schema-pbta-8.4.3.tgz',
        }),
    /candidate release URL/
)

const workspace = mkdtempSync(path.join(tmpdir(), 'lantern-release-identity-'))
try {
    const dist = path.join(workspace, 'dist')
    mkdirSync(path.join(dist, 'assets'), { recursive: true })
    writeFileSync(path.join(dist, 'index.html'), '<main>Lantern</main>\n')
    writeFileSync(path.join(dist, 'assets/app.js'), 'console.log("Lantern")\n')
    const bundlePath = path.join(workspace, `${tag}.tar.gz`)
    writeFileSync(bundlePath, 'deterministic bundle fixture')
    const bundleName = path.basename(bundlePath)
    const evidence = createReleaseEvidence({
        version,
        tag,
        commit,
        bundleName,
        bundlePath,
        directory: dist,
    })

    assert.deepEqual(
        evidence.files.map((file) => file.path),
        ['assets/app.js', 'index.html']
    )
    assert.equal(
        evidence.bundle.sha256,
        createHash('sha256')
            .update('deterministic bundle fixture')
            .digest('hex')
    )
    validateReleaseEvidence(evidence, {
        version,
        tag,
        commit,
        bundleName,
        bundlePath,
        directory: dist,
    })
    assert.throws(
        () =>
            validateReleaseEvidence(
                { ...evidence, version: '0.16.0' },
                {
                    version,
                    tag,
                    commit,
                    bundleName,
                    bundlePath,
                    directory: dist,
                }
            ),
        /evidence version/
    )
    assert.throws(
        () =>
            validateReleaseEvidence(
                { ...evidence, tag: 'v0.16.0' },
                {
                    version,
                    tag,
                    commit,
                    bundleName,
                    bundlePath,
                    directory: dist,
                }
            ),
        /evidence tag/
    )
    assert.throws(
        () =>
            validateReleaseEvidence(
                { ...evidence, commit: 'b'.repeat(40) },
                {
                    version,
                    tag,
                    commit,
                    bundleName,
                    bundlePath,
                    directory: dist,
                }
            ),
        /evidence commit/
    )
    assert.throws(
        () =>
            validateReleaseEvidence(
                {
                    ...evidence,
                    bundle: { ...evidence.bundle, sha256: 'b'.repeat(64) },
                },
                {
                    version,
                    tag,
                    commit,
                    bundleName,
                    bundlePath,
                    directory: dist,
                }
            ),
        /bundle digest/
    )
    assert.throws(
        () =>
            validateReleaseEvidence(
                { ...evidence, extra: true },
                { version, tag, commit, bundleName }
            ),
        /unexpected or missing fields/
    )

    const release = {
        tagName: tag,
        targetCommitish: commit,
        isDraft: false,
        isPrerelease: false,
        assets: [bundleName, `${tag}.evidence.json`],
    }
    validateRelease(release, {
        tag,
        commit,
        bundleName,
        evidenceName: `${tag}.evidence.json`,
    })
    assert.throws(
        () =>
            validateRelease(
                { ...release, tagName: 'v0.16.0' },
                {
                    tag,
                    commit,
                    bundleName,
                    evidenceName: `${tag}.evidence.json`,
                }
            ),
        /Release tag/
    )
    assert.throws(
        () =>
            validateRelease(
                { ...release, targetCommitish: 'b'.repeat(40) },
                {
                    tag,
                    commit,
                    bundleName,
                    evidenceName: `${tag}.evidence.json`,
                }
            ),
        /Release target/
    )
    assert.throws(
        () =>
            validateRelease(
                { ...release, assets: [bundleName] },
                {
                    tag,
                    commit,
                    bundleName,
                    evidenceName: `${tag}.evidence.json`,
                }
            ),
        /exactly the bundle and evidence/
    )
} finally {
    rmSync(workspace, { recursive: true, force: true })
}

console.log('Release identity fixtures verified.')
