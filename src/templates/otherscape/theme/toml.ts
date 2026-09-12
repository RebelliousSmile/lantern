import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toOtherscapeThemeDocument,
    toOtherscapeThemePayload,
    type OtherscapeTheme,
} from './model'
import type { OtherscapeTheme as Published } from './schema'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>('mist/otherscape/theme')

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeTheme: OtherscapeTheme
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        otherscapeTheme: carryCanonicalSource(
            toOtherscapeThemeDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeTheme): string {
    return stringifyCanonical(
        contract,
        document,
        toOtherscapeThemePayload(document)
    )
}
