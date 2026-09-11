import { otherscapeChallengeCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toOtherscapeChallengeDocument, toOtherscapeChallengePayload, type OtherscapeChallenge } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeChallenge: OtherscapeChallenge
    warnings: string[]
} {
    const parsed = otherscapeChallengeCodec.parseToml(tomlText)
    return {
        otherscapeChallenge: carryCanonicalSource(toOtherscapeChallengeDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: OtherscapeChallenge): string {
    return stringifyCanonical(otherscapeChallengeCodec, document, toOtherscapeChallengePayload(document))
}
