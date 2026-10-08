import { blankPlaybook, type MonsterOfTheWeekPlaybook } from './model'

export const getSampleMonsterOfTheWeekPlaybook =
    (): MonsterOfTheWeekPlaybook => ({
        ...blankPlaybook(),
        slug: 'the-chosen',
        name: 'The Chosen',
        heroName: 'Mara',
        description: 'A hunter marked by a destiny she did not ask for.',
        stats: { charm: -1, cool: 1, sharp: 0, tough: 1, weird: 2 },
        luckMax: 7,
        luckMarked: 3,
        harmMax: 7,
        harmMarked: 0,
        unstable: false,
        experienceMax: 5,
        experienceMarked: 1,
        specialWeapon: 'A chipped silver dagger inherited from your mentor.',
        moves: [
            {
                name: 'Destiny',
                moveType: 'playbook',
                description: 'When you read the signs, roll with Weird.',
                checked: true,
            },
        ],
        startingMoves: [],
        look: ['Worn coat', 'Tired eyes'],
        introductions: ['Tell the others how you met them.'],
        history: ['Who did you save, and who did you fail?'],
        improvements: [
            { label: 'Get +1 Weird, max +3.' },
            { label: 'Take another Chosen move.' },
        ],
        advancements: [{ label: 'Change this hunter to a new playbook.' }],
        notes: ['Who owes you a favour?', 'What did the last case cost?'],
    })
