import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toThemeCardDocument,
    toThemeCardPayload,
    type ThemeCardDocument,
} from './model'
import { CityOfMistThemeCardSchema } from './schema'
import { computeCityOfMistThemeCardWarnings } from './warnings'

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
    cityOfMistThemeCard: ThemeCardDocument
    warnings: string[]
} {
    const raw = tomlParse(tomlText)
    const parsed = CityOfMistThemeCardSchema.safeParse(raw)

    if (!parsed.success) throw new Error(formatIssues(parsed.error))

    const cityOfMistThemeCard = toThemeCardDocument(parsed.data)
    return {
        cityOfMistThemeCard,
        warnings: computeCityOfMistThemeCardWarnings(cityOfMistThemeCard),
    }
}

export function exportToTOML(themeCard: ThemeCardDocument): string {
    const payload = toThemeCardPayload(themeCard)
    const parsed = CityOfMistThemeCardSchema.safeParse(payload)

    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(parsed.data as any)
}
