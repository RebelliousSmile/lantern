import type { LegendInTheMistStoryTheme as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toLegendInTheMistStoryThemeDocument,
    toLegendInTheMistStoryThemePayload,
    type LegendInTheMistStoryTheme,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/legend-in-the-mist/story-theme'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        legendInTheMistStoryTheme: carryCanonicalSource(
            toLegendInTheMistStoryThemeDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistStoryTheme): string {
    return stringifyCanonical(
        contract,
        document,
        toLegendInTheMistStoryThemePayload(document)
    )
}
