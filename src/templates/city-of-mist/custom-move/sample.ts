import type { CityOfMistCustomMove } from './model'

/* A move that exercises the whole card: a roll on a custom stat with a
   modifier, three outcome tiers, and one options list the tiers pick a
   different number of entries from. */
export function getSampleCityOfMistCustomMove(): CityOfMistCustomMove {
    const options = [
        'You are exposed to the fighting: take a {wounded} status.',
        'You lose something you were carrying, or it is taken from you.',
        'Someone you were counting on is not there when you come back.',
        'You draw attention: a faction now knows where you were.',
    ]

    return {
        name: 'War-Torn City',
        kind: 'situational',
        template: 'countdown_outcome',
        trigger: 'When you spend a day in the war-torn city,',
        impact: 3,
        roll: {
            stat: 'custom',
            label: "the tier of the city's {war-torn} status",
            modifier: -1,
        },
        outcomes: [
            {
                tier: '10+',
                text: 'The day costs you little. Choose one:',
                options: [...options],
                pick_count: 1,
            },
            {
                tier: '7-9',
                text: 'The city takes its due. Choose two:',
                options: [...options],
                pick_count: 2,
            },
            {
                tier: 'miss',
                text: 'The war finds you. The MC chooses three:',
                options: [...options],
                pick_count: 3,
            },
        ],
        frequency: 'Once per day spent in the city.',
        mc_note:
            'Raise the {war-torn} status a tier whenever the front moves closer, and let the modifier do the rest: the same day costs more as the city falls apart.',
        meta: {
            publication_type: 'official',
            source: 'City of Mist: MC Toolkit',
            authors: ['Son of Oak'],
            page: 191,
        },
    }
}
