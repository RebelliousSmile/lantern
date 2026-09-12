import type { LegendInTheMistJourney as Published } from '@/contracts/mist-engine'
import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/mist-engine'
import { documentContracts } from '@/contracts/registry'
import {
    toLegendInTheMistJourneyDocument,
    toLegendInTheMistJourneyPayload,
    type LegendInTheMistJourney,
} from './model'

/* Resolved at module load: an unknown key fails here, not at the first import. */
const contract = documentContracts.require<Published>(
    'mist/legend-in-the-mist/journey'
)

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistJourney: LegendInTheMistJourney
    warnings: string[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        legendInTheMistJourney: carryCanonicalSource(
            toLegendInTheMistJourneyDocument(parsed),
            parsed
        ),
        warnings: [],
    }
}

export function exportToTOML(document: LegendInTheMistJourney): string {
    return stringifyCanonical(
        contract,
        document,
        toLegendInTheMistJourneyPayload(document)
    )
}
