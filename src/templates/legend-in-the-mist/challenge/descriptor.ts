import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { migrateLegacyChallengeWorkspace } from './legacyWorkspaceMigration'
import { challengeSections } from './metadata'
import {
    blankLegendInTheMistChallenge,
    defaultLegendInTheMistChallengeSheetState,
    defaultLegendInTheMistChallengeView,
    type LegendInTheMistChallenge,
    type LegendInTheMistChallengeViewState,
} from './model'
import { getSampleLegendInTheMistChallenge } from './sample'

export const challengeDescriptor: StaticTemplateDefinition<
    LegendInTheMistChallenge,
    LegendInTheMistChallengeViewState,
    typeof defaultLegendInTheMistChallengeSheetState
> = {
    id: 'legend.challenge',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:challenge.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/challenge',
    createBlank: blankLegendInTheMistChallenge,
    createExample: getSampleLegendInTheMistChallenge,
    createInitialView: () => cloneValue(defaultLegendInTheMistChallengeView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistChallengeSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Challenge',
    legacyWorkspaceMigration: {
        storageKey: 'litm:challenge:v2',
        migrate: migrateLegacyChallengeWorkspace,
    },
    sections: challengeSections,
    landing: {
        newTitle: 'legend:challenge.newTitle',
        description: 'landing.chooseStart',
    },
}
