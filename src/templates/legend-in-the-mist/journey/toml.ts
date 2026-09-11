import { legendInTheMistJourneyCodec } from 'schema-in-the-mist'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { toLegendInTheMistJourneyDocument, toLegendInTheMistJourneyPayload, type LegendInTheMistJourney } from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistJourney: LegendInTheMistJourney
    warnings: string[]
} {
    const parsed = legendInTheMistJourneyCodec.parseToml(tomlText)
    return {
        legendInTheMistJourney: carryCanonicalSource(toLegendInTheMistJourneyDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistJourney): string {
    return stringifyCanonical(legendInTheMistJourneyCodec, document, toLegendInTheMistJourneyPayload(document))
}
