import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import { toCityOfMistDangerDocument, type CityOfMistDanger } from './model'
import type { CityOfMistDanger as Published } from './schema'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/city-of-mist/danger'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistDanger: CityOfMistDanger
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        cityOfMistDanger: carryCanonicalSource(
            toCityOfMistDangerDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: CityOfMistDanger): string {
    return stringifyCanonical(contract, document, document)
}
