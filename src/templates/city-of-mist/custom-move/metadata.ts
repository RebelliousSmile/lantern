import type { Background, SectionId } from './model'

/* The zones the appearance panel can hide, in print order. The move header is
   not among them: a card is its name and its kind, so it always prints. */
export const customMoveSections: Array<{ id: SectionId; label: string }> = [
    { id: 'trigger', label: 'Trigger' },
    { id: 'roll', label: 'Roll' },
    { id: 'outcomes', label: 'Outcomes' },
    { id: 'meta', label: 'Meta footer' },
]

/* The same eight papers the Danger offers, so a swatch picks the same ground on
   every City card. The values live in `shared/tokens.css`; these are the labels
   and the previews the picker prints. */
export const customMoveBackgroundOptions: Array<{
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
