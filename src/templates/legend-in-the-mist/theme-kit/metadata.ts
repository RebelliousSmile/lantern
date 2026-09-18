import type { TranslationKey } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. */
export const themeKitSections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'powerTags', label: 'legend:themeKit.sections.powerTags' },
    { id: 'weaknessTags', label: 'legend:themeKit.sections.weaknessTags' },
    { id: 'quest', label: 'legend:themeKit.sections.quest' },
    { id: 'improvements', label: 'legend:themeKit.sections.improvements' },
    { id: 'meta', label: 'legend:themeKit.sections.meta' },
]

export const themeKitZoomOptions = [0.75, 1, 1.25, 1.5]

export const themeKitBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
] as const
