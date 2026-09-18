import type { OtherscapeLoadoutItem as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import type { ImportWarning } from '@/core/templates/types'
import {
    toOtherscapeLoadoutItemDocument,
    toOtherscapeLoadoutItemPayload,
    type OtherscapeLoadoutItem,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/loadout-item'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeLoadoutItem: OtherscapeLoadoutItem
    warnings: ImportWarning[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapeLoadoutItem: carryCanonicalSource(
            toOtherscapeLoadoutItemDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeLoadoutItem): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeLoadoutItemPayload(document)
    )
}
