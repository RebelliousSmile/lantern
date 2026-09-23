import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { themeKitSections } from './metadata'
import {
    blankLegendInTheMistThemeKit,
    defaultLegendInTheMistThemeKitSheetState,
    defaultLegendInTheMistThemeKitView,
    type LegendInTheMistThemeKit,
    type LegendInTheMistThemeKitViewState,
} from './model'
import { getSampleLegendInTheMistThemeKit } from './sample'

export const themeKitDescriptor: StaticTemplateDefinition<
    LegendInTheMistThemeKit,
    LegendInTheMistThemeKitViewState,
    typeof defaultLegendInTheMistThemeKitSheetState
> = {
    id: 'legend.themeKit',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:themeKit.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/theme-kit',
    createBlank: blankLegendInTheMistThemeKit,
    createExample: getSampleLegendInTheMistThemeKit,
    createInitialView: () => cloneValue(defaultLegendInTheMistThemeKitView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistThemeKitSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Theme Kit',
    sections: themeKitSections,
    landing: {
        newTitle: 'legend:themeKit.newTitle',
        description: 'legend:themeKit.description',
    },
}
