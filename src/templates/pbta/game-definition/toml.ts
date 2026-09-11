import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import {
    toGameDefinitionDocument,
    toGameDefinitionPayload,
    type PbtaGameDefinition,
} from './model'
import type { GameDefinition as Published } from './schema'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>('pbta/game-definition')

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    gameDefinition: PbtaGameDefinition
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        gameDefinition: carryCanonicalSource(
            toGameDefinitionDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: PbtaGameDefinition): string {
    return stringifyCanonical(
        contract,
        document,
        toGameDefinitionPayload(document)
    )
}
