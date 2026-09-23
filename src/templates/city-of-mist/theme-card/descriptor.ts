import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { themeCardSections } from './metadata'
import {
    blankThemeCard,
    defaultThemeCardSheetState,
    defaultThemeCardView,
    type ThemeCardDocument,
    type ThemeCardViewState,
} from './model'
import { getSampleThemeCard } from './sample'

export const themeCardDescriptor: StaticTemplateDefinition<
    ThemeCardDocument,
    ThemeCardViewState,
    typeof defaultThemeCardSheetState
> = {
    id: 'city.themeCard',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:themeCard.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-card',
    createBlank: blankThemeCard,
    createExample: getSampleThemeCard,
    createInitialView: () => cloneValue(defaultThemeCardView),
    createInitialSheet: () => cloneValue(defaultThemeCardSheetState),
    getTabTitle: (doc) => doc.title.trim() || 'Theme Card',
    sections: themeCardSections,
    landing: {
        newTitle: 'city:themeCard.newTitle',
        description: 'city:themeCard.description',
    },
}
