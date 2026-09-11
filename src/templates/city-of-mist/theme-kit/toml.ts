import { cityOfMistThemeKitCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toThemeKitDocument, toThemeKitPayload, type ThemeKitDocument } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistThemeKit: ThemeKitDocument
    warnings: string[]
} {
    const parsed = cityOfMistThemeKitCodec.parseToml(tomlText)
    return {
        cityOfMistThemeKit: carryCanonicalSource(toThemeKitDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: ThemeKitDocument): string {
    return stringifyCanonical(cityOfMistThemeKitCodec, document, toThemeKitPayload(document))
}
