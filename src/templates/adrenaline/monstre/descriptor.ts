import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { blankMonstre, sampleMonstre } from './sample'

const descriptor: StaticTemplateDefinition<
    ReturnType<typeof blankMonstre>,
    typeof defaultAdrenalineView,
    typeof emptyAdrenalineSheetState
> = {
    id: 'adrenaline.monstre',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:monstre.label',
    implemented: true,
    contractKey: 'adrenaline/monstre',
    createBlank: blankMonstre,
    createExample: sampleMonstre,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'Monstre',
    sections: [{ id: 'document', label: 'adrenaline:sections.document' }],
    landing: {
        newTitle: 'adrenaline:monstre.newTitle',
        description: 'adrenaline:monstre.description',
    },
}

export default descriptor
