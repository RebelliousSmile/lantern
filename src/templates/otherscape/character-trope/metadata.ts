import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The header bar is not listed here: the name and the category are the card's
   top edge rather than a section, so they have no visibility toggle and always
   render. The order is the order the regions are printed in. */
export const characterTropeSections: Array<{ id: SectionId; label: UiText }> = [
    {
        id: 'description',
        label: 'otherscape:characterTrope.sections.description',
    },
    { id: 'themeKits', label: 'otherscape:characterTrope.sections.themeKits' },
    { id: 'choices', label: 'otherscape:characterTrope.sections.choices' },
    { id: 'loadout', label: 'otherscape:characterTrope.sections.loadout' },
    { id: 'meta', label: 'otherscape:characterTrope.sections.meta' },
]

export const characterTropeZoomOptions = [0.75, 1, 1.25, 1.5]

export const characterTropeBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const
