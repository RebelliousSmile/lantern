import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. */
export const themeKitSections: Array<{ id: SectionId; label: string }> = [
    { id: 'powerTags', label: 'Power tags' },
    { id: 'weaknessTags', label: 'Weakness tags' },
    { id: 'quest', label: 'Quest' },
    { id: 'improvements', label: 'Improvements' },
    { id: 'meta', label: 'Meta footer' },
]

export const themeKitZoomOptions = [0.75, 1, 1.25, 1.5]

export const themeKitBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
] as const
