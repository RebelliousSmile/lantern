/* global console, process */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseProtocolOne } from './release-train-protocol.mjs'

const arguments_ = process.argv.slice(2).filter((value) => value !== '--')
if (arguments_.length !== 1) throw new Error('release-train validation requires exactly one manifest path')

const manifest = parseProtocolOne(JSON.parse(readFileSync(resolve(arguments_[0]), 'utf8')))
console.log(JSON.stringify(manifest))
