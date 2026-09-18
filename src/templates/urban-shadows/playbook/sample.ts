import { blankPlaybook } from './model'
export const getSampleUrbanShadowsPlaybook = () => ({
    ...blankPlaybook(),
    slug: 'the-aware',
    name: 'The Aware',
    description:
        'A mortal who has learned the city has monsters.',
    stats: {
        blood: 0,
        heart: 1,
        mind: -1,
        spirit: 1,
        mortalis: 1,
        night: 0,
        power: 1,
        wild: -1,
    },
    statuses: { mortalis: 1, night: 0, power: 0, wild: 1 },
    moves: [
        {
            name: 'I Know a Guy',
            moveType: 'playbook',
            description:
                'Find help through your Circle.',
        },
    ],
    mortalRelationships: [
        {
            key: 'younger-sibling',
            label: 'Younger sibling',
            description: 'Relies on you for transportation and advice.',
        },
        {
            key: 'loyal-significant-other',
            label: 'Loyal significant other',
            description: 'Keeps choosing you when the city makes that dangerous.',
        },
        {
            key: 'struggling-best-friend',
            label: 'Struggling best friend',
            description: 'Always gets into messy altercations.',
        },
    ],
    attributes: {
        mortalRelationships: [
            'younger-sibling',
            'loyal-significant-other',
            'struggling-best-friend',
        ],
    },
    scars: [{ name: 'Burned hand', stat: 'blood', modifier: -1 }],
    creation: [
        {
            label: 'Choose three mortal relationships.',
            options: [
                { value: 'younger-sibling', label: 'Younger sibling' },
                {
                    value: 'loyal-significant-other',
                    label: 'Loyal significant other',
                },
                {
                    value: 'struggling-best-friend',
                    label: 'Struggling best friend',
                },
            ],
            selection: { min: 3, max: 3 },
            attribute: 'mortalRelationships',
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
