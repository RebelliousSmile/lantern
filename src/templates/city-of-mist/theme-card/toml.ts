import type { CityOfMistThemeCard as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import type { ImportWarning } from '@/core/templates/types'
import {
    toThemeCardDocument,
    toThemeCardPayload,
    type ThemeCardDocument,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/city-of-mist/theme-card'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistThemeCard: ThemeCardDocument
    warnings: ImportWarning[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        cityOfMistThemeCard: carryCanonicalSource(
            toThemeCardDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: ThemeCardDocument): string {
    return stringifyCanonical(contract, document, toThemeCardPayload(document))
}
