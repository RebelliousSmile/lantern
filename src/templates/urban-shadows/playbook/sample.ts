import { blankPlaybook } from './model'
export const getSampleUrbanShadowsPlaybook = () => ({
    ...blankPlaybook(),
    slug: 'the-night-courier',
    name: 'The Night Courier',
    description:
        'An original mortal who carries messages through a hungry city.',
    stats: {
        blood: 0,
        heart: 1,
        mind: 1,
        spirit: -1,
        mortalis: 1,
        night: 0,
        power: 0,
        wild: 1,
    },
    statuses: { mortalis: 1, night: 0, power: 0, wild: 1 },
    moves: [
        {
            name: 'Know the Route',
            moveType: 'playbook',
            description:
                'When you find a path through the city, ask what danger waits along it.',
        },
    ],
    mortalRelationships: [
        {
            name: 'The baker downstairs',
            description: 'They always save you a meal.',
        },
    ],
    scars: [{ name: 'Burned hand', stat: 'blood', modifier: -1 }],
    creation: [
        {
            label: 'Choose a promise',
            options: ['Deliver every message.', 'Protect the overlooked.'],
        },
    ],
    gear: [
        {
            name: 'Weathered bicycle',
            description: 'Fast, quiet, and repaired too often.',
        },
    ],
    advancement: [{ label: 'Take a new original courier move.' }],
    corruption: {
        trigger:
            'When you abandon someone who trusted your route, mark corruption.',
        advances: [{ label: 'Take a corruption move.' }],
        moves: ['No Safe Address'],
    },
})
