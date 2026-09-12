import type { OtherscapeChallenge as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toOtherscapeChallengeDocument,
    toOtherscapeChallengePayload,
    type OtherscapeChallenge,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/challenge'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeChallenge: OtherscapeChallenge
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapeChallenge: carryCanonicalSource(
            toOtherscapeChallengeDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeChallenge): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeChallengePayload(document)
    )
}
