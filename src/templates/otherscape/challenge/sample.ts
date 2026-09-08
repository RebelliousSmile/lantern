import type { OtherscapeChallenge } from './model'

/* Chrome Vulture Runner, the worked example of
   `../schema-in-the-mist/examples/otherscape/challenge/`. Held in the shape the
   import produces, down to the key order, so the example and an imported file
   are the same object to everything downstream. */
export function getSampleOtherscapeChallenge(): OtherscapeChallenge {
    return {
        name: 'Chrome Vulture Runner',
        description:
            "A courier who runs the arcology's outer skin on borrowed legs, carrying whatever the middle floors would rather not put on the network.\n\nThe Vultures are not loyal to whoever hired them. They are loyal to the run, and a run that ends badly for the client still ends.",
        scale: 1,
        tags_and_statuses: [
            '{wall-running legs}',
            "{courier's read of the city}",
            '{alert-2}',
            '{sealed package}',
        ],
        limits: [
            // Polar: both poles live in the one name, joined by a slash.
            {
                name: 'catch/outrun',
                level: 3,
                is_polar: true,
                is_progress: false,
                on_max: undefined,
            },
            {
                name: 'Talk down',
                level: 2,
                is_polar: false,
                is_progress: false,
                on_max: undefined,
            },
            // Progress: fills up towards an outcome instead of ending things.
            {
                name: 'Trace the handoff',
                level: 4,
                is_polar: false,
                is_progress: true,
                on_max: 'The Crew learns who is waiting at the other end, and the runner learns they were traced (**Exposure**).',
            },
        ],
        specials: [
            {
                name: 'Chrome Reflexes',
                description:
                    'The first time the runner is Mythos-touched in a scene, remove one tier from any {tracked-} status on it.',
            },
            {
                name: 'Never Drops the Package',
                description:
                    'The runner will not put {sealed package} down for anything short of a status of tier 4 or higher. If it does, it comes back for it.',
            },
        ],
        threats: [
            {
                name: 'Break for the roof',
                description:
                    'Puts a wall between itself and the Crew and goes up',
                consequences: [
                    'Give {winded-1} to whoever gave chase.',
                    'The runner gains {two floors up-2}.',
                    "A maintenance drone logs the Crew's faces (**Exposure**).",
                ],
            },
            // Standalone: a Threat with no Consequence list of its own.
            {
                name: 'Call it in',
                description:
                    'Thumbs a panic stud and lets the arcology answer for it',
                consequences: [],
            },
        ],
        general_consequences: [
            'Give {made-2} to whoever spoke last.',
            'The runner is gone over the parapet and the trail is cold (**Exposure**).',
            "Something in the Crew's own kit is scuffed loose and left behind.",
        ],
        meta: {
            publication_type: 'homebrew',
            source: undefined,
            authors: ['schema-in-the-mist contributors'],
            page: undefined,
        },
    }
}
