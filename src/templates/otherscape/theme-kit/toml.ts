import { otherscapeThemeKitCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapeThemeKitDocument, toOtherscapeThemeKitPayload, type OtherscapeThemeKit } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeThemeKit: OtherscapeThemeKit
    warnings: string[]
} {
    const parsed = otherscapeThemeKitCodec.parseToml(tomlText)
    return {
        otherscapeThemeKit: carryCanonicalSource(toOtherscapeThemeKitDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeThemeKit): string {
    return stringifyCanonical(otherscapeThemeKitCodec, document, toOtherscapeThemeKitPayload(document))
}
