import type { TranslationKey } from '@/i18n/text'
import type { Background, SectionId } from './model'

export const themeCardSections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'motivation', label: 'city:themeCard.sections.motivation' },
    { id: 'tracks', label: 'city:themeCard.sections.tracks' },
    { id: 'powerTags', label: 'city:themeCard.sections.powerTags' },
    { id: 'weaknessTags', label: 'city:themeCard.sections.weaknessTags' },
    { id: 'improvements', label: 'city:themeCard.sections.improvements' },
    { id: 'meta', label: 'city:themeCard.sections.meta' },
]

export const themeCardBackgroundOptions: Array<{
    value: Background
    label: TranslationKey
    color: string
}> = [
    {
        value: 'bg0',
        label: 'city:forms.shared.appearance.background.rose',
        color: 'hsl(0 17% 82%)',
    },
    {
        value: 'bg1',
        label: 'city:forms.shared.appearance.background.cream',
        color: 'hsl(42 38% 91%)',
    },
    {
        value: 'bg2',
        label: 'city:forms.shared.appearance.background.paper',
        color: 'hsl(42 38% 95%)',
    },
    {
        value: 'bg3',
        label: 'city:forms.shared.appearance.background.ochre',
        color: 'hsl(43 38% 82%)',
    },
    {
        value: 'bg4',
        label: 'city:forms.shared.appearance.background.sand',
        color: 'hsl(31 38% 88%)',
    },
    {
        value: 'bg5',
        label: 'city:forms.shared.appearance.background.lemon',
        color: 'hsl(57 38% 82%)',
    },
    {
        value: 'bg6',
        label: 'city:forms.shared.appearance.background.sage',
        color: 'hsl(78 14% 85%)',
    },
    {
        value: 'bg7',
        label: 'city:forms.shared.appearance.background.clay',
        color: 'hsl(26 15% 82%)',
    },
]
