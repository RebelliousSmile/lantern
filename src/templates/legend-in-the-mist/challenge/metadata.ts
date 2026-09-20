import type { TranslationKey } from '@/i18n/text'
import type { SectionId } from './model'

export const challengeSections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'rolesDesc', label: 'legend:challenge.sections.rolesDesc' },
    { id: 'limits', label: 'legend:challenge.sections.limits' },
    { id: 'tagsStatuses', label: 'legend:challenge.sections.tagsStatuses' },
    { id: 'might', label: 'legend:challenge.sections.might' },
    {
        id: 'specialFeatures',
        label: 'legend:challenge.sections.specialFeatures',
    },
    { id: 'threats', label: 'legend:challenge.sections.threats' },
    {
        id: 'generalConsequences',
        label: 'legend:challenge.sections.generalConsequences',
    },
    { id: 'meta', label: 'legend:challenge.sections.meta' },
]

export const challengeZoomOptions = [0.75, 1, 1.25, 1.5]

export const challengeBackgroundOptions: Array<{
    value: 'parchment' | 'plain'
    label: TranslationKey
}> = [
    {
        value: 'parchment',
        label: 'legend:forms.challenge.appearancePanel.background.parchment',
    },
    {
        value: 'plain',
        label: 'legend:forms.challenge.appearancePanel.background.plain',
    },
    // Note: labels are display-only; the stored `value` stays English (view state, not doc).
]
