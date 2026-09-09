import type { ThemeCardDocument } from './model'

export function getSampleThemeCard(): ThemeCardDocument {
    return {
        themebook: 'Divination',
        theme_type: 'mythos',
        title: 'The Reading I Cannot Stop',
        motivation: {
            kind: 'mystery',
            text: 'Who keeps answering when I ask?',
        },
        attention: { filled: 2, maximum: 3 },
        erosion: { kind: 'fade', filled: 1, maximum: 3 },
        power_tags: [
            {
                text: 'Cards that deal themselves',
                letter: 'A',
                is_burnt: false,
            },
            {
                text: 'A voice under the static',
                letter: 'C',
                is_burnt: true,
            },
        ],
        weakness_tags: [
            {
                text: 'It answers, then it asks',
                letter: 'B',
                is_invoked: false,
            },
        ],
        improvements: [
            {
                name: 'Second Sight',
                effect: 'Take an additional power tag for this theme.',
                is_taken: true,
            },
        ],
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist',
            authors: ['RebelliousSmile'],
        },
    }
}
