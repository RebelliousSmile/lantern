/* global Buffer, console */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { assertConsumerSchemaPins } from './consumer-schema-pins.mjs'

const archive = Buffer.from('immutable provider archive fixture')
const integrity = `sha512-${createHash('sha512').update(archive).digest('base64')}`
const versions = {
    'schema-adrenaline': '2.5.0',
    'schema-in-the-mist': '1.3.5',
    'schema-pbta': '8.4.3',
}
const dependencies = Object.fromEntries(
    Object.entries(versions).map(([name, version]) => [
        name,
        `https://github.com/RebelliousSmile/${name}/releases/download/v${version}/${name}-${version}.tgz`,
    ])
)

function pnpmLock() {
    return [
        'importers:',
        '  .:',
        '    dependencies:',
        ...Object.entries(dependencies).flatMap(([name, url]) => [
            `      ${name}:`,
            `        specifier: ${url}`,
            `        version: ${url}`,
        ]),
        'packages:',
        ...Object.entries(dependencies).flatMap(([name, url]) => [
            `  ${name}@${url}:`,
            `    resolution: {integrity: ${integrity}, tarball: ${url}}`,
            `    version: ${versions[name]}`,
        ]),
        'snapshots:',
        ...Object.entries(dependencies).flatMap(([name, url]) => [
            `  ${name}@${url}:`,
            '    dependencies:',
            '      smol-toml: 1.8.0',
        ]),
        '',
    ].join('\n')
}

const sources = {
    lanternPackage: { name: 'lantern', dependencies },
    lanternNpmLock: {
        packages: {
            '': { dependencies },
            ...Object.fromEntries(
                Object.entries(dependencies).map(([name, url]) => [
                    `node_modules/${name}`,
                    { version: versions[name], resolved: url, integrity },
                ])
            ),
        },
    },
    lanternPnpmLock: pnpmLock(),
    handbookPackage: { name: 'obsidian-handbook', dependencies },
    handbookPnpmLock: pnpmLock(),
}
const fetcher = async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from(archive).buffer })

assert.equal((await assertConsumerSchemaPins(sources, fetcher)).length, 3)

async function reject(mutate, pattern, sourceFetch = fetcher) {
    const input = JSON.parse(JSON.stringify(sources))
    mutate(input)
    await assert.rejects(assertConsumerSchemaPins(input, sourceFetch), pattern)
}

await reject(
    (input) => { input.lanternPackage.dependencies['schema-pbta'] = dependencies['schema-pbta'].replace('/v8.4.3/', '/v8.4.3-rc.1/') },
    /canonical final archive/
)
await reject(
    (input) => { input.handbookPackage.dependencies['schema-adrenaline'] = dependencies['schema-adrenaline'].replace('schema-adrenaline-2.5.0.tgz', 'candidate.tgz') },
    /canonical final archive/
)
await reject(
    (input) => { input.lanternNpmLock.packages['node_modules/schema-adrenaline'].integrity = 'sha512-wrong' },
    /lock SRIs differ/
)
await reject(
    (input) => { input.handbookPnpmLock = input.handbookPnpmLock.replace(integrity, 'sha512-wrong') },
    /consumer lock SRIs differ/
)
await reject(
    (input) => { input.lanternPnpmLock += 'release-assets.githubusercontent.com' },
    /signed storage redirect/
)
await reject(
    () => {},
    /published final bytes/,
    async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer })
)

console.log('Consumer pin checks reject candidate URLs, lock drift, redirects, and wrong published bytes.')
