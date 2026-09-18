import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: name and scale are the card's top edge
   rather than a section, so they have no visibility toggle and always render.
   The order is the order the regions are printed in. */
export const challengeSections: Array<{ id: SectionId; label: UiText }> = [
    { id: 'description', label: 'otherscape:challenge.sections.description' },
    { id: 'tagsStatuses', label: 'otherscape:challenge.sections.tagsStatuses' },
    { id: 'limits', label: 'otherscape:challenge.sections.limits' },
    { id: 'specials', label: 'otherscape:challenge.sections.specials' },
    { id: 'threats', label: 'otherscape:challenge.sections.threats' },
    {
        id: 'generalConsequences',
        label: 'otherscape:challenge.sections.generalConsequences',
    },
    { id: 'meta', label: 'otherscape:challenge.sections.meta' },
]

export const challengeZoomOptions = [0.75, 1, 1.25, 1.5]

export const challengeBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
