import { cityOfMistThemeCardCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toThemeCardDocument, toThemeCardPayload, type ThemeCardDocument } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistThemeCard: ThemeCardDocument
    warnings: string[]
} {
    const parsed = cityOfMistThemeCardCodec.parseToml(tomlText)
    return {
        cityOfMistThemeCard: carryCanonicalSource(toThemeCardDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: ThemeCardDocument): string {
    return stringifyCanonical(cityOfMistThemeCardCodec, document, toThemeCardPayload(document))
}
