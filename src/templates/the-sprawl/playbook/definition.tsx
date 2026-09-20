import { createSpecializedPlaybookTemplate } from '@/templates/pbta/specialized/definitionFactory'
export default createSpecializedPlaybookTemplate({
    id: 'the-sprawl.playbook',
    gameId: 'the-sprawl',
    gameLabel: 'The Sprawl',
    label: 'pbta:playbook.label',
    newTitle: 'pbta:playbook.newTitle',
    contractKey: 'pbta/the-sprawl-playbook',
    sections: [
        { id: 'stats', label: 'pbta:specialized.sections.stats' },
        { id: 'moves', label: 'pbta:specialized.sections.moves' },
        { id: 'directives', label: 'pbta:specialized.sections.directives' },
        { id: 'editorial', label: 'pbta:specialized.sections.editorial' },
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
