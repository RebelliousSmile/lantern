import type { LegendInTheMistJourney } from './model'

// Three vignettes rather than one, so the order they were written in is
// visible on the sheet and a reorder is something a reader can actually see.
// Every vignette carries at least one Consequence: the example is meant to
// import clean, and a vignette without one is exactly what the warnings flag.
export function getSampleLegendInTheMistJourney(): LegendInTheMistJourney {
    return {
        name: 'The Long Road to Blackmere',
        type: 'landscape',
        description:
            'Four days of drowned road between the last inn and Blackmere, where the water is never quite where it was yesterday.\n\nThe marsh-folk walk it barefoot and say the road remembers who hurried.',
        tags: [
            'waist-deep in black water',
            'no landmark in any direction',
            'the road remembers',
        ],
        benefits:
            'Anyone who reaches Blackmere on foot is owed a bed and a meal, and the marsh-folk will say so out loud.',
        consequences: [
            'The day is gone and the water is rising ({time-passes-1}).',
            'Give {footsore-2} to whoever set the pace.',
            'Something in the pack is ruined beyond drying out.',
        ],
        vignettes: [
            {
                name: 'The drowned mile',
                trigger: 'When the Heroes try to cross after dark.',
                consequences: [
                    'Give {soaked-1} to whoever went in first.',
                    'The path behind is gone ({lost-2}).',
                ],
            },
            {
                name: 'A toll at the crossing',
                trigger: 'When a Hero refuses to pay the ferryman.',
                consequences: [
                    'The ferryman names the debt out loud, and the marsh hears it.',
                    'Remove a tier from {well-provisioned}.',
                ],
            },
            {
                name: 'Something keeping pace',
                trigger: '',
                consequences: [
                    'Nobody sleeps ({exhausted-1} to the whole party).',
                ],
            },
        ],
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist - Sample Journeys',
            authors: ['4rtamis'],
            page: undefined,
        },
    }
}
