import type { ZodType } from 'zod'

/**
 * The shape every published contract collapses into: the intersection of what
 * `schema-in-the-mist`, `schema-pbta` and `schema-adrenaline` all export.
 *
 * Deliberately narrow. JSON codecs stay out — only Adrenaline and Mist offer
 * them, Lantern's exchange boundary is TOML, and the conformance harness reaches
 * for a package's JSON codecs directly rather than through this interface.
 * Nothing here derives from `TARGETS` or `GAMES` either: only one of the three
 * packages publishes those, so depending on them would reintroduce the
 * per-package branch this registry exists to remove.
 */
export type DocumentContract<TDocument = unknown> = {
    /** `<contract>/<target>`, unique across every registered contract. */
    key: string
    /** The publishing contract: `mist`, `pbta`, `adrenaline`. */
    contractId: string
    /** The target as the contract itself names it, unprefixed. */
    target: string
    /** Human-readable name for the target, for error messages and pickers. */
    label: string
    schema: ZodType<TDocument>
    parseToml: (tomlText: string) => TDocument
    stringifyToml: (document: TDocument) => string
}

/**
 * Erases the document generic so heterogeneous contracts can share one table,
 * the way `AnyTemplateDefinition` does for template definitions.
 */
export type AnyDocumentContract = DocumentContract<any>

/**
 * The subset of a published codec this layer reads. The packages' own entries
 * carry more — JSON pairs, a bare `parse` — and stay assignable to this.
 */
export type PublishedTomlCodec = {
    schema: ZodType<any>
    parseToml: (tomlText: string) => any
    stringifyToml: (document: any) => string
}

/** `city-of-mist/theme-kit` -> `Theme Kit`, `game-definition` -> `Game Definition`. */
export function humanizeTarget(target: string): string {
    const leaf = target.slice(target.lastIndexOf('/') + 1)
    return leaf
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

/**
 * Folds a package's own dispatch table into the common shape, keeping the TOML
 * pair and dropping everything the common interface does not declare.
 */
export function toDocumentContracts(
    contractId: string,
    codecs: Readonly<Record<string, PublishedTomlCodec>>
): AnyDocumentContract[] {
    return Object.entries(codecs).map(([target, codec]) => ({
        key: `${contractId}/${target}`,
        contractId,
        target,
        label: humanizeTarget(target),
        schema: codec.schema,
        parseToml: (tomlText: string) => codec.parseToml(tomlText),
        stringifyToml: (document: unknown) => codec.stringifyToml(document),
    }))
}
