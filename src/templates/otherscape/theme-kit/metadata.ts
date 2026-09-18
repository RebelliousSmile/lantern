import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the regions are printed in. */
export const themeKitSections: Array<{ id: SectionId; label: UiText }> = [
    { id: 'powerTags', label: 'otherscape:themeKit.sections.powerTags' },
    { id: 'weaknessTags', label: 'otherscape:themeKit.sections.weaknessTags' },
    { id: 'quest', label: 'otherscape:themeKit.sections.quest' },
    { id: 'meta', label: 'otherscape:themeKit.sections.meta' },
]

export const themeKitZoomOptions = [0.75, 1, 1.25, 1.5]

export const themeKitBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
