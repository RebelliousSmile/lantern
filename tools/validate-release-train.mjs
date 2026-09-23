/* global Buffer, console, fetch, process */
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'

const argument = process.argv.slice(2).filter((value) => value !== '--')
if (argument.length !== 1 || isAbsolute(argument[0])) throw new Error('release-train manifest must be one relative path')
const manifestPath = resolve(argument[0])
if (relative(resolve('.'), manifestPath).startsWith(`..${sep}`)) throw new Error('release-train manifest must stay inside Lantern')
const trainManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const root = process.cwd()
const candidate = {
    packageName:
        trainManifest.candidate?.packageName ??
        /RebelliousSmile\/(schema-[^/]+)\/releases\//.exec(
            trainManifest.candidate?.releaseUrl ?? ''
        )?.[1],
    archiveUrl: trainManifest.candidate?.releaseUrl,
    version: trainManifest.candidate?.finalTag?.replace(/^v/, ''),
    sha256: trainManifest.candidate?.sha256,
    integrity: trainManifest.candidate?.integrity,
    ref: trainManifest.consumer?.ref,
}
if (trainManifest.consumer?.role !== 'lantern' || trainManifest.consumer?.repository !== 'RebelliousSmile/lantern') throw new Error('manifest consumer does not identify Lantern')
const git = (...args) => spawnSync('git', args, { encoding: 'utf8' })
const head = git('rev-parse', 'HEAD')
const declaredRef = git('rev-parse', '--verify', `${candidate.ref}^{commit}`)
if (head.status || declaredRef.status || head.stdout.trim() !== declaredRef.stdout.trim()) throw new Error('manifest consumer.ref does not resolve to checked-out Lantern HEAD')

const checks = {}
const fail = (name, message) => {
    checks[name] = { ok: false, message }
}
const pass = (name) => {
    checks[name] = { ok: true }
}
const required = Object.entries(candidate).filter(([, value]) => !value)
if (required.length) {
    for (const [name] of required) fail(`input:${name}`, 'missing explicit release-train input')
} else {
    const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    const npmLock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'))
    const npmPackage = npmLock.packages?.[`node_modules/${candidate.packageName}`]
    const declared = manifest.dependencies?.[candidate.packageName]

    if (declared === candidate.archiveUrl && npmLock.packages?.['']?.dependencies?.[candidate.packageName] === candidate.archiveUrl)
        pass('npm-declaration')
    else fail('npm-declaration', 'package.json and package-lock root must declare the candidate archive')

    if (npmPackage?.resolved === candidate.archiveUrl && npmPackage.version === candidate.version && npmPackage.integrity === candidate.integrity)
        pass('npm-resolution')
    else fail('npm-resolution', 'package-lock resolved URL, version or SRI differs from candidate')

    if (existsSync(join(root, 'pnpm-lock.yaml'))) {
        const pnpm = readFileSync(join(root, 'pnpm-lock.yaml'), 'utf8')
        const escaped = candidate.packageName.replace('-', '\\-')
        const importer = new RegExp(`^      ${escaped}:\\r?\\n        specifier: (.+)\\r?\\n        version: (.+)$`, 'm').exec(pnpm)
        const packageEntry = pnpm
            .split(/\r?\n/)
            .some((line, index, lines) =>
                line.startsWith(`  ${candidate.packageName}@`) &&
                lines.slice(index, index + 4).some((value) => value.includes(`integrity: ${candidate.integrity}`)) &&
                lines.slice(index, index + 4).some((value) => value.trim() === `version: ${candidate.version}`)
            )
        if (importer?.[1] === candidate.archiveUrl && packageEntry)
            pass('pnpm-resolution')
        else fail('pnpm-resolution', 'pnpm importer URL or resolved package version/SRI differs from candidate')
    } else pass('pnpm-resolution')

    const store = mkdtempSync(join(tmpdir(), 'lantern-release-train-store-'))
    const frozen = spawnSync('pnpm', ['install', '--frozen-lockfile', '--ignore-scripts', '--store-dir', store], { encoding: 'utf8', shell: process.platform === 'win32' })
    rmSync(store, { recursive: true, force: true })
    if (frozen.status === 0) pass('frozen-install')
    else fail('frozen-install', 'pnpm frozen install did not materialize the committed Lantern graph')

    const installed = JSON.parse(readFileSync(join(root, 'node_modules', candidate.packageName, 'package.json'), 'utf8'))
    if (installed.version === candidate.version) pass('installed-version')
    else fail('installed-version', `installed ${installed.version}, expected ${candidate.version}`)

    const vite = spawnSync('npm', ['run', 'build'], { encoding: 'utf8', shell: process.platform === 'win32' })
    const assets = existsSync('dist/assets') ? readdirSync('dist/assets') : []
    const preview = readFileSync('src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview.tsx', 'utf8')
    const pbtaProof = candidate.packageName !== 'schema-pbta' || (preview.includes('PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS') && preview.includes("'drowned-lake'"))
    if (vite.status === 0 && assets.length > 0 && pbtaProof) pass('vite-build')
    else fail('vite-build', 'production Vite build did not retain the provider surface')

    const response = await fetch(candidate.archiveUrl)
    if (!response.ok) fail('archive', `download failed with ${response.status}`)
    else {
        const bytes = Buffer.from(await response.arrayBuffer())
        const sha256 = createHash('sha256').update(bytes).digest('hex')
        const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`
        if (sha256 === candidate.sha256 && integrity === candidate.integrity) pass('archive')
        else fail('archive', 'archive SHA-256 or SRI differs from candidate')
    }
}

const result = {
    ok: Object.values(checks).every((check) => check.ok),
    candidate,
    checks,
}
console.log(JSON.stringify(result))
process.exitCode = result.ok ? 0 : 1
