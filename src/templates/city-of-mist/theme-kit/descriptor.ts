import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { themeKitSections } from './metadata'
import {
    blankThemeKit,
    defaultThemeKitSheetState,
    defaultThemeKitView,
    type ThemeKitDocument,
    type ThemeKitViewState,
} from './model'
import { getSampleThemeKit } from './sample'

export const themeKitDescriptor: StaticTemplateDefinition<
    ThemeKitDocument,
    ThemeKitViewState,
    typeof defaultThemeKitSheetState
> = {
    id: 'city.themeKit',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:themeKit.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-kit',
    createBlank: blankThemeKit,
    createExample: getSampleThemeKit,
    createInitialView: () => cloneValue(defaultThemeKitView),
    createInitialSheet: () => cloneValue(defaultThemeKitSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Themebook',
    sections: themeKitSections,
    landing: {
        newTitle: 'city:themeKit.newTitle',
        description: 'city:themeKit.description',
    },
}
