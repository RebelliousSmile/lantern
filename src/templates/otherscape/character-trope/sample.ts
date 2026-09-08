import type { OtherscapeCharacterTrope } from './model'

/* Neon Exorcist, the worked example of
   `../schema-in-the-mist/examples/otherscape/character-trope/`. Held in the
   shape the import produces, down to the key order, so the example and an
   imported file are the same object to everything downstream. */
export function getSampleOtherscapeCharacterTrope(): OtherscapeCharacterTrope {
    return {
        name: 'Neon Exorcist',
        category: 'MYSTICS & MEDIUMS',
        description:
            "Something walked out of the Source and into the grid, and it has been wearing other people's hardware ever since. You were trained to put it back where it belongs.\n\nThe rites still work. They just cost more now that the altar is a server rack and the congregation is billing you by the hour.",
        theme_kits: [
            { title_tag: 'Rites Of The Cold Signal', category: 'RITUAL' },
            { title_tag: 'Licensed Cleanser', category: 'AFFILIATION' },
            { title_tag: 'Warded Handset', category: 'ARTIFACT' },
        ],
        choices: [
            { title_tag: 'Seminary Dropout', category: 'PERSONALITY' },
            { title_tag: 'Wired For The Whisper', category: 'AUGMENTATION' },
            { title_tag: 'Zeroed Identity', category: 'CYBERSPACE' },
        ],
        // Transcribed as printed, parentheticals included: these name what the
        // character carries, they are not keys into the loadout item catalog.
        loadout: [
            'salt-line projector (requires setup)',
            'second-hand censer with a cracked emitter',
            'prayer deck (all: incriminating)',
        ],
        meta: {
            publication_type: 'homebrew',
            source: undefined,
            authors: ['schema-in-the-mist contributors'],
            page: undefined,
        },
    }
}
