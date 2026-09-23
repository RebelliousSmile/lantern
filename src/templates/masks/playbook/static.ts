import type { SpecializedPlaybookConfig } from '@/templates/pbta/specialized/staticDefinitionFactory'
import { createSpecializedPlaybookStaticDefinition } from '@/templates/pbta/specialized/staticDefinitionFactory'

export const config: SpecializedPlaybookConfig = {
    id: 'masks.playbook',
    gameId: 'masks',
    gameLabel: 'Masks',
    label: 'pbta:playbook.label',
    newTitle: 'pbta:playbook.newTitle',
    contractKey: 'pbta/masks-playbook',
    sections: [
        { id: 'stats', label: 'pbta:specialized.sections.labels' },
        { id: 'moves', label: 'pbta:specialized.sections.moves' },
        {
            id: 'momentOfTruth',
            label: 'pbta:specialized.sections.momentOfTruth',
        },
        { id: 'editorial', label: 'pbta:specialized.sections.editorial' },
    ],
    blank: {
        slug: 'untitled-masks-playbook',
        name: 'Untitled Masks Playbook',
        game: 'masks',
        description: 'An original Masks playbook.',
        stats: { danger: 0 },
        moves: [],
        momentOfTruth: 'Describe this hero at their brightest.',
        editorial: {
            opening: {
                heading: 'Opening',
                paragraphs: ['Introduce this playbook.'],
            },
            playAdvice: { heading: 'Advice', paragraphs: ['Play bravely.'] },
            identity: { heading: 'Identity', paragraphs: ['Choose a name.'] },
            progression: {
                heading: 'Progression',
                paragraphs: ['Mark Potential.'],
            },
        },
    },
}

export const staticDefinition = createSpecializedPlaybookStaticDefinition(config)

export default staticDefinition
