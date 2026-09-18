import type { TranslationKey } from '@/i18n/text'
import type { SectionId } from './model'

/* The zones the appearance panel can hide, in print order. The header (name,
   game slug, version) is not among them: a definition with no name is still
   a definition, so it always prints. */
export const gameDefinitionSections: Array<{
    id: SectionId
    label: TranslationKey
}> = [
    { id: 'roll', label: 'pbta:gameDefinition.sections.roll' },
    { id: 'character', label: 'pbta:gameDefinition.sections.character' },
    { id: 'npc', label: 'pbta:gameDefinition.sections.npc' },
    { id: 'mc', label: 'pbta:gameDefinition.sections.mc' },
    { id: 'fronts', label: 'pbta:gameDefinition.sections.fronts' },
]
