import { otherscapePowerSetCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapePowerSetDocument, toOtherscapePowerSetPayload, type OtherscapePowerSet } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapePowerSet: OtherscapePowerSet
    warnings: string[]
} {
    const parsed = otherscapePowerSetCodec.parseToml(tomlText)
    return {
        otherscapePowerSet: carryCanonicalSource(toOtherscapePowerSetDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapePowerSet): string {
    return stringifyCanonical(otherscapePowerSetCodec, document, toOtherscapePowerSetPayload(document))
}
