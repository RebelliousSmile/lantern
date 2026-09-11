import { otherscapeThemeCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapeThemeDocument, toOtherscapeThemePayload, type OtherscapeTheme } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeTheme: OtherscapeTheme
    warnings: string[]
} {
    const parsed = otherscapeThemeCodec.parseToml(tomlText)
    return {
        otherscapeTheme: carryCanonicalSource(toOtherscapeThemeDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeTheme): string {
    return stringifyCanonical(otherscapeThemeCodec, document, toOtherscapeThemePayload(document))
}
