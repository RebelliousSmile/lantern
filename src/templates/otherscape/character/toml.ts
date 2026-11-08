import type { OtherscapeCharacter as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import type { ImportWarning } from '@/core/templates/types'
import {
    toOtherscapeCharacterDocument,
    toOtherscapeCharacterPayload,
    type OtherscapeCharacter,
} from './model'
import { computeOtherscapeCharacterWarnings } from './warnings'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/character'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeCharacter: OtherscapeCharacter
    warnings: ImportWarning[]
} {
    const parsed = contract.parseToml(tomlText)
    const otherscapeCharacter = carryCanonicalSource(
        toOtherscapeCharacterDocument(parsed),
        parsed
    )
    return {
        otherscapeCharacter,
        warnings: computeOtherscapeCharacterWarnings(otherscapeCharacter),
    }
}

export function exportToTOML(document: OtherscapeCharacter): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeCharacterPayload(document)
    )
}
