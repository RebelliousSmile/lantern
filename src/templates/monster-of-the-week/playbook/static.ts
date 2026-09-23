import type { SpecializedPlaybookConfig } from '@/templates/pbta/specialized/staticDefinitionFactory'
import { createSpecializedPlaybookStaticDefinition } from '@/templates/pbta/specialized/staticDefinitionFactory'

export const config: SpecializedPlaybookConfig = {
    id: 'monster-of-the-week.playbook',
    gameId: 'monster-of-the-week',
    gameLabel: 'Monster of the Week',
    label: 'pbta:playbook.label',
    newTitle: 'pbta:playbook.newTitle',
    contractKey: 'pbta/monster-of-the-week-playbook',
    sections: [
        { id: 'stats', label: 'pbta:specialized.sections.stats' },
        { id: 'moves', label: 'pbta:specialized.sections.moves' },
        {
            id: 'improvements',
            label: 'pbta:specialized.sections.improvements',
        },
        { id: 'editorial', label: 'pbta:specialized.sections.editorial' },
    ],
    blank: {
        slug: 'untitled-hunter',
        name: 'Untitled Hunter',
        game: 'monster-of-the-week',
        description: 'An original Monster of the Week playbook.',
        stats: { charm: 0 },
        moves: [],
        improvements: ['Take a move.'],
        editorial: {
            opening: {
                heading: 'Opening',
                paragraphs: ['Introduce this hunter.'],
            },
            playAdvice: { heading: 'Advice', paragraphs: ['Keep watch.'] },
            identity: { heading: 'Identity', paragraphs: ['Choose a road.'] },
            progression: {
                heading: 'Progression',
                paragraphs: ['Take a move.'],
            },
        },
    },
}

export const staticDefinition = createSpecializedPlaybookStaticDefinition(config)

export default staticDefinition
