/* global console, process */
import { readFileSync } from 'node:fs'
import { assertSchemaAdrenalineReleaseTrain } from './assert-schema-adrenaline-release-train.mjs'

const arguments_ = process.argv.slice(2).filter((value) => value !== '--')
if (arguments_.length !== 1) throw new Error('release-train assertion requires exactly one manifest path')
const manifest = JSON.parse(readFileSync(arguments_[0], 'utf8'))
if (manifest?.provider?.repository !== 'RebelliousSmile/schema-adrenaline') {
    throw new Error('release-train assertion does not support this provider')
}
console.log(JSON.stringify(await assertSchemaAdrenalineReleaseTrain(arguments_[0])))
