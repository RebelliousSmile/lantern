import type { LegendInTheMistThemeKit as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toLegendInTheMistThemeKitDocument,
    toLegendInTheMistThemeKitPayload,
    type LegendInTheMistThemeKit,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/legend-in-the-mist/theme-kit'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistThemeKit: LegendInTheMistThemeKit
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        legendInTheMistThemeKit: carryCanonicalSource(
            toLegendInTheMistThemeKitDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistThemeKit): string {
    return stringifyCanonical(
        contract,
        document,
        toLegendInTheMistThemeKitPayload(document)
    )
}
