import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { dangerSections } from './metadata'
import {
    blankCityOfMistDanger,
    defaultCityOfMistDangerSheetState,
    defaultCityOfMistDangerView,
    type CityOfMistDanger,
    type CityOfMistDangerViewState,
} from './model'
import { getSampleCityOfMistDanger } from './sample'

export const dangerDescriptor: StaticTemplateDefinition<
    CityOfMistDanger,
    CityOfMistDangerViewState,
    typeof defaultCityOfMistDangerSheetState
> = {
    id: 'city.danger',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:danger.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/danger',
    createBlank: blankCityOfMistDanger,
    createExample: getSampleCityOfMistDanger,
    createInitialView: () => cloneValue(defaultCityOfMistDangerView),
    createInitialSheet: () => cloneValue(defaultCityOfMistDangerSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Danger',
    sections: dangerSections,
    landing: {
        newTitle: 'city:danger.newTitle',
        description: 'landing.chooseStart',
    },
}
