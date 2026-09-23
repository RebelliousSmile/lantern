import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { journeySections } from './metadata'
import {
    blankLegendInTheMistJourney,
    defaultLegendInTheMistJourneySheetState,
    defaultLegendInTheMistJourneyView,
    type LegendInTheMistJourney,
    type LegendInTheMistJourneyViewState,
} from './model'
import { getSampleLegendInTheMistJourney } from './sample'

export const journeyDescriptor: StaticTemplateDefinition<
    LegendInTheMistJourney,
    LegendInTheMistJourneyViewState,
    typeof defaultLegendInTheMistJourneySheetState
> = {
    id: 'legend.journey',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:journey.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/journey',
    createBlank: blankLegendInTheMistJourney,
    createExample: getSampleLegendInTheMistJourney,
    createInitialView: () => cloneValue(defaultLegendInTheMistJourneyView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistJourneySheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Journey',
    sections: journeySections,
    landing: {
        newTitle: 'legend:journey.newTitle',
        description: 'legend:journey.description',
    },
}
