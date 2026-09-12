import type { OtherscapeThemeKit as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toOtherscapeThemeKitDocument,
    toOtherscapeThemeKitPayload,
    type OtherscapeThemeKit,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/otherscape/theme-kit'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeThemeKit: OtherscapeThemeKit
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapeThemeKit: carryCanonicalSource(
            toOtherscapeThemeKitDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeThemeKit): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeThemeKitPayload(document)
    )
}
