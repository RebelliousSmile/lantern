import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { powerSetSections } from './metadata'
import { blankOtherscapePowerSet, defaultOtherscapePowerSetSheetState, defaultOtherscapePowerSetView, type OtherscapePowerSet, type OtherscapePowerSetSheetState, type OtherscapePowerSetViewState } from './model'
import { getSampleOtherscapePowerSet } from './sample'

const descriptor: StaticTemplateDefinition<OtherscapePowerSet, OtherscapePowerSetViewState, OtherscapePowerSetSheetState> = {
    id: 'otherscape.powerSet', gameId: 'otherscape', gameLabel: ':Otherscape', label: 'otherscape:powerSet.label', implemented: true,
    contractKey: 'mist/otherscape/power-set', createBlank: blankOtherscapePowerSet, createExample: getSampleOtherscapePowerSet,
    createInitialView: () => cloneValue(defaultOtherscapePowerSetView), createInitialSheet: () => cloneValue(defaultOtherscapePowerSetSheetState),
    getTabTitle: (doc: OtherscapePowerSet) => doc.name.trim() || 'Power Set', sections: powerSetSections,
    landing: { newTitle: 'otherscape:powerSet.newTitle', description: 'otherscape:powerSet.description' },
}

export default descriptor
