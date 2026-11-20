import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { relationsSections } from '../shared/sections'
import { blankRelations, sampleRelations } from './sample'

const descriptor: StaticTemplateDefinition<
    ReturnType<typeof blankRelations>,
    typeof defaultAdrenalineView,
    typeof emptyAdrenalineSheetState
> = {
    id: 'adrenaline.relations',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:relations.label',
    implemented: true,
    contractKey: 'adrenaline/relations',
    createBlank: blankRelations,
    createExample: sampleRelations,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) =>
        (doc as { personnage?: string }).personnage?.trim() || 'Relations',
    sections: relationsSections,
    landing: {
        newTitle: 'adrenaline:relations.newTitle',
        description: 'adrenaline:relations.description',
    },
}

export default descriptor
