import { templateRegistry } from './templates/registry'
import { getPbtaMonsterheartsPlaybookPresentation } from 'schema-pbta'

/* The capability surface: what Lantern tells the outside world it can do.

   A schema package publishes a `cross-tool-provider.json` whose
   `capabilities.lantern` lists the tokens it expects this app to implement, and
   a pack inside that package can restate the claim in its own
   `requirements.lantern`. Until this module existed, those declarations were
   checked against nothing — a provider could name any token at all and no build
   would notice. This is the vocabulary they are confronted with.

   `edit:` is derived from the registry at two granularities:

     edit:<contractId>    the whole contract, e.g. `edit:pbta`
     edit:<contractKey>   one document of it, e.g. `edit:pbta/playbook`

   Both are derived from `templateRegistry`, never written down twice: the
   coarse token is the segment before the first slash of the fine ones, so it
   cannot drift from them. A token is therefore added by shipping a template,
   and never by editing this file.

   Published presentation capabilities are derived from the contract API that
   Lantern actually consumes. No unsupported `import:`, `export:` or `render:`
   family is emitted.

   The `implemented` filter below is an extension point rather than live
   behaviour: nothing sets the flag to `false` today, so every registry entry
   contributes a token. */

function deriveCapabilities(): readonly string[] {
    const tokens = new Set<string>()

    for (const template of templateRegistry) {
        if (!template.implemented) continue

        const key = template.contractKey
        tokens.add(`edit:${key}`)

        const separator = key.indexOf('/')
        if (separator > 0) tokens.add(`edit:${key.slice(0, separator)}`)
    }

    if (getPbtaMonsterheartsPlaybookPresentation('monsterhearts-playbook')) {
        tokens.add('presentation:pbta-layout')
    }

    return Object.freeze([...tokens].sort())
}

/** Every capability token this build of Lantern publishes, sorted and deduplicated. */
export const LANTERN_CAPABILITIES: readonly string[] = deriveCapabilities()

/**
 * The required tokens that Lantern does not publish, in the order asked for and
 * without repeats. An empty result means the whole claim is honoured.
 *
 * Deciding what an unknown token costs belongs to the caller: the contract
 * assertion fails the build on one, while a pack listing documents addressed to
 * another consumer only reports it. This function throws nothing.
 */
export function unknownCapabilities(required: readonly string[]): string[] {
    const missing: string[] = []
    const seen = new Set<string>()

    for (const token of required) {
        if (LANTERN_CAPABILITIES.includes(token)) continue
        if (seen.has(token)) continue

        seen.add(token)
        missing.push(token)
    }

    return missing
}
