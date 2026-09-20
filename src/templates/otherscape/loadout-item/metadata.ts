import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: it is the card's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the regions are printed in. */
export const loadoutItemSections: Array<{ id: SectionId; label: UiText }> = [
    { id: 'description', label: 'otherscape:loadoutItem.sections.description' },
    { id: 'featureTags', label: 'otherscape:loadoutItem.sections.featureTags' },
    { id: 'weaknessTag', label: 'otherscape:loadoutItem.sections.weaknessTag' },
    { id: 'meta', label: 'otherscape:loadoutItem.sections.meta' },
]

export const loadoutItemZoomOptions = [0.75, 1, 1.25, 1.5]

export const loadoutItemBackgroundOptions: Array<{
    value: 'neon' | 'plain'
    label: UiText
}> = [
    {
        value: 'neon',
        label: 'otherscape:forms.loadoutItem.appearance.backgroundNeon',
    },
    {
        value: 'plain',
        label: 'otherscape:forms.loadoutItem.appearance.backgroundPlain',
    },
]
