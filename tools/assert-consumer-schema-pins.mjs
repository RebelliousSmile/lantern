/* global console, process */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const handbookPackage = process.argv[2]
if (!handbookPackage) {
    throw new Error('usage: assert-consumer-schema-pins <handbook-package.json>')
}

const lantern = JSON.parse(readFileSync('package.json', 'utf8'))
const handbook = JSON.parse(readFileSync(resolve(handbookPackage), 'utf8'))

function releasedVersion(pkg, name) {
    const url = pkg.dependencies?.[name]
    assert.equal(typeof url, 'string', `${pkg.name}: ${name} pin is missing`)
    const match = url.match(
        new RegExp(
            `^https://github\\.com/RebelliousSmile/${name}/releases/download/v(\\d+\\.\\d+\\.\\d+)/${name}-\\1\\.tgz$`
        )
    )
    assert.ok(match, `${pkg.name}: ${name} must be a public release asset`)
    return match[1]
}

const lanternAdrenaline = releasedVersion(lantern, 'schema-adrenaline')
const handbookAdrenaline = releasedVersion(handbook, 'schema-adrenaline')
assert.equal(
    lanternAdrenaline.split('.')[0],
    handbookAdrenaline.split('.')[0],
    `schema-adrenaline major differs: Lantern ${lanternAdrenaline}, Handbook ${handbookAdrenaline}`
)
assert.equal(
    releasedVersion(lantern, 'schema-in-the-mist'),
    releasedVersion(handbook, 'schema-in-the-mist'),
    'schema-in-the-mist release differs between Lantern and Handbook'
)
console.log('Consumer schema pins agree.')
