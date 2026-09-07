import type { JourneyType, SectionId } from './model'

/* The title band is not listed here: it carries the type tint that tells a
   landscape from an occasion, so it always renders and has no toggle. */
export const journeySections: Array<{ id: SectionId; label: string }> = [
    { id: 'description', label: 'Description' },
    { id: 'tags', label: 'Tags' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'consequences', label: 'General consequences' },
    { id: 'vignettes', label: 'Vignettes' },
    { id: 'meta', label: 'Meta footer' },
]

// The spread is wide, so the zoom range reaches further down than on the cards:
// a Journey at 100% rarely fits a laptop viewport whole.
export const journeyZoomOptions = [0.5, 0.75, 1, 1.25]

export const journeyBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
] as const

export const journeyTypeOptions: Array<{ value: JourneyType; label: string }> =
    [
        { value: 'landscape', label: 'Landscape' },
        { value: 'occasion', label: 'Occasion' },
        { value: 'undertaking', label: 'Undertaking' },
    ]

export const journeyTypeLabel: Record<JourneyType, string> = {
    landscape: 'Landscape',
    occasion: 'Occasion',
    undertaking: 'Undertaking',
}
