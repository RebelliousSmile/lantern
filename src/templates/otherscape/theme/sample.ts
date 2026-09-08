import type { OtherscapeTheme } from './model'

// The same theme the schema repository ships as its canonical example, so a
// card built here and a file written there read as the same object. The title
// tag is deliberately absent from the power tags: the card prints it as the
// title. Both tracks carry a value, so the example shows the pips filled rather
// than the empty row a blank theme starts on.
export function getSampleOtherscapeTheme(): OtherscapeTheme {
    return {
        title_tag: 'The Debt I Never Paid',
        theme_type: 'self',
        category: 'AFFILIATION',
        power_tags: [
            'they still take my call',
            'knows what the favour was worth',
        ],
        weakness_tags: ['cannot refuse when they ask'],
        quest: 'Settle the debt on my own terms, before someone else names them for me.',
        upgrade: 2,
        decay: 1,
        meta: {
            publication_type: 'homebrew',
            source: undefined,
            authors: ['schema-in-the-mist contributors'],
            page: undefined,
        },
    }
}
