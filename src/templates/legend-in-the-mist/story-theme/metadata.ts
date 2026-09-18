import type { TranslationKey } from '@/i18n/text'
import type { SectionId } from './model'

export const storyThemeSections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'category', label: 'legend:storyTheme.sections.category' },
    { id: 'powerTags', label: 'legend:storyTheme.sections.powerTags' },
    { id: 'weaknessTags', label: 'legend:storyTheme.sections.weaknessTags' },
    { id: 'quest', label: 'legend:storyTheme.sections.quest' },
    { id: 'meta', label: 'legend:storyTheme.sections.meta' },
]

export const storyThemeZoomOptions = [0.75, 1, 1.25, 1.5]

export const storyThemeBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
] as const
