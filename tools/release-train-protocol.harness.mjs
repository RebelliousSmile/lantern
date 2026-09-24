/* global console */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createEvidence, frozenInstallCommand } from './release-train-assert.mjs'
import { parseProtocolOne, selectLanternConsumer } from './release-train-protocol.mjs'

const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim()
const pbtaCandidate = {
    provider: 'schema-pbta',
    releaseUrl: 'https://github.com/RebelliousSmile/schema-pbta/releases/download/v9.9.9-rc.1/schema-pbta-9.9.9.tgz',
    sha256: 'a'.repeat(64),
    integrity: 'sha512-Z9W4bGAvrvNslsikxeTQqgTJehQ/LMrNMBOzs95TVJhxiPzpO0VeVEF53OJgWxb+85Iwc9skl3V0ugWNA08Kcw==',
    version: '9.9.9',
    stagingTag: 'v9.9.9-rc.1',
    finalTag: 'v9.9.9',
    providerCommit: 'b'.repeat(40),
}
const adrenalineCandidate = {
    ...pbtaCandidate,
    provider: 'schema-adrenaline',
    releaseUrl: 'https://github.com/RebelliousSmile/schema-adrenaline/releases/download/v9.9.9-rc.1/schema-adrenaline-9.9.9.tgz',
}
const manifest = {
    protocol: 1,
    candidate: pbtaCandidate,
    consumers: [
        {
            role: 'lantern',
            repository: 'RebelliousSmile/lantern',
            ref: head,
        },
        {
            role: 'handbook',
            repository: 'RebelliousSmile/obsidian-handbook',
            ref: 'c'.repeat(40),
        },
    ],
}

assert.deepEqual(parseProtocolOne(manifest), manifest)
assert.deepEqual(selectLanternConsumer(manifest), { candidate: pbtaCandidate, consumer: manifest.consumers[0] })
assert.deepEqual(parseProtocolOne({ ...manifest, candidate: adrenalineCandidate }), { ...manifest, candidate: adrenalineCandidate })
assert.deepEqual(selectLanternConsumer({ ...manifest, candidate: adrenalineCandidate }), { candidate: adrenalineCandidate, consumer: manifest.consumers[0] })
assert.deepEqual(frozenInstallCommand('isolated-store'), {
    command: 'npx',
    args: ['--yes', 'pnpm@10', 'install', '--frozen-lockfile', '--ignore-scripts', '--store-dir', 'isolated-store'],
})
assert.throws(() => parseProtocolOne({ ...manifest, protocol: 2 }), /protocol must be 1/)
assert.throws(() => parseProtocolOne({ ...manifest, consumers: [manifest.consumers[0]] }), /Lantern and Handbook exactly once/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, provider: 'schema-unknown' } }), /schema-adrenaline or schema-pbta/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, releaseUrl: adrenalineCandidate.releaseUrl } }), /provider staged candidate archive/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...adrenalineCandidate, releaseUrl: pbtaCandidate.releaseUrl } }), /provider staged candidate archive/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, releaseUrl: `${pbtaCandidate.releaseUrl}?token=mutable` } }), /signed query/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, releaseUrl: `${pbtaCandidate.releaseUrl}#fragment` } }), /fragment/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, releaseUrl: pbtaCandidate.releaseUrl.replace('schema-pbta-9.9.9.tgz', 'candidate.tgz') } }), /provider staged candidate archive/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, version: '9.9' } }), /SemVer/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, stagingTag: 'v9.9.9' } }), /must stage/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, finalTag: 'v9.9.8' } }), /must match/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, sha256: 'invalid' } }), /SHA-256/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, integrity: 'sha256-invalid' } }), /SHA-512 SRI/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...pbtaCandidate, providerCommit: 'main' } }), /full commit SHA/)
assert.throws(() => parseProtocolOne({ ...manifest, consumers: [{ ...manifest.consumers[0], path: 'lantern' }, manifest.consumers[1]] }), /unexpected or missing fields/)
assert.throws(() => parseProtocolOne({ ...manifest, consumers: [{ ...manifest.consumers[0], proof: { interface: 'npm-run-release-train-assert', manifest: 'release-train.manifest.json' } }, manifest.consumers[1]] }), /unexpected or missing fields/)
assert.throws(() => selectLanternConsumer({ ...manifest, consumers: [{ ...manifest.consumers[0], ref: 'd'.repeat(40) }, manifest.consumers[1]] }), /does not match checked-out HEAD/)

assert.deepEqual(
    createEvidence({
        candidate: pbtaCandidate,
        consumer: manifest.consumers[0],
        installed: { version: pbtaCandidate.version },
        lock: { file: 'pnpm-lock.yaml', releaseUrl: pbtaCandidate.releaseUrl, integrity: pbtaCandidate.integrity },
        journeyChecks: ['package-declaration', 'vite-journey'],
    }),
    {
        protocol: 1,
        status: 'passed',
        candidate: pbtaCandidate,
        consumer: {
            role: 'lantern',
            repository: 'RebelliousSmile/lantern',
            ref: head,
            resolved: { version: pbtaCandidate.version, releaseUrl: pbtaCandidate.releaseUrl, integrity: pbtaCandidate.integrity },
        },
        lock: { file: 'pnpm-lock.yaml', releaseUrl: pbtaCandidate.releaseUrl, integrity: pbtaCandidate.integrity },
        journey: { id: 'vite-frozen-install', status: 'passed', checks: ['package-declaration', 'vite-journey'] },
    }
)

console.log('Release-train protocol-1 parser verified.')
