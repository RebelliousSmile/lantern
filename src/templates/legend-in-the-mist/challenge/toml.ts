import { legendInTheMistChallengeCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toLegendInTheMistChallengeDocument, type LegendInTheMistChallenge } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistChallenge: LegendInTheMistChallenge
    warnings: string[]
} {
    const parsed = legendInTheMistChallengeCodec.parseToml(tomlText)
    return {
        legendInTheMistChallenge: carryCanonicalSource(toLegendInTheMistChallengeDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistChallenge): string {
    return stringifyCanonical(legendInTheMistChallengeCodec, document, document)
}
