import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { blankPj, samplePj } from './sample'

const descriptor: StaticTemplateDefinition<
    ReturnType<typeof blankPj>,
    typeof defaultAdrenalineView,
    typeof emptyAdrenalineSheetState
> = {
    id: 'adrenaline.pj',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:pj.label',
    implemented: true,
    contractKey: 'adrenaline/pj',
    createBlank: blankPj,
    createExample: samplePj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PJ',
    sections: [{ id: 'document', label: 'adrenaline:sections.document' }],
    landing: {
        newTitle: 'adrenaline:pj.newTitle',
        description: 'adrenaline:pj.description',
    },
}

export default descriptor
