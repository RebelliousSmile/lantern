import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { gameDefinitionSections } from './metadata'
import {
    blankGameDefinition,
    defaultGameDefinitionSheetState,
    defaultGameDefinitionView,
    type GameDefinitionViewState,
    type PbtaGameDefinition,
} from './model'
import { getSamplePbtaGameDefinition } from './sample'

export const staticDefinition: StaticTemplateDefinition<
    PbtaGameDefinition,
    GameDefinitionViewState,
    typeof defaultGameDefinitionSheetState
> = {
    id: 'pbta.gameDefinition',
    gameId: 'apocalypse-world',
    gameLabel: 'Apocalypse World',
    label: 'pbta:gameDefinition.label',
    implemented: true,
    contractKey: 'pbta/game-definition',
    createBlank: blankGameDefinition,
    createExample: getSamplePbtaGameDefinition,
    createInitialView: () => cloneValue(defaultGameDefinitionView),
    createInitialSheet: () => cloneValue(defaultGameDefinitionSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Game Definition',
    sections: gameDefinitionSections,
    landing: {
        newTitle: 'pbta:gameDefinition.newTitle',
        description: 'pbta:gameDefinition.description',
    },
}

export default staticDefinition
