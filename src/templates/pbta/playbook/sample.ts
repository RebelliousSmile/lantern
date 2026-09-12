import type { PbtaPlaybook } from './model'

/* An original playbook for the same invented 'salvage-run' hack as
   game-definition/sample.ts, so the two samples can be opened together.
   Exercises every section: a stat block, one attribute, a ref move and an
   inline move, a choice set mixing a ref and an inline choice, advancement,
   creation and gear. */
export function getSamplePbtaPlaybook(): PbtaPlaybook {
    return {
        slug: 'the-wrench',
        name: 'The Wrench',
        game: 'salvage-run',
        actorType: 'character',
        description:
            'The crew member who keeps the rig running past what the manual allows.',
        playbookImage: '',
        stats: {
            grit: 1,
            nerve: 0,
            reflex: 1,
            wits: 2,
            sway: -1,
        },
        statsDetail: 'Choose one stat at +1 and lower another by 1 to taste.',
        attributes: {
            fuel: 3,
        },
        moves: [
            { kind: 'ref', ref: 'act-under-fire' },
            {
                kind: 'inline',
                description:
                    'When you jury-rig a fix under pressure, roll +Reflex.',
                name: 'Field Fix',
                moveType: 'rig',
                audience: 'character',
                playbook: 'the-wrench',
                trigger: 'you jury-rig a fix under pressure',
                roll: {
                    rollType: 'stat',
                    rollFormula: '2d6+Reflex',
                    rollMod: null,
                },
                results: {
                    strong: {
                        label: '10+',
                        text: 'The fix holds until you can do it properly.',
                    },
                    weak: {
                        label: '7-9',
                        text: 'It holds, but mark 1 Fuel to keep it together.',
                    },
                },
                uses: null,
                choices: '',
                tags: ['rig'],
            },
        ],
        startingMoves: ['act-under-fire'],
        choiceSets: [
            {
                title: 'Rig Moves',
                description: 'Pick two to start.',
                type: 'multi',
                repeatable: false,
                grantOn: 'creation',
                choices: [
                    {
                        kind: 'ref',
                        ref: 'overdrive',
                        granted: 2,
                        advancement: 0,
                    },
                    {
                        kind: 'inline',
                        granted: 2,
                        advancement: 0,
                        description:
                            'When you strip a wreck for parts, roll +Wits.',
                        name: 'Scavenger Eye',
                        moveType: 'rig',
                        audience: 'character',
                        playbook: 'the-wrench',
                        trigger: 'you strip a wreck for parts',
                        roll: {
                            rollType: 'stat',
                            rollFormula: '2d6+Wits',
                            rollMod: null,
                        },
                        results: {},
                        uses: null,
                        choices: '',
                        tags: [],
                    },
                ],
            },
        ],
        advancement: [
            'Get +1 to a stat (max +3)',
            'Get a new rig move',
            'Get a move from another playbook',
        ],
        creation: [
            { label: 'Name', options: ['Bram', 'Kessa', 'Oren'] },
            { label: 'Look', options: ['grease-stained', 'patched coveralls'] },
        ],
        gear: [
            {
                name: 'Toolkit',
                equipmentType: 'gear',
                description: 'Everything short of a welder.',
                quantity: 1,
                tags: [],
            },
            {
                name: 'Scrap',
                equipmentType: 'salvage',
                description: '',
                quantity: 3,
                tags: ['barter'],
            },
        ],
    }
}
