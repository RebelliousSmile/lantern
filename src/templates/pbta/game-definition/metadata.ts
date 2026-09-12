import type { SectionId } from './model'

/* The zones the appearance panel can hide, in print order. The header (name,
   game slug, version) is not among them: a definition with no name is still
   a definition, so it always prints. */
export const gameDefinitionSections: Array<{ id: SectionId; label: string }> = [
    { id: 'roll', label: 'Roll' },
    { id: 'character', label: 'Character' },
    { id: 'npc', label: 'NPC' },
    { id: 'mc', label: 'MC' },
    { id: 'fronts', label: 'Fronts' },
]
