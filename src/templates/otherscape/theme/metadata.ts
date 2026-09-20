import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the regions are printed in. */
export const themeSections: Array<{ id: SectionId; label: UiText }> = [
    { id: 'powerTags', label: 'otherscape:theme.sections.powerTags' },
    { id: 'weaknessTags', label: 'otherscape:theme.sections.weaknessTags' },
    { id: 'quest', label: 'otherscape:theme.sections.quest' },
    { id: 'tracks', label: 'otherscape:theme.sections.tracks' },
    { id: 'meta', label: 'otherscape:theme.sections.meta' },
]

export const themeZoomOptions = [0.75, 1, 1.25, 1.5]

export const themeBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
