import type { LegendInTheMistStoryTheme } from './model'

// The same theme the schema repository ships as its canonical example, so a
// card built here and a file written there read as the same object.
export function getSampleLegendInTheMistStoryTheme(): LegendInTheMistStoryTheme {
    return {
        title_tag: 'The Village I Left Behind',
        level: 'origin',
        category: 'Past',
        power_tags: [
            'knows every face in town',
            "mother's recipes",
            'reads the weather in the hills',
        ],
        weakness_tags: ['they still expect me back'],
        quest: 'Return to the village and face what I owe the people I abandoned.',
        improve: 2,
        abandon: 0,
        milestone: false,
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist - Sample Story Themes',
            authors: ['4rtamis'],
            page: undefined,
        },
    }
}
