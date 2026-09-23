import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { loadoutItemSections } from './metadata'
import { blankOtherscapeLoadoutItem, defaultOtherscapeLoadoutItemSheetState, defaultOtherscapeLoadoutItemView, type OtherscapeLoadoutItem, type OtherscapeLoadoutItemSheetState, type OtherscapeLoadoutItemViewState } from './model'
import { getSampleOtherscapeLoadoutItem } from './sample'

const descriptor: StaticTemplateDefinition<OtherscapeLoadoutItem, OtherscapeLoadoutItemViewState, OtherscapeLoadoutItemSheetState> = {
    id: 'otherscape.loadoutItem', gameId: 'otherscape', gameLabel: ':Otherscape', label: 'otherscape:loadoutItem.label', implemented: true,
    contractKey: 'mist/otherscape/loadout-item', createBlank: blankOtherscapeLoadoutItem, createExample: getSampleOtherscapeLoadoutItem,
    createInitialView: () => cloneValue(defaultOtherscapeLoadoutItemView), createInitialSheet: () => cloneValue(defaultOtherscapeLoadoutItemSheetState),
    getTabTitle: (doc: OtherscapeLoadoutItem) => doc.name.trim() || 'Loadout Item', sections: loadoutItemSections,
    landing: { newTitle: 'otherscape:loadoutItem.newTitle', description: 'otherscape:loadoutItem.description' },
}

export default descriptor
