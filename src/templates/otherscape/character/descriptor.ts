import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { characterSections } from './metadata'
import {
    blankOtherscapeCharacter,
    defaultOtherscapeCharacterSheetState,
    defaultOtherscapeCharacterView,
    type OtherscapeCharacter,
    type OtherscapeCharacterSheetState,
    type OtherscapeCharacterViewState,
} from './model'
import { getSampleOtherscapeCharacter } from './sample'

const descriptor: StaticTemplateDefinition<
    OtherscapeCharacter,
    OtherscapeCharacterViewState,
    OtherscapeCharacterSheetState
> = {
    id: 'otherscape.character',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:character.label',
    implemented: true,
    contractKey: 'mist/otherscape/character',
    createBlank: blankOtherscapeCharacter,
    createExample: getSampleOtherscapeCharacter,
    createInitialView: () => cloneValue(defaultOtherscapeCharacterView),
    createInitialSheet: () => cloneValue(defaultOtherscapeCharacterSheetState),
    getTabTitle: (doc: OtherscapeCharacter) => doc.name.trim() || 'Character',
    sections: characterSections,
    landing: {
        newTitle: 'otherscape:character.newTitle',
        description: 'otherscape:character.description',
    },
}

export default descriptor
