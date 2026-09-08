import type { SectionId } from './model'

/* The header bar is not listed here: the name and the type are the card's top
   edge rather than a section, so they have no visibility toggle and always
   render. The order is the order the regions are printed in. */
export const powerSetSections: Array<{ id: SectionId; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'specials', label: 'Specials' },
    { id: 'threats', label: 'Threats' },
    { id: 'generalConsequences', label: 'General Consequences' },
    { id: 'meta', label: 'Meta footer' },
]

export const powerSetZoomOptions = [0.75, 1, 1.25, 1.5]

export const powerSetBackgroundOptions = [
    { value: 'neon', label: 'Neon' },
    { value: 'plain', label: 'Plain' },
] as const

/* The three sources a Power Set can draw on, in the order the books print
   them. Each drives the accent the sheet takes. */
export const powerSetTypeOptions = [
    { value: 'self', label: 'Self' },
    { value: 'mythos', label: 'Mythos' },
    { value: 'noise', label: 'Noise' },
] as const
