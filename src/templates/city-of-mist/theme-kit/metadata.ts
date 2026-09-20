import type { TranslationKey } from '@/i18n/text'
import type { Background, SectionId } from './model'

/* Printed order, which is also the order the appearance panel lists. The header
   is missing on purpose: the banner, the name and the keywords always print. */
export const themeKitSections: Array<{ id: SectionId; label: TranslationKey }> =
    [
        { id: 'introduction', label: 'city:themeKit.sections.introduction' },
        { id: 'concept', label: 'city:themeKit.sections.concept' },
        { id: 'powerTags', label: 'city:themeKit.sections.powerTags' },
        { id: 'weaknessTags', label: 'city:themeKit.sections.weaknessTags' },
        { id: 'extraTags', label: 'city:themeKit.sections.extraTags' },
        { id: 'motivation', label: 'city:themeKit.sections.motivation' },
        { id: 'titleGuidance', label: 'city:themeKit.sections.titleGuidance' },
        {
            id: 'crewRelationships',
            label: 'city:themeKit.sections.crewRelationships',
        },
        { id: 'improvements', label: 'city:themeKit.sections.improvements' },
        { id: 'meta', label: 'city:themeKit.sections.meta' },
    ]

export const themeKitBackgroundOptions: Array<{
    value: Background
    label: string
    color: string
}> = [
    { value: 'bg0', label: 'Rose', color: 'hsl(0 17% 82%)' },
    { value: 'bg1', label: 'Cream', color: 'hsl(42 38% 91%)' },
    { value: 'bg2', label: 'Paper', color: 'hsl(42 38% 95%)' },
    { value: 'bg3', label: 'Ochre', color: 'hsl(43 38% 82%)' },
    { value: 'bg4', label: 'Sand', color: 'hsl(31 38% 88%)' },
    { value: 'bg5', label: 'Lemon', color: 'hsl(57 38% 82%)' },
    { value: 'bg6', label: 'Sage', color: 'hsl(78 14% 85%)' },
    { value: 'bg7', label: 'Clay', color: 'hsl(26 15% 82%)' },
]
