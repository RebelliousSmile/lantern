import { legendInTheMistThemeKitCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toLegendInTheMistThemeKitDocument, toLegendInTheMistThemeKitPayload, type LegendInTheMistThemeKit } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistThemeKit: LegendInTheMistThemeKit
    warnings: string[]
} {
    const parsed = legendInTheMistThemeKitCodec.parseToml(tomlText)
    return {
        legendInTheMistThemeKit: carryCanonicalSource(toLegendInTheMistThemeKitDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistThemeKit): string {
    return stringifyCanonical(legendInTheMistThemeKitCodec, document, toLegendInTheMistThemeKitPayload(document))
}
