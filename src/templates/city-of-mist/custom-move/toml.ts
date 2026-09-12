import type { CityOfMistCustomMove as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toCityOfMistCustomMoveDocument,
    toCityOfMistCustomMovePayload,
    type CityOfMistCustomMove,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/city-of-mist/custom-move'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistCustomMove: CityOfMistCustomMove
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        cityOfMistCustomMove: carryCanonicalSource(
            toCityOfMistCustomMoveDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: CityOfMistCustomMove): string {
    return stringifyCanonical(
        contract,
        document,
        toCityOfMistCustomMovePayload(document)
    )
}
