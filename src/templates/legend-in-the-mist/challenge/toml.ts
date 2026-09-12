import type { LegendInTheMistChallenge as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toLegendInTheMistChallengeDocument,
    type LegendInTheMistChallenge,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/legend-in-the-mist/challenge'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistChallenge: LegendInTheMistChallenge
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        legendInTheMistChallenge: carryCanonicalSource(
            toLegendInTheMistChallengeDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistChallenge): string {
    return stringifyCanonical(contract, document, document)
}
