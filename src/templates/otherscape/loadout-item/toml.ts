import { otherscapeLoadoutItemCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapeLoadoutItemDocument, toOtherscapeLoadoutItemPayload, type OtherscapeLoadoutItem } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeLoadoutItem: OtherscapeLoadoutItem
    warnings: string[]
} {
    const parsed = otherscapeLoadoutItemCodec.parseToml(tomlText)
    return {
        otherscapeLoadoutItem: carryCanonicalSource(toOtherscapeLoadoutItemDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeLoadoutItem): string {
    return stringifyCanonical(otherscapeLoadoutItemCodec, document, toOtherscapeLoadoutItemPayload(document))
}
