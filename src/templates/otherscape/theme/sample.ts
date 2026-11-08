import type { OtherscapeTheme } from './model'

// The theme the schema repository ships as the example that carries every
// field, so a card built here and a file written there read as the same
// object. The title tag is deliberately absent from the power tags: the card
// prints it as the title. Both tracks carry a value, so the example shows the
// pips filled rather than the empty row a blank theme starts on, and the
// description and the Special show how the card closes.
export function getSampleOtherscapeTheme(): OtherscapeTheme {
    return {
        title_tag: 'Night-Shift Paramedic',
        theme_type: 'self',
        category: 'PROFESSION',
        power_tags: [
            'field triage',
            'calm under sirens',
            'knows every back street',
            'dark humour',
            'the ambulance radio',
        ],
        weakness_tags: ['running on no sleep'],
        quest: 'Nobody dies alone on my shift.',
        description:
            'Vesper still works three nights a week on the city ambulances. It keeps the rent paid and the voices honest.',
        special: {
            name: 'Golden Hour',
            description:
                'Once per scene, when you treat someone within moments of their injury, reduce one of their harm statuses by two tiers instead of one.',
        },
        upgrade: 1,
        decay: 0,
        meta: {
            publication_type: 'homebrew',
            source: undefined,
            authors: ['schema-in-the-mist contributors'],
            page: undefined,
        },
    }
}
