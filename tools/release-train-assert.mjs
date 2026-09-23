/* global console, process */
import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { assertSchemaAdrenalineReleaseTrain } from './assert-schema-adrenaline-release-train.mjs'

const arguments_ = process.argv.slice(2).filter((value) => value !== '--')
if (arguments_.length !== 1) throw new Error('release-train assertion requires exactly one manifest path')
const manifestPath = arguments_[0]
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

if (manifest?.provider?.repository === 'RebelliousSmile/schema-adrenaline') {
    console.log(JSON.stringify(await assertSchemaAdrenalineReleaseTrain(manifestPath)))
} else if (manifest?.candidate?.packageName === 'schema-in-the-mist' || String(manifest?.candidate?.releaseUrl).includes('/schema-in-the-mist/')) {
    if (manifest?.consumer?.role !== 'lantern' || manifest.consumer.repository !== 'RebelliousSmile/lantern') throw new Error('release-train manifest does not identify Lantern')
    const validated = spawnSync(process.execPath, ['tools/validate-release-train.mjs', manifestPath], { encoding: 'utf8' })
    if (validated.status !== 0) throw new Error(validated.stderr || validated.stdout || 'schema-in-the-mist candidate proof failed')
    const result = JSON.parse(validated.stdout.trim())
    if (!result.ok) throw new Error('schema-in-the-mist candidate proof did not pass')
    const candidate = manifest.candidate
    const evidence = {
        status: 'passed',
        artifact: { releaseUrl: candidate.releaseUrl, sha256: candidate.sha256, integrity: candidate.integrity },
        consumer: manifest.consumer,
    }
    const evidencePath = `${manifestPath}.evidence.json`
    writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
    console.log(JSON.stringify({ status: 'passed', evidencePath }))
} else {
    throw new Error('release-train assertion does not support this provider')
}
