import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

/*
 * The three published contracts each ship a conformance corpus, and each writes its manifest in its
 * own dialect. This module is the single place that knows the differences; everything downstream
 * reads one normalised case shape.
 */

/**
 * Where each contract's manifest lives, as an export subpath. These are not interchangeable: the
 * packages' export maps rewrite them differently, and `schema-pbta/corpus/cases.json` resolves to a
 * file that physically sits under `corpus/contract/`.
 */
export const MANIFEST_SUBPATHS = {
    mist: 'schema-in-the-mist/corpus/contract/cases.json',
    pbta: 'schema-pbta/corpus/cases.json',
    adrenaline: 'schema-adrenaline/corpus/cases.json',
}

const DIALECTS = [
    {
        name: 'mist',
        matches: (entry) => 'file' in entry && 'canonical' in entry,
        /* Paths are relative to the manifest's own directory. */
        baseOf: (manifestFile) => path.dirname(manifestFile),
        read: (entry) => ({
            id: entry.id,
            target: entry.target,
            file: entry.file,
            expect: entry.canonical,
            format: 'toml',
            /* Carried through when the manifest states them, absent otherwise. */
            lantern: entry.lantern,
            handbook: entry.handbook,
        }),
    },
    {
        /* Checked before the PbtA dialect: both write `path`, only this one writes `format`. */
        name: 'adrenaline',
        matches: (entry) => 'path' in entry && 'format' in entry,
        /* Paths are relative to the package root, one level above the manifest. */
        baseOf: (manifestFile) => path.dirname(path.dirname(manifestFile)),
        read: (entry) => ({
            id: entry.path,
            target: entry.target,
            file: entry.path,
            expect: entry.expect,
            format: entry.format,
        }),
    },
    {
        name: 'pbta',
        matches: (entry) => 'path' in entry && 'expect' in entry,
        /* Paths are relative to the manifest's own directory. */
        baseOf: (manifestFile) => path.dirname(manifestFile),
        read: (entry) => ({
            id: entry.path,
            target: entry.target,
            file: entry.path,
            expect: entry.expect,
            format: 'toml',
        }),
    },
]

const EXPECTATIONS = new Set(['accept', 'reject'])
const FORMATS = new Set(['toml', 'json'])

/**
 * Resolves the three manifests from the calling module's own resolver.
 *
 * @param {string} fromUrl an `import.meta.url` that can see `node_modules`
 * @returns {Record<string, string>} contract id to absolute manifest path
 */
export function resolveContractManifests(fromUrl) {
    const require = createRequire(fromUrl)
    return Object.fromEntries(
        Object.entries(MANIFEST_SUBPATHS).map(([contractId, subpath]) => [
            contractId,
            require.resolve(subpath),
        ])
    )
}

/**
 * Reads one manifest and returns its cases in the shape every layer downstream expects:
 * `{ contractId, key, target, id, file, expect, format }`, plus the Mist-only `lantern` and
 * `handbook` columns when the manifest states them.
 *
 * Throws rather than skipping when the dialect is not one of the three: a manifest quietly ignored
 * is a green run that proves nothing.
 */
export function normalizeManifest(contractId, manifestFile) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    const entries = manifest.cases
    if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error(
            `Corpus manifest for "${contractId}" carries no cases: ${manifestFile}`
        )
    }

    const dialect = DIALECTS.find((candidate) =>
        entries.every((entry) => candidate.matches(entry))
    )
    if (!dialect) {
        const keys = [
            ...new Set(entries.flatMap((entry) => Object.keys(entry))),
        ].sort()
        throw new Error(
            `Unrecognised corpus manifest dialect for "${contractId}" (${manifestFile}). ` +
                `Case keys: ${keys.join(', ')}`
        )
    }

    const base = dialect.baseOf(manifestFile)
    return entries.map((entry) => {
        const read = dialect.read(entry)
        if (!read.target) {
            throw new Error(
                `Corpus case without a target in "${contractId}" (${dialect.name} dialect): ${JSON.stringify(entry)}`
            )
        }
        if (!EXPECTATIONS.has(read.expect)) {
            throw new Error(
                `Corpus case "${read.id}" in "${contractId}" expects "${read.expect}", not accept or reject`
            )
        }
        if (!FORMATS.has(read.format)) {
            throw new Error(
                `Corpus case "${read.id}" in "${contractId}" is in format "${read.format}", not toml or json`
            )
        }
        const file = path.join(base, read.file)
        if (!fs.existsSync(file)) {
            throw new Error(
                `Corpus witness missing on disk for "${contractId}": ${file}`
            )
        }
        return {
            ...read,
            contractId,
            dialect: dialect.name,
            key: `${contractId}/${read.target}`,
            file,
        }
    })
}

/**
 * Normalises every manifest in `manifests` (contract id to path) into one flat list of cases.
 */
export function normalizeContractManifests(manifests) {
    return Object.entries(manifests).flatMap(([contractId, manifestFile]) =>
        normalizeManifest(contractId, manifestFile)
    )
}
