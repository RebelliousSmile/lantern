import type { TranslationKey } from '@/i18n/text'
import type { Background, JourneyType, SectionId } from './model'

/* The title band is not listed here: it carries the type tint that tells a
   landscape from an occasion, so it always renders and has no toggle. */
export const journeySections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'description', label: 'legend:journey.sections.description' },
    { id: 'tags', label: 'legend:journey.sections.tags' },
    { id: 'benefits', label: 'legend:journey.sections.benefits' },
    { id: 'consequences', label: 'legend:journey.sections.consequences' },
    { id: 'vignettes', label: 'legend:journey.sections.vignettes' },
    { id: 'meta', label: 'legend:journey.sections.meta' },
]

// The spread is wide, so the zoom range reaches further down than on the cards:
// a Journey at 100% rarely fits a laptop viewport whole.
export const journeyZoomOptions = [0.5, 0.75, 1, 1.25]

export const journeyBackgroundOptions: Array<{
    value: Background
    label: TranslationKey
}> = [
    {
        value: 'parchment',
        label: 'legend:forms.journey.appearance.backgroundOptions.parchment',
    },
    {
        value: 'plain',
        label: 'legend:forms.journey.appearance.backgroundOptions.plain',
    },
]

export const journeyTypeOptions: Array<{
    value: JourneyType
    label: TranslationKey
}> = [
    {
        value: 'landscape',
        label: 'legend:forms.journey.basic.typeOptions.landscape',
    },
    {
        value: 'occasion',
        label: 'legend:forms.journey.basic.typeOptions.occasion',
    },
    {
        value: 'undertaking',
        label: 'legend:forms.journey.basic.typeOptions.undertaking',
    },
]

export const journeyTypeLabel: Record<JourneyType, string> = {
    landscape: 'Landscape',
    occasion: 'Occasion',
    undertaking: 'Undertaking',
}
