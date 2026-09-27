/* global Buffer, fetch */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { URL } from 'node:url'

const PROVIDERS = ['schema-pbta', 'schema-in-the-mist', 'schema-adrenaline']
const SRI = /^sha512-[A-Za-z0-9+/]+={0,2}$/

export function canonicalPin(pkg, name) {
    const releaseUrl = pkg.dependencies?.[name]
    assert.equal(typeof releaseUrl, 'string', `${pkg.name}: ${name} pin is missing`)
    const parsed = new URL(releaseUrl)
    assert.equal(parsed.protocol, 'https:', `${pkg.name}: ${name} pin must use HTTPS`)
    assert.equal(parsed.hostname, 'github.com', `${pkg.name}: ${name} pin must use GitHub`)
    assert.equal(parsed.username, '', `${pkg.name}: ${name} pin has credentials`)
    assert.equal(parsed.password, '', `${pkg.name}: ${name} pin has credentials`)
    assert.equal(parsed.port, '', `${pkg.name}: ${name} pin has a port`)
    assert.equal(parsed.search, '', `${pkg.name}: ${name} pin has a query`)
    assert.equal(parsed.hash, '', `${pkg.name}: ${name} pin has a fragment`)
    const match = parsed.pathname.match(
        new RegExp(`^/RebelliousSmile/${name}/releases/download/v(\\d+\\.\\d+\\.\\d+)/${name}-\\1\\.tgz$`)
    )
    assert.ok(match, `${pkg.name}: ${name} must use its canonical final archive`)
    return { releaseUrl, version: match[1] }
}

export function npmPin(lock, name, expected) {
    assert.equal(lock.packages?.['']?.dependencies?.[name], expected.releaseUrl, `Lantern npm importer differs for ${name}`)
    const entry = lock.packages?.[`node_modules/${name}`]
    assert.ok(entry, `Lantern npm lock misses ${name}`)
    assert.equal(entry.version, expected.version, `Lantern npm version differs for ${name}`)
    assert.equal(entry.resolved, expected.releaseUrl, `Lantern npm resolution differs for ${name}`)
    assert.match(entry.integrity, SRI, `Lantern npm SRI is missing for ${name}`)
    return entry.integrity
}

export function pnpmPin(lock, name, expected, owner) {
    assert.doesNotMatch(lock, /release-assets\.githubusercontent\.com/, `${owner} lock has a signed storage redirect`)
    const lines = lock.split(/\r?\n/)
    const importer = lines.indexOf(`      ${name}:`)
    assert.ok(importer >= 0, `${owner} pnpm importer misses ${name}`)
    assert.equal(lines[importer + 1], `        specifier: ${expected.releaseUrl}`, `${owner} pnpm specifier differs for ${name}`)
    assert.equal(lines[importer + 2], `        version: ${expected.releaseUrl}`, `${owner} pnpm importer version differs for ${name}`)
    const key = `  ${name}@${expected.releaseUrl}:`
    const first = lines.indexOf(key)
    const last = lines.lastIndexOf(key)
    assert.ok(first >= 0 && last > first, `${owner} pnpm package or snapshot misses ${name}`)
    assert.equal(lines.filter((line) => line === key).length, 2, `${owner} pnpm has duplicate ${name} entries`)
    const resolution = lines[first + 1]?.match(/^ {4}resolution: \{(.+)\}$/)?.[1]
    assert.ok(resolution, `${owner} pnpm resolution misses ${name}`)
    const fields = Object.fromEntries(resolution.split(', ').map((field) => field.split(/: (.*)/s).slice(0, 2)))
    assert.equal(fields.tarball, expected.releaseUrl, `${owner} pnpm tarball differs for ${name}`)
    assert.match(fields.integrity, SRI, `${owner} pnpm SRI is missing for ${name}`)
    assert.equal(lines[first + 2], `    version: ${expected.version}`, `${owner} pnpm package version differs for ${name}`)
    return fields.integrity
}

export async function assertConsumerSchemaPins(sources, fetcher = fetch) {
    const { lanternPackage, lanternNpmLock, lanternPnpmLock, handbookPackage, handbookPnpmLock } = sources
    const results = []
    for (const name of PROVIDERS) {
        const lantern = canonicalPin(lanternPackage, name)
        const handbook = canonicalPin(handbookPackage, name)
        assert.deepEqual(lantern, handbook, `${name} differs between Lantern and Handbook`)
        const npmSRI = npmPin(lanternNpmLock, name, lantern)
        const lanternSRI = pnpmPin(lanternPnpmLock, name, lantern, 'Lantern')
        const handbookSRI = pnpmPin(handbookPnpmLock, name, handbook, 'Handbook')
        assert.equal(npmSRI, lanternSRI, `${name} Lantern lock SRIs differ`)
        assert.equal(npmSRI, handbookSRI, `${name} consumer lock SRIs differ`)
        const response = await fetcher(lantern.releaseUrl)
        assert.ok(response.ok, `${name} final archive download failed: ${response.status}`)
        const bytes = Buffer.from(await response.arrayBuffer())
        const publishedSRI = `sha512-${createHash('sha512').update(bytes).digest('base64')}`
        assert.equal(npmSRI, publishedSRI, `${name} lock SRI differs from published final bytes`)
        results.push({ name, version: lantern.version, releaseUrl: lantern.releaseUrl, integrity: publishedSRI })
    }
    return results
}
