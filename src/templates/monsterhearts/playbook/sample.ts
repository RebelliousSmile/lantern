import { blankPlaybook } from './model'
export const getSampleMonsterheartsPlaybook = () => ({
    ...blankPlaybook(),
    slug: 'the-echo',
    name: 'L’Écho',
    description: 'Une mue originale hantée par chaque promesse qu’elle répète.',
    strings: { max: 4, starting: 1 },
    conditions: [
        {
            name: 'Exposé',
            description: 'Tout le monde connaît un secret que vous espériez garder.',
        },
    ],
    editorial: {
        opening: {
            heading: 'Introduction',
            paragraphs: ['Chaque promesse a son écho.'],
        },
        identity: {
            heading: 'Identité',
            paragraphs: ['Choisissez la promesse qui vous a façonné.'],
        },
        progression: {
            heading: 'Progressions',
            paragraphs: ['Choisissez une action originale de l’Écho.'],
        },
        sexMove: {
            heading: 'Action sexuelle',
            paragraphs: [
                'Quand vous partagez un moment intime, chacun dit une vérité qu’il ne pourra pas reprendre.',
            ],
        },
        play: {
            heading: 'Jouer l’Écho',
            paragraphs: [
                'Laissez les autres finir vos phrases, puis faites-en une promesse.',
            ],
        },
        darkestSelf: {
            heading: 'Démon intérieur',
            paragraphs: [
                'Exigez que tout le monde répète l’histoire que vous voulez voir racontée.',
            ],
        },
    },
    moves: [
        {
            name: 'Seconde voix',
            moveType: 'skin',
            description: 'Quand vous répétez une rumeur, demandez ce qu’elle change.',
        },
    ],
    advances: [{ label: 'Choisissez une action originale de l’Écho.' }],
    harm: 0,
})
