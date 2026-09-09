import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toThemeKitDocument,
    toThemeKitPayload,
    type ThemeKitDocument,
} from './model'
import { CityOfMistThemeKitSchema } from './schema'
import { computeCityOfMistThemeKitWarnings } from './warnings'

function formatIssues(error: {
    issues: { path: PropertyKey[]; message: string }[]
}) {
    return error.issues
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('\n')
}

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistThemeKit: ThemeKitDocument
    warnings: string[]
} {
    const raw = tomlParse(tomlText)
    const parsed = CityOfMistThemeKitSchema.safeParse(raw)

    if (!parsed.success) throw new Error(formatIssues(parsed.error))

    const cityOfMistThemeKit = toThemeKitDocument(parsed.data)
    return {
        cityOfMistThemeKit,
        warnings: computeCityOfMistThemeKitWarnings(cityOfMistThemeKit),
    }
}

export function exportToTOML(themeKit: ThemeKitDocument): string {
    const payload = toThemeKitPayload(themeKit)
    const parsed = CityOfMistThemeKitSchema.safeParse(payload)

    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(parsed.data as any)
}
