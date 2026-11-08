import type { UiText } from '@/i18n/text'
import type { SectionId } from './model'

/* The name is not listed here: it is the sheet's top edge rather than a
   section, so it has no visibility toggle and always renders. The order is the
   order the bands are printed in. */
export const characterSections: Array<{ id: SectionId; label: UiText }> = [
    { id: 'upgrades', label: 'otherscape:character.sections.upgrades' },
    { id: 'combos', label: 'otherscape:character.sections.combos' },
    { id: 'loadout', label: 'otherscape:character.sections.loadout' },
    { id: 'themes', label: 'otherscape:character.sections.themes' },
    { id: 'meta', label: 'otherscape:character.sections.meta' },
]

export const characterZoomOptions = [0.5, 0.75, 1, 1.25]

export const characterBackgroundOptions = [
    {
        value: 'neon',
        label: 'otherscape:forms.character.appearance.background.neon',
    },
    {
        value: 'plain',
        label: 'otherscape:forms.character.appearance.background.plain',
    },
] as const
