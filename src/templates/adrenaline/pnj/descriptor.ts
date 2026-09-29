import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { pnjSections } from '../shared/sections'
import { blankPnj, samplePnj } from './sample'

const descriptor: StaticTemplateDefinition<
    ReturnType<typeof blankPnj>,
    typeof defaultAdrenalineView,
    typeof emptyAdrenalineSheetState
> = {
    id: 'adrenaline.pnj',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:pnj.label',
    implemented: true,
    contractKey: 'adrenaline/pnj',
    createBlank: blankPnj,
    createExample: samplePnj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PNJ',
    sections: pnjSections,
    landing: {
        newTitle: 'adrenaline:pnj.newTitle',
        description: 'adrenaline:pnj.description',
    },
}

export default descriptor
