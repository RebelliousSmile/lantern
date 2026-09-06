import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toLegendInTheMistStoryThemeDocument,
    toLegendInTheMistStoryThemePayload,
    type LegendInTheMistStoryTheme,
} from './model'
import { LegendInTheMistStoryThemeSchema } from './schema'
import { computeLegendInTheMistStoryThemeWarnings } from './warnings'

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
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = LegendInTheMistStoryThemeSchema.safeParse(raw)

    if (!parsed.success) {
        throw new Error(formatIssues(parsed.error))
    }

    const legendInTheMistStoryTheme = toLegendInTheMistStoryThemeDocument(
        parsed.data
    )
    const warnings = computeLegendInTheMistStoryThemeWarnings(
        legendInTheMistStoryTheme
    )
    return { legendInTheMistStoryTheme, warnings }
}

/**
 * Ensure we only export validated data, and only the fields that carry
 * something: an untouched optional field would otherwise be written out as an
 * empty string or a zero and read back as deliberate.
 */
export function exportToTOML(
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
): string {
    const payload = toLegendInTheMistStoryThemePayload(
        legendInTheMistStoryTheme
    )
    const parsed = LegendInTheMistStoryThemeSchema.safeParse(payload)
    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(payload as any)
}
