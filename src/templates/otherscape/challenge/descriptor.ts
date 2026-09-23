import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { challengeSections } from './metadata'
import {
    blankOtherscapeChallenge,
    defaultOtherscapeChallengeSheetState,
    defaultOtherscapeChallengeView,
    type OtherscapeChallenge,
    type OtherscapeChallengeSheetState,
    type OtherscapeChallengeViewState,
} from './model'
import { getSampleOtherscapeChallenge } from './sample'

const descriptor: StaticTemplateDefinition<
    OtherscapeChallenge,
    OtherscapeChallengeViewState,
    OtherscapeChallengeSheetState
> = {
    id: 'otherscape.challenge', gameId: 'otherscape', gameLabel: ':Otherscape',
    label: 'otherscape:challenge.label', implemented: true,
    contractKey: 'mist/otherscape/challenge', createBlank: blankOtherscapeChallenge,
    createExample: getSampleOtherscapeChallenge,
    createInitialView: () => cloneValue(defaultOtherscapeChallengeView),
    createInitialSheet: () => cloneValue(defaultOtherscapeChallengeSheetState),
    getTabTitle: (doc: OtherscapeChallenge) => doc.name.trim() || 'Challenge',
    sections: challengeSections,
    landing: { newTitle: 'otherscape:challenge.newTitle', description: 'otherscape:challenge.description' },
}

export default descriptor
