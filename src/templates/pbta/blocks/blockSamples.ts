/*
 * Blank and example documents of the PbtA block templates, taken from the
 * published valid corpus of schema-pbta (`corpus/<target>-blank.toml` and
 * `-complete.toml`). Kept as plain objects so the registry never loads a codec.
 * `pnpm assert:block-samples` parses the corpus again and refuses any drift.
 */

export const BLOCK_SAMPLES: Record<
    string,
    { blank: Record<string, unknown>; example: Record<string, unknown> }
> = {
    'masks-npc': {
        blank: {
            slug: 'the-cartographer',
            name: 'The Cartographer',
            game: 'masks',
            description: 'An original background paragraph.',
            self: {
                min: -2,
                max: 3,
                value: 0,
            },
        },
        example: {
            slug: 'the-cartographer',
            name: 'The Cartographer',
            game: 'masks',
            description: 'An original background paragraph.',
            tags: ['rival'],
            generation: 'An original generation line.',
            realName: 'Original Name',
            drive: 'An original Drive.',
            abilities: 'An original ability line.',
            resistance: 3,
            conditions: ['Insecure'],
            self: {
                min: -2,
                max: 3,
                value: 1,
            },
            worstSelf: 'An original worst Self.',
            bestSelf: 'An original best Self.',
            moves: ['An original move line.', 'Another original move line.'],
        },
    },
    'the-sprawl-mission': {
        blank: {
            slug: 'the-glass-vault',
            name: 'The Glass Vault',
            game: 'the-sprawl',
        },
        example: {
            slug: 'the-glass-vault',
            name: 'The Glass Vault',
            game: 'the-sprawl',
            getTheJob: 'A fixer offers an original job.',
            investigation: {
                hoursMarked: 2,
                steps: ['First clue.', 'Second clue.'],
            },
            action: {
                hoursMarked: 1,
                steps: ['The alarm trips.'],
            },
            involvedParties: ['An original corporation.', 'A rival crew.'],
            whatIsGoingOn: 'An original explanation.',
            twist: 'An original twist.',
            security: ['Cameras everywhere.', 'A single guard.'],
            missionDirectives: ['Leave no trace.'],
            getPaid: 'Half up front, half on delivery.',
        },
    },
    'the-sprawl-threat': {
        blank: {
            slug: 'the-quiet-choir',
            game: 'the-sprawl',
            name: 'The Quiet Choir',
            threatType: 'group',
        },
        example: {
            slug: 'the-quiet-choir',
            game: 'the-sprawl',
            name: 'The Quiet Choir',
            description: 'An original description.',
            threatType: 'group',
            objective: 'To finish the song.',
            hoursMarked: 3,
        },
    },
    'the-sprawl-resource': {
        blank: {
            slug: 'the-fence',
            game: 'the-sprawl',
            name: 'The Fence',
        },
        example: {
            slug: 'the-fence',
            game: 'the-sprawl',
            name: 'The Fence',
            description: 'An original resource.',
            tags: ['contact', 'black-market'],
            skills: ['Appraisal', 'Discretion'],
        },
    },
    'the-sprawl-corporation': {
        blank: {
            slug: 'halcyon-dynamics',
            game: 'the-sprawl',
            name: 'Halcyon Dynamics',
        },
        example: {
            slug: 'halcyon-dynamics',
            game: 'the-sprawl',
            name: 'Halcyon Dynamics',
            description: 'An original corporation.',
            expertise: ['Logistics', 'Surveillance'],
            customMoves: ['When you cross them, they know first.'],
            hoursMarked: 4,
        },
    },
    'the-sprawl-matrix': {
        blank: {
            slug: 'ghost-in-the-lattice',
            name: 'Ghost in the Lattice',
            game: 'the-sprawl',
        },
        example: {
            slug: 'ghost-in-the-lattice',
            name: 'Ghost in the Lattice',
            game: 'the-sprawl',
            avatarDescription: 'A pale figure stitched from static.',
            avatarImage: 'attachments/ghost.png',
            resistance: 2,
            firewall: 1,
            stealth: 3,
            processor: 2,
            holds: 1,
            programs: [
                {
                    label: 'Original program',
                    checked: true,
                },
                {
                    label: 'Another original program',
                },
            ],
        },
    },
}
