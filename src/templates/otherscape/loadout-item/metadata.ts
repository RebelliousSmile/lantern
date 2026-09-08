import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the regions are printed in. */
export const loadoutItemSections: Array<{ id: SectionId; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'featureTags', label: 'Feature tags' },
    { id: 'weaknessTag', label: 'Weakness tag' },
    { id: 'meta', label: 'Meta footer' },
]

export const loadoutItemZoomOptions = [0.75, 1, 1.25, 1.5]

export const loadoutItemBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
