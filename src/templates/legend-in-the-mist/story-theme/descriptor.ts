import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { storyThemeSections } from './metadata'
import {
    blankLegendInTheMistStoryTheme,
    defaultLegendInTheMistStoryThemeSheetState,
    defaultLegendInTheMistStoryThemeView,
    type LegendInTheMistStoryTheme,
    type LegendInTheMistStoryThemeViewState,
} from './model'
import { getSampleLegendInTheMistStoryTheme } from './sample'

export const storyThemeDescriptor: StaticTemplateDefinition<
    LegendInTheMistStoryTheme,
    LegendInTheMistStoryThemeViewState,
    typeof defaultLegendInTheMistStoryThemeSheetState
> = {
    id: 'legend.storyTheme',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:storyTheme.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/story-theme',
    createBlank: blankLegendInTheMistStoryTheme,
    createExample: getSampleLegendInTheMistStoryTheme,
    createInitialView: () => cloneValue(defaultLegendInTheMistStoryThemeView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistStoryThemeSheetState),
    getTabTitle: (doc) => doc.title_tag.trim() || 'Story Theme',
    sections: storyThemeSections,
    landing: {
        newTitle: 'legend:storyTheme.newTitle',
        description: 'landing.chooseStart',
    },
}
