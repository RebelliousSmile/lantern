import type { SectionId } from './model'

export const storyThemeSections: Array<{ id: SectionId; label: string }> = [
    { id: 'category', label: 'Category' },
    { id: 'powerTags', label: 'Power tags' },
    { id: 'weaknessTags', label: 'Weakness tags' },
    { id: 'quest', label: 'Quest & tracks' },
    { id: 'meta', label: 'Meta footer' },
]

export const storyThemeZoomOptions = [0.75, 1, 1.25, 1.5]

export const storyThemeBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
] as const
