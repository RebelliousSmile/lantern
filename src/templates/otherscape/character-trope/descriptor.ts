import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { characterTropeSections } from './metadata'
import { blankOtherscapeCharacterTrope, defaultOtherscapeCharacterTropeSheetState, defaultOtherscapeCharacterTropeView, type OtherscapeCharacterTrope, type OtherscapeCharacterTropeSheetState, type OtherscapeCharacterTropeViewState } from './model'
import { getSampleOtherscapeCharacterTrope } from './sample'

const descriptor: StaticTemplateDefinition<OtherscapeCharacterTrope, OtherscapeCharacterTropeViewState, OtherscapeCharacterTropeSheetState> = {
    id: 'otherscape.characterTrope', gameId: 'otherscape', gameLabel: ':Otherscape', label: 'otherscape:characterTrope.label', implemented: true,
    contractKey: 'mist/otherscape/character-trope', createBlank: blankOtherscapeCharacterTrope, createExample: getSampleOtherscapeCharacterTrope,
    createInitialView: () => cloneValue(defaultOtherscapeCharacterTropeView), createInitialSheet: () => cloneValue(defaultOtherscapeCharacterTropeSheetState),
    getTabTitle: (doc: OtherscapeCharacterTrope) => doc.name.trim() || 'Character Trope', sections: characterTropeSections,
    landing: { newTitle: 'otherscape:characterTrope.newTitle', description: 'otherscape:characterTrope.description' },
}

export default descriptor
