/* global console */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { discoverManifests, journeyCoverage, parseMatrix } from './release-train-matrix.mjs'

const source = JSON.parse(readFileSync('release-train.matrix.json', 'utf8'))
const matrix = parseMatrix(source)
const coverage = journeyCoverage(matrix)

// A floor: each train registers one more manifest.
assert.ok(coverage.length >= 6, `${coverage.length} manifests`)
assert.deepEqual(
    [...new Set(coverage.map(({ provider }) => provider))].sort(),
    ['schema-adrenaline', 'schema-in-the-mist', 'schema-pbta']
)
const pbtaCoverage = coverage.filter(({ provider }) => provider === 'schema-pbta')
assert.ok(pbtaCoverage.length >= 2, `${pbtaCoverage.length} schema-pbta manifests`)
for (const { checks } of pbtaCoverage) {
    assert.deepEqual(checks, ['vite-build', 'monsterhearts-four-assets', 'executable-chunks'])
}
assert.deepEqual(
    discoverManifests(
        [
            'release-train/schema-pbta-v8.4.2.json',
            'release-train/schema-pbta-v8.4.3.json',
            'release-train/candidates/schema-pbta-v8.4.3-rc.1.json',
            'release-train/provenance/schema-pbta-v8.4.3.json',
        ],
        'schema-pbta'
    ),
    ['release-train/schema-pbta-v8.4.2.json', 'release-train/schema-pbta-v8.4.3.json']
)

function reject(mutate, pattern) {
    const input = JSON.parse(JSON.stringify(source))
    mutate(input)
    assert.throws(() => parseMatrix(input), pattern)
}

reject((input) => { input.providers.pop() }, /three providers/)
reject((input) => { input.providers[0].ref = 'main' }, /full commit/)
reject((input) => { input.providers[0].manifests[0].path = 'fixtures/example.json' }, /not canonical/)
reject((input) => { input.providers[0].manifests.push(input.providers[0].manifests[0]) }, /duplicate manifest/)
reject((input) => { input.providers[0].repository = 'RebelliousSmile/other' }, /unknown or wrong provider/)
reject((input) => { input.providers[0].manifests[0].validatorRef = 'v8.4.2' }, /full commit/)

console.log(`Release train matrix covers ${coverage.length} real manifests and rejects mutable, duplicate, or fixture inputs.`)
