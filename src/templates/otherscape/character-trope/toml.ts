import type { OtherscapeCharacterTrope as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toOtherscapeCharacterTropeDocument,
    toOtherscapeCharacterTropePayload,
    type OtherscapeCharacterTrope,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/character-trope'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeCharacterTrope: OtherscapeCharacterTrope
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapeCharacterTrope: carryCanonicalSource(
            toOtherscapeCharacterTropeDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeCharacterTrope): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeCharacterTropePayload(document)
    )
}
