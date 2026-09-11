import { legendInTheMistStoryThemeCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toLegendInTheMistStoryThemeDocument, toLegendInTheMistStoryThemePayload, type LegendInTheMistStoryTheme } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
    warnings: string[]
} {
    const parsed = legendInTheMistStoryThemeCodec.parseToml(tomlText)
    return {
        legendInTheMistStoryTheme: carryCanonicalSource(toLegendInTheMistStoryThemeDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistStoryTheme): string {
    return stringifyCanonical(legendInTheMistStoryThemeCodec, document, toLegendInTheMistStoryThemePayload(document))
}
