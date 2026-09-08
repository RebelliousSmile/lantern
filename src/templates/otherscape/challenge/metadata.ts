import type { SectionId } from './model'

/* The header bar is not listed here: name and scale are the card's top edge
   rather than a section, so they have no visibility toggle and always render.
   The order is the order the regions are printed in. */
export const challengeSections: Array<{ id: SectionId; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'tagsStatuses', label: 'Tags & Statuses' },
    { id: 'limits', label: 'Limits' },
    { id: 'specials', label: 'Specials' },
    { id: 'threats', label: 'Threats' },
    { id: 'generalConsequences', label: 'General Consequences' },
    { id: 'meta', label: 'Meta footer' },
]

export const challengeZoomOptions = [0.75, 1, 1.25, 1.5]

export const challengeBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
