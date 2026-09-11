import { cityOfMistCustomMoveCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toCityOfMistCustomMoveDocument, toCityOfMistCustomMovePayload, type CityOfMistCustomMove } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistCustomMove: CityOfMistCustomMove
    warnings: string[]
} {
    const parsed = cityOfMistCustomMoveCodec.parseToml(tomlText)
    return {
        cityOfMistCustomMove: carryCanonicalSource(toCityOfMistCustomMoveDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: CityOfMistCustomMove): string {
    return stringifyCanonical(cityOfMistCustomMoveCodec, document, toCityOfMistCustomMovePayload(document))
}
