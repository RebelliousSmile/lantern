import type { TranslationKey } from '@/i18n/text'
import type { SectionId } from './model'

export const playbookSections: Array<{ id: SectionId; label: TranslationKey }> =
    [
        { id: 'stats', label: 'pbta:playbook.sections.stats' },
        { id: 'moves', label: 'pbta:playbook.sections.moves' },
        { id: 'choiceSets', label: 'pbta:playbook.sections.choiceSets' },
        { id: 'advancement', label: 'pbta:playbook.sections.advancement' },
        { id: 'creation', label: 'pbta:playbook.sections.creation' },
        { id: 'gear', label: 'pbta:playbook.sections.gear' },
    ]
