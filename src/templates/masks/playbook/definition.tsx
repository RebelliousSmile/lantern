import { createSpecializedPlaybookTemplate } from '@/templates/pbta/specialized/definitionFactory'
export default createSpecializedPlaybookTemplate({
    id: 'masks.playbook',
    gameId: 'masks',
    gameLabel: 'Masks',
    label: 'Playbook',
    contractKey: 'pbta/masks-playbook',
    sections: [
        { id: 'stats', label: 'Labels' },
        { id: 'moves', label: 'Moves' },
        { id: 'momentOfTruth', label: 'Moment of Truth' },
        { id: 'editorial', label: 'Editorial' },
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
})
