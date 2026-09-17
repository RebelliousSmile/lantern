import { createSpecializedPlaybookTemplate } from '@/templates/pbta/specialized/definitionFactory'
export default createSpecializedPlaybookTemplate({
    id: 'monster-of-the-week.playbook',
    gameId: 'monster-of-the-week',
    gameLabel: 'Monster of the Week',
    label: 'Playbook',
    contractKey: 'pbta/monster-of-the-week-playbook',
    sections: [
        { id: 'stats', label: 'Stats' },
        { id: 'moves', label: 'Moves' },
        { id: 'improvements', label: 'Improvements' },
        { id: 'editorial', label: 'Editorial' },
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
})
