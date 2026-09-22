/* global console, process */
import { readFileSync, writeFileSync } from 'node:fs'

const [url, integrity] = process.argv.slice(2)
if (!url?.startsWith('https://github.com/RebelliousSmile/schema-pbta/releases/download/') || !integrity?.startsWith('sha512-')) {
    throw new Error('usage: prepare-schema-pbta-candidate <release-url> <sha512-sri>')
}
let lock = readFileSync('pnpm-lock.yaml', 'utf8')
const before = lock
lock = lock.replace(/(schema-pbta:\r?\n\s+specifier: )[^\r\n]+/, `$1${url}`)
lock = lock.replace(/(schema-pbta:\r?\n\s+specifier: [^\r\n]+\r?\n\s+version: )[^\r\n]+/, `$1${url}`)
lock = lock.replace(/schema-pbta@https:\/\/release-assets\.githubusercontent\.com[^\r\n]+:/g, `schema-pbta@${url}:`)
lock = lock.replace(/(schema-pbta@[^\r\n]+:\r?\n\s+resolution: \{tarball: )https:\/\/release-assets\.githubusercontent\.com[^,}]+(, integrity: )[^}]+/, `$1${url}$2${integrity}`)
if (lock === before || /schema-pbta@https:\/\/release-assets\.githubusercontent\.com/.test(lock)) throw new Error('candidate lock normalization failed')
writeFileSync('pnpm-lock.yaml', lock)
console.log(JSON.stringify({ status: 'ready', releaseUrl: url, integrity }))
