import { blankPlaybook, type TheSprawlPlaybook } from './model'

export const getSampleTheSprawlPlaybook = (): TheSprawlPlaybook => ({
    ...blankPlaybook(),
    slug: 'the-fixer',
    name: 'The Fixer',
    characterName: 'Kess',
    description: 'A broker who knows who to call, and what it costs.',
    stats: { cool: 1, edge: 0, meat: -1, mind: 1, synth: 0 },
    look: [
        { label: 'Eyes', value: 'Mirrored lenses' },
        { label: 'Outfit', value: 'Tailored synth-leather' },
    ],
    gear: [{ name: 'Encrypted deck' }],
    missionGear: ['Burner phone'],
    cred: 2,
    cyberware: [{ label: 'Neural link', checked: true }],
    moves: [
        {
            name: 'Connected',
            moveType: 'playbook',
            description: 'When you call in a favour, roll with Edge.',
            checked: true,
        },
    ],
    startingMoves: [],
    directives: ['Keep the client alive.'],
    directiveChoices: [{ label: 'Make money.', checked: true }],
    advancement: [{ label: 'Take another Fixer move.' }],
    xp: 1,
    xpMax: 5,
    links: [
        { name: 'Mara', value: 1 },
        { name: 'Jonas', value: -1 },
    ],
    contacts: ['A cop on the take', 'A street doc'],
    hoursMarked: 2,
})
