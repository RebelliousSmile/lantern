import type { OtherscapePowerSet as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toOtherscapePowerSetDocument,
    toOtherscapePowerSetPayload,
    type OtherscapePowerSet,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/power-set'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapePowerSet: OtherscapePowerSet
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapePowerSet: carryCanonicalSource(
            toOtherscapePowerSetDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapePowerSet): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapePowerSetPayload(document)
    )
}
