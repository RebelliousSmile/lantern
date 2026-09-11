import assert from 'node:assert/strict'
import { carryCanonicalSource, overlayCanonicalSource } from '../src/contracts/mist-engine'

const source = { name: 'Danger', rating: 0, extension: false }
const edited = carryCanonicalSource({ name: 'Edited Danger' }, source)
const actual = overlayCanonicalSource(edited, edited)

assert.deepStrictEqual(actual, {
    name: 'Edited Danger',
    rating: 0,
    extension: false,
})
assert.equal('__canonicalSource' in actual, false)
