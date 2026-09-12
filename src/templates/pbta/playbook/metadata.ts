import type { SectionId } from './model'

export const playbookSections: Array<{ id: SectionId; label: string }> = [
    { id: 'stats', label: 'Stats' },
    { id: 'moves', label: 'Moves' },
    { id: 'choiceSets', label: 'Choice Sets' },
    { id: 'advancement', label: 'Advancement' },
    { id: 'creation', label: 'Creation' },
    { id: 'gear', label: 'Gear' },
]
