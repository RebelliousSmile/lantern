/* global console, process */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { canonicalPin } from './consumer-schema-pins.mjs'
import { parseMatrix } from './release-train-matrix.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

function run(command, args, cwd) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: 'utf8',
        shell: process.platform === 'win32' && command === 'npm',
        maxBuffer: 10 * 1024 * 1024,
    })
    if (result.status !== 0) {
        throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`)
    }
    return result.stdout.trim()
}

const matrix = parseMatrix(JSON.parse(readFileSync(join(root, 'release-train.matrix.json'), 'utf8')))
const lantern = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
for (const provider of matrix.providers) canonicalPin(lantern, provider.provider)

const workspace = mkdtempSync(join(tmpdir(), 'lantern-release-inputs-'))
try {
    const handbookRoot = join(workspace, 'handbook')
    run('git', ['clone', '--quiet', '--filter=blob:none', '--no-checkout', `https://github.com/${matrix.handbook.repository}.git`, handbookRoot], workspace)
    run('git', ['checkout', '--quiet', '--detach', matrix.handbook.ref], handbookRoot)
    const head = run('git', ['rev-parse', 'HEAD'], handbookRoot)
    if (head !== matrix.handbook.ref) throw new Error('Handbook checkout does not match the pinned commit')
    run(process.execPath, ['tools/assert-consumer-schema-pins.mjs', handbookRoot], root)
    run(process.execPath, ['tools/release-train-matrix.mjs'], root)
    console.log(`Release inputs verified at Handbook ${head}.`)
} finally {
    rmSync(workspace, { recursive: true, force: true })
}
