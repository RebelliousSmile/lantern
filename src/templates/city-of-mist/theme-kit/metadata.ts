import type { Background, SectionId } from './model'

/* Printed order, which is also the order the appearance panel lists. The header
   is missing on purpose: the banner, the name and the keywords always print. */
export const themeKitSections: Array<{ id: SectionId; label: string }> = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'concept', label: 'Concept' },
    { id: 'powerTags', label: 'Power tag questions' },
    { id: 'weaknessTags', label: 'Weakness tag questions' },
    { id: 'extraTags', label: 'Extra tags' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'titleGuidance', label: 'Title guidance' },
    { id: 'crewRelationships', label: 'Crew relationships' },
    { id: 'improvements', label: 'Improvements' },
    { id: 'meta', label: 'Meta footer' },
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
