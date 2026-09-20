import type { TranslationKey } from '@/i18n/text'
import type { Background, SectionId } from './model'

export const dangerSections: Array<{ id: SectionId; label: TranslationKey }> = [
    { id: 'description', label: 'city:danger.sections.description' },
    { id: 'spectrums', label: 'city:danger.sections.spectrums' },
    { id: 'customMoves', label: 'city:danger.sections.customMoves' },
    { id: 'hardMoves', label: 'city:danger.sections.hardMoves' },
    { id: 'softMoves', label: 'city:danger.sections.softMoves' },
    { id: 'meta', label: 'city:danger.sections.meta' },
]

export const dangerBackgroundOptions: Array<{
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
