import { createSpecializedPlaybookTemplate } from '@/templates/pbta/specialized/definitionFactory'
export default createSpecializedPlaybookTemplate({
    id: 'the-sprawl.playbook',
    gameId: 'the-sprawl',
    gameLabel: 'The Sprawl',
    label: 'Playbook',
    contractKey: 'pbta/the-sprawl-playbook',
    sections: [
        { id: 'stats', label: 'Stats' },
        { id: 'moves', label: 'Moves' },
        { id: 'directives', label: 'Directives' },
        { id: 'editorial', label: 'Editorial' },
    ],
    blank: {
        slug: 'untitled-operator',
        name: 'Untitled Operator',
        game: 'the-sprawl',
        description: 'An original The Sprawl playbook.',
        stats: { edge: 0 },
        moves: [],
        directives: ['Protect people.'],
        editorial: {
            opening: {
                heading: 'Opening',
                paragraphs: ['Introduce this operator.'],
            },
            playAdvice: { heading: 'Advice', paragraphs: ['Watch the city.'] },
            identity: {
                heading: 'Identity',
                paragraphs: ['Choose a contact.'],
            },
            progression: {
                heading: 'Progression',
                paragraphs: ['Finish the mission.'],
            },
        },
    },
})
