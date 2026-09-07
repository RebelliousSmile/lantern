import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toLegendInTheMistThemeKitDocument,
    toLegendInTheMistThemeKitPayload,
    type LegendInTheMistThemeKit,
} from './model'
import { LegendInTheMistThemeKitSchema } from './schema'
import { computeLegendInTheMistThemeKitWarnings } from './warnings'

function formatIssues(error: {
    issues: { path: PropertyKey[]; message: string }[]
}) {
    return error.issues
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('\n')
}

/** Import and validate. Throws with a readable message on errors. */
export const importFromTOML = (t: string) => importFromTOMLWithWarnings(t)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistThemeKit: LegendInTheMistThemeKit
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = LegendInTheMistThemeKitSchema.safeParse(raw)

    if (!parsed.success) {
        throw new Error(formatIssues(parsed.error))
    }

    const legendInTheMistThemeKit = toLegendInTheMistThemeKitDocument(
        parsed.data
    )
    const warnings = computeLegendInTheMistThemeKitWarnings(
        legendInTheMistThemeKit
    )
    return { legendInTheMistThemeKit, warnings }
}

/**
 * Ensure we only export validated data, and only the fields that carry
 * something: an untouched optional field would otherwise be written out as an
 * empty string and read back as deliberate.
 */
export function exportToTOML(
    legendInTheMistThemeKit: LegendInTheMistThemeKit
): string {
    const payload = toLegendInTheMistThemeKitPayload(legendInTheMistThemeKit)
    const parsed = LegendInTheMistThemeKitSchema.safeParse(payload)
    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(payload as any)
}
