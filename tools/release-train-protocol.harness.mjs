/* global console */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { parseProtocolOne, selectLanternConsumer } from './release-train-protocol.mjs'

const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim()
const candidate = {
    provider: 'schema-pbta',
    releaseUrl: 'https://github.com/RebelliousSmile/schema-pbta/releases/download/v9.9.9-rc.1/schema-pbta-9.9.9.tgz',
    sha256: 'a'.repeat(64),
    integrity: 'sha512-Z9W4bGAvrvNslsikxeTQqgTJehQ/LMrNMBOzs95TVJhxiPzpO0VeVEF53OJgWxb+85Iwc9skl3V0ugWNA08Kcw==',
    version: '9.9.9',
    stagingTag: 'v9.9.9-rc.1',
    finalTag: 'v9.9.9',
    providerCommit: 'b'.repeat(40),
}
const manifest = {
    protocol: 1,
    candidate,
    consumers: [
        {
            role: 'lantern',
            repository: 'RebelliousSmile/lantern',
            ref: head,
            path: 'lantern',
            proof: { interface: 'npm-run-release-train-assert', manifest: 'release-train.manifest.json' },
        },
        {
            role: 'handbook',
            repository: 'RebelliousSmile/obsidian-handbook',
            ref: 'c'.repeat(40),
            path: 'handbook',
            proof: { interface: 'npm-run-release-train-assert', manifest: 'release-train.manifest.json' },
        },
    ],
}

assert.deepEqual(parseProtocolOne(manifest), manifest)
assert.deepEqual(selectLanternConsumer(manifest), { candidate, consumer: manifest.consumers[0] })
assert.throws(() => parseProtocolOne({ ...manifest, protocol: 2 }), /protocol must be 1/)
assert.throws(() => parseProtocolOne({ ...manifest, consumers: [manifest.consumers[0]] }), /Lantern and Handbook exactly once/)
assert.throws(() => parseProtocolOne({ ...manifest, candidate: { ...candidate, integrity: 'sha256-invalid' } }), /SHA-512 SRI/)
assert.throws(() => selectLanternConsumer({ ...manifest, consumers: [{ ...manifest.consumers[0], ref: 'd'.repeat(40) }, manifest.consumers[1]] }), /does not match checked-out HEAD/)

console.log('Release-train protocol-1 parser verified.')
