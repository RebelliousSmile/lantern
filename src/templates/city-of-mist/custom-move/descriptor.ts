import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { customMoveSections } from './metadata'
import {
    blankCityOfMistCustomMove,
    defaultCityOfMistCustomMoveSheetState,
    defaultCityOfMistCustomMoveView,
    type CityOfMistCustomMove,
    type CityOfMistCustomMoveViewState,
} from './model'
import { getSampleCityOfMistCustomMove } from './sample'

export const customMoveDescriptor: StaticTemplateDefinition<
    CityOfMistCustomMove,
    CityOfMistCustomMoveViewState,
    typeof defaultCityOfMistCustomMoveSheetState
> = {
    id: 'city.customMove',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:customMove.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/custom-move',
    createBlank: blankCityOfMistCustomMove,
    createExample: getSampleCityOfMistCustomMove,
    createInitialView: () => cloneValue(defaultCityOfMistCustomMoveView),
    createInitialSheet: () => cloneValue(defaultCityOfMistCustomMoveSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Custom Move',
    sections: customMoveSections,
    landing: {
        newTitle: 'city:customMove.newTitle',
        description: 'city:customMove.description',
    },
}
