import type { CityOfMistThemeKit as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toThemeKitDocument,
    toThemeKitPayload,
    type ThemeKitDocument,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/city-of-mist/theme-kit'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistThemeKit: ThemeKitDocument
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        cityOfMistThemeKit: carryCanonicalSource(
            toThemeKitDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: ThemeKitDocument): string {
    return stringifyCanonical(contract, document, toThemeKitPayload(document))
}
