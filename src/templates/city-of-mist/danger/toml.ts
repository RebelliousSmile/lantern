import { cityOfMistDangerCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toCityOfMistDangerDocument, type CityOfMistDanger } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistDanger: CityOfMistDanger
    warnings: string[]
} {
    const parsed = cityOfMistDangerCodec.parseToml(tomlText)
    return {
        cityOfMistDanger: carryCanonicalSource(toCityOfMistDangerDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: CityOfMistDanger): string {
    return stringifyCanonical(cityOfMistDangerCodec, document, document)
}
