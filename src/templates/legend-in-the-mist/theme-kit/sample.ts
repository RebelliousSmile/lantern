import type { LegendInTheMistThemeKit } from './model'

// The same kit the schema repository ships as its canonical example, so a card
// built here and a file written there read as the same object. Every
// improvement carries its effect: the example is meant to exercise each block
// and to import clean, and a label without an effect is exactly what the
// warnings flag.
export function getSampleLegendInTheMistThemeKit(): LegendInTheMistThemeKit {
    return {
        name: 'The Hedge Witch',
        category: 'Personality',
        power_tags: [
            'knows which roots bite back',
            'welcome at every hearth',
            'reads the omens in a dead bird',
            'steady hands in a bad birth',
        ],
        weakness_tags: ['the village fears me', 'cannot leave a debt unpaid'],
        quest: 'Heal someone the village has already given up on, and be thanked for it.',
        improvements: [
            {
                name: 'Second Sight',
                effect: 'Add a power tag describing what the spirits let you see that others cannot.',
            },
            {
                name: 'Herbs for every ailment',
                effect: 'Once per session, treat a failure to mend or soothe as a partial success.',
            },
            {
                name: 'Known by name',
                effect: 'Someone in every village owes you a kindness, and remembers it.',
            },
        ],
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist - Sample Theme Kits',
            authors: ['4rtamis'],
            page: undefined,
        },
    }
}
