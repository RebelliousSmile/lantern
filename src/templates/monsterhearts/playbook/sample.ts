import { blankPlaybook } from './model'
export const getSampleMonsterheartsPlaybook = () => ({
    ...blankPlaybook(),
    slug: 'the-echo',
    name: 'The Echo',
    description: 'An original skin haunted by every promise it repeats.',
    strings: { max: 4, starting: 1 },
    conditions: [
        {
            name: 'Exposed',
            description: 'Everyone knows one secret you hoped to keep.',
        },
    ],
    editorial: {
        opening: {
            heading: 'Opening',
            paragraphs: ['Every promise has an echo.'],
        },
        identity: {
            heading: 'Identity',
            paragraphs: ['Choose the promise that made you.'],
        },
        progression: {
            heading: 'Progression',
            paragraphs: ['Take an original Echo move.'],
        },
        sexMove: {
            heading: 'Sex Move',
            paragraphs: [
                'When you share an intimate moment, each person says one truth they cannot take back.',
            ],
        },
        darkestSelf: {
            heading: 'Darkest Self',
            paragraphs: [
                'Demand that everyone repeats the story you want told.',
            ],
        },
    },
    moves: [
        {
            name: 'Second Voice',
            moveType: 'skin',
            description: 'When you repeat a rumour, ask what it changes.',
        },
    ],
    advances: [{ label: 'Take an original Echo move.' }],
    harm: 0,
})
