import { blankPlaybook, type MasksPlaybook } from './model'

export const getSampleMasksPlaybook = (): MasksPlaybook => ({
    ...blankPlaybook(),
    slug: 'the-beacon',
    name: 'The Beacon',
    heroName: 'Aurore',
    description: 'A young hero whose power answers to their emotions.',
    stats: { danger: -1, freak: 1, savior: 0, superior: 1, mundane: 0 },
    statRanges: {
        danger: { min: -2, max: 3 },
        freak: { min: -2, max: 3 },
        savior: { min: -2, max: 3 },
        superior: { min: -2, max: 3 },
        mundane: { min: -2, max: 3 },
    },
    conditions: [
        { name: 'Afraid', description: '-2 to directly engage a threat.' },
        { name: 'Angry', description: '-2 to comfort or support.' },
        { name: 'Guilty', description: '-2 to rely on your team.' },
        { name: 'Hopeless', description: '-2 to aid or interfere.' },
        { name: 'Insecure', description: '-2 to defy or resist.' },
    ],
    momentOfTruth:
        'Say what you would never admit to the team, and let them answer.',
    momentUnlocked: false,
    influenceOptions: ['Someone who believes in you.', 'Someone you let down.'],
    advancement: [{ label: 'Take a Label advance.' }],
    potential: 1,
    potentialMax: 5,
    moves: [
        {
            name: 'Burn bright',
            moveType: 'playbook',
            description: 'When you let your power loose, roll with Freak.',
        },
    ],
    drives: {
        intro: ['Choose what pulls you forward.'],
        options: [{ label: 'Protect the city.' }, { label: 'Be seen.' }],
    },
    realName: 'Camille Roy',
    abilities: 'Light, heat, and a stubborn streak.',
    demeanor: 'Earnest and a little reckless.',
    backstory: ['Where did your power come from?'],
    relationships: ['Who knows your secret?'],
    influence: ['Someone who holds your attention.'],
})
