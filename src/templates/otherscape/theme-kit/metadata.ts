import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the regions are printed in. */
export const themeKitSections: Array<{ id: SectionId; label: string }> = [
    { id: 'powerTags', label: 'Power tags' },
    { id: 'weaknessTags', label: 'Weakness tags' },
    { id: 'quest', label: 'Quest' },
    { id: 'meta', label: 'Meta footer' },
]

export const themeKitZoomOptions = [0.75, 1, 1.25, 1.5]

export const themeKitBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
