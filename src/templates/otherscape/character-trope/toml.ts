import { otherscapeCharacterTropeCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapeCharacterTropeDocument, toOtherscapeCharacterTropePayload, type OtherscapeCharacterTrope } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeCharacterTrope: OtherscapeCharacterTrope
    warnings: string[]
} {
    const parsed = otherscapeCharacterTropeCodec.parseToml(tomlText)
    return {
        otherscapeCharacterTrope: carryCanonicalSource(toOtherscapeCharacterTropeDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeCharacterTrope): string {
    return stringifyCanonical(otherscapeCharacterTropeCodec, document, toOtherscapeCharacterTropePayload(document))
}
