import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

/*
 * Each schema package may publish a `cross-tool-provider.json` at its root, stating what it expects
 * of every consumer. `capabilities.lantern` is its claim on this app, and a pack inside the package
 * can restate that claim for itself. This module is the single place that knows where those
 * declarations live and how to read them; the assertion layer downstream only compares them with
 * the capability surface Lantern publishes.
 *
 * Two facts shape the reader. A provider can be *absent*: `schema-adrenaline` carries the file in
 * its repository but its only release tarball predates it, and this app pins release tarballs, so
 * the descriptor does not arrive. And one `packManifest` field covers two unrelated pack dialects:
 * PbtA's `pack-contract.json`, which declares `requirements.lantern`, and the Handbook packs the
 * two Mist-side providers point at, which declare a flat `requires` list of `block:` and `style:`
 * tokens addressed to a different consumer entirely.
 */

/** Contract id to the package that publishes it, mirroring `MANIFEST_SUBPATHS`. */
export const PROVIDER_PACKAGES = {
    mist: 'schema-in-the-mist',
    pbta: 'schema-pbta',
    adrenaline: 'schema-adrenaline',
}

const DESCRIPTOR_FILE = 'cross-tool-provider.json'

function readCapabilityList(value, what) {
    if (value === undefined) return []
    if (!Array.isArray(value)) {
        throw new Error(`${what} is not a list: ${JSON.stringify(value)}`)
    }
    for (const token of value) {
        if (typeof token !== 'string' || token.trim() === '') {
            throw new Error(
                `${what} carries a token that is not a non-empty string: ${JSON.stringify(token)}`
            )
        }
    }
    return value
}

/**
 * Expands a single-star glob — a path with one `*` segment — against a package root, and
 * refuses any candidate that would land outside it.
 */
function globbedManifests(root, pattern) {
    const parts = pattern.split('/')
    const star = parts.indexOf('*')
    if (star === -1 || parts.indexOf('*', star + 1) !== -1) {
        throw new Error(
            `packManifest "${pattern}" is not a single-star glob; this reader handles no other shape`
        )
    }

    const prefix = path.join(root, ...parts.slice(0, star))
    const suffix = parts.slice(star + 1)
    if (!fs.existsSync(prefix)) return []

    return fs
        .readdirSync(prefix, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => ({
            id: entry.name,
            file: path.join(prefix, entry.name, ...suffix),
        }))
        .filter((candidate) => {
            const resolved = path.resolve(candidate.file)
            if (!resolved.startsWith(root + path.sep)) {
                throw new Error(
                    `Pack manifest resolves outside its package root: ${resolved}`
                )
            }
            return fs.existsSync(resolved)
        })
}

/**
 * Reads one pack manifest and says what it declares for Lantern.
 *
 * Throws rather than skipping on an unrecognised shape, the way `normalizeManifest` does for a
 * corpus dialect: a pack quietly ignored is a green run that proves nothing.
 */
function readPackManifest(candidate) {
    const manifest = JSON.parse(fs.readFileSync(candidate.file, 'utf8'))

    const hasRequirements =
        manifest.requirements !== null &&
        typeof manifest.requirements === 'object' &&
        !Array.isArray(manifest.requirements)

    if (hasRequirements) {
        const documents = Array.isArray(manifest.documents)
            ? manifest.documents
            : []
        return {
            dialect: 'pack-contract',
            id: candidate.id,
            file: candidate.file,
            lantern: readCapabilityList(
                manifest.requirements.lantern,
                `requirements.lantern of pack "${candidate.id}"`
            ),
            targets: documents
                .map((document) => document.target)
                .filter((target) => typeof target === 'string'),
        }
    }

    /* A Handbook pack: its `requires` tokens are addressed to Handbook, not to Lantern. */
    if (Array.isArray(manifest.requires)) {
        return {
            dialect: 'handbook-pack',
            id: candidate.id,
            file: candidate.file,
            lantern: [],
            targets: [],
        }
    }

    const keys = Object.keys(manifest).sort().join(', ')
    throw new Error(
        `Unrecognised pack manifest dialect: ${candidate.file}. Keys: ${keys}`
    )
}

/**
 * Resolves every provider's descriptor from the calling module's own resolver.
 *
 * @param {string} fromUrl an `import.meta.url` that can see `node_modules`
 * @returns {{ published: object[], unpublished: string[] }} the providers that ship a descriptor,
 *   with their declared capabilities and packs, and the contract ids of those that do not.
 */
export function resolveProviderDescriptors(fromUrl) {
    const require = createRequire(fromUrl)
    const published = []
    const unpublished = []

    for (const [contractId, packageName] of Object.entries(PROVIDER_PACKAGES)) {
        let descriptorFile
        try {
            descriptorFile = require.resolve(
                `${packageName}/${DESCRIPTOR_FILE}`
            )
        } catch {
            /* Absent, not broken: the pinned tarball predates the file. */
            unpublished.push(contractId)
            continue
        }

        const descriptor = JSON.parse(fs.readFileSync(descriptorFile, 'utf8'))
        if (descriptor.providerVersion !== 1) {
            throw new Error(
                `Provider "${packageName}" declares providerVersion ${JSON.stringify(descriptor.providerVersion)}, not 1: ${descriptorFile}`
            )
        }

        const root = path.dirname(descriptorFile)
        const packs =
            typeof descriptor.packManifest === 'string'
                ? globbedManifests(root, descriptor.packManifest).map(
                      readPackManifest
                  )
                : []

        published.push({
            contractId,
            packageName,
            provider: descriptor.provider ?? packageName,
            descriptorFile,
            root,
            capabilities: readCapabilityList(
                descriptor.capabilities?.lantern,
                `capabilities.lantern of provider "${packageName}"`
            ),
            packs,
        })
    }

    return { published, unpublished }
}
