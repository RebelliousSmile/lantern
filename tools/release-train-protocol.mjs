/* global process */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { URL } from 'node:url'

const COMMIT = /^[a-f0-9]{40}$/
const SHA256 = /^[a-f0-9]{64}$/
const SRI = /^sha512-[A-Za-z0-9+/]+={0,2}$/
const ROLES = ['handbook', 'lantern']
const REPOSITORIES = {
    handbook: 'RebelliousSmile/obsidian-handbook',
    lantern: 'RebelliousSmile/lantern',
}

function object(value, label) {
    assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
    return value
}

function exactKeys(value, keys, label) {
    assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} has unexpected or missing fields`)
}

function text(value, label) {
    assert.equal(typeof value, 'string', `${label} must be text`)
    assert.ok(value.length > 0, `${label} must not be empty`)
    return value
}

function candidate(raw) {
    const value = object(raw, 'candidate')
    exactKeys(value, ['provider', 'releaseUrl', 'sha256', 'integrity', 'version', 'stagingTag', 'finalTag', 'providerCommit'], 'candidate')
    assert.equal(value.provider, 'schema-pbta', 'candidate.provider must be schema-pbta')
    assert.match(text(value.releaseUrl, 'candidate.releaseUrl'), /^https:\/\/github\.com\/RebelliousSmile\/schema-pbta\/releases\/download\//, 'candidate.releaseUrl must be a stable schema-pbta release URL')
    assert.equal(new URL(value.releaseUrl).search, '', 'candidate.releaseUrl must not carry a signed query')
    assert.match(text(value.sha256, 'candidate.sha256'), SHA256, 'candidate.sha256 must be SHA-256')
    assert.match(text(value.integrity, 'candidate.integrity'), SRI, 'candidate.integrity must be SHA-512 SRI')
    assert.match(text(value.version, 'candidate.version'), /^\d+\.\d+\.\d+$/, 'candidate.version must be SemVer')
    assert.equal(text(value.finalTag, 'candidate.finalTag'), `v${value.version}`, 'candidate.finalTag must match candidate.version')
    assert.match(text(value.stagingTag, 'candidate.stagingTag'), new RegExp(`^v${value.version.replaceAll('.', '\\.')}-rc\\.\\d+$`), 'candidate.stagingTag must stage candidate.version')
    assert.match(text(value.providerCommit, 'candidate.providerCommit'), COMMIT, 'candidate.providerCommit must be a full commit SHA')
    assert.ok(value.releaseUrl.endsWith(`/releases/download/${value.stagingTag}/schema-pbta-${value.version}.tgz`), 'candidate.releaseUrl must name the staged candidate archive')
    return value
}

function consumer(raw, index) {
    const value = object(raw, `consumers[${index}]`)
    exactKeys(value, ['role', 'repository', 'ref'], `consumers[${index}]`)
    assert.ok(ROLES.includes(value.role), `consumers[${index}].role must be lantern or handbook`)
    assert.equal(value.repository, REPOSITORIES[value.role], `consumers[${index}] has the wrong repository`)
    assert.match(text(value.ref, `consumers[${index}].ref`), COMMIT, `consumers[${index}].ref must be a full commit SHA`)
    return { role: value.role, repository: value.repository, ref: value.ref }
}

export function parseProtocolOne(raw) {
    const value = object(raw, 'release train')
    exactKeys(value, ['protocol', 'candidate', 'consumers'], 'release train')
    assert.equal(value.protocol, 1, 'release train protocol must be 1')
    const consumers = value.consumers
    assert.ok(Array.isArray(consumers) && consumers.length === ROLES.length, 'consumers must name Lantern and Handbook exactly once')
    const parsedConsumers = consumers.map(consumer)
    assert.deepEqual(parsedConsumers.map(({ role }) => role).sort(), ROLES, 'consumers must name Lantern and Handbook exactly once')
    return { protocol: 1, candidate: candidate(value.candidate), consumers: parsedConsumers }
}

export function selectLanternConsumer(raw, cwd = process.cwd()) {
    const manifest = parseProtocolOne(raw)
    const lantern = manifest.consumers.find(({ role }) => role === 'lantern')
    const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' })
    assert.equal(head.status, 0, 'could not resolve checked-out Lantern HEAD')
    assert.equal(head.stdout.trim(), lantern.ref, 'manifest Lantern ref does not match checked-out HEAD')
    return { candidate: manifest.candidate, consumer: lantern }
}
