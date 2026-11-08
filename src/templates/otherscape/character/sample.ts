import type { OtherscapeCharacter } from './model'

/* Vesper, the sheet the schema repository ships as the example that carries
   every field (`corpus/contract/valid/otherscape--character.toml` of the
   package): four themes, the tag combos they prepare and a loadout where some
   items are loaded, one is explicitly not, and the rest never say. Held in the
   shape the import produces, so the example and an imported file are the same
   object to everything downstream. */
export function getSampleOtherscapeCharacter(): OtherscapeCharacter {
    return {
        name: 'Vesper',
        themes: [
            {
                title_tag: 'The Lantern of Saint Ives',
                theme_type: 'mythos',
                category: 'ARTIFACT',
                power_tags: [
                    'light that shows what is hidden',
                    'burns away lies',
                    'warms the frightened',
                    'old church authority',
                    'steady hands',
                ],
                weakness_tags: ['the flame must be fed'],
                quest: 'I must carry the flame to every grave I pass on a feast day.',
                description:
                    'Vesper found the lantern lit in a condemned chapel, with no oil in it and no wick. It has not gone out since, and the people it shines on tend to tell the truth.',
                special: {
                    name: 'Feast Day Light',
                    description:
                        'Once per scene, when you raise the lantern in a place of worship or mourning, you may gain a tier-2 status such as *trusted*, *revered* or *unsettling*.',
                },
                upgrade: undefined,
                decay: undefined,
                meta: {
                    publication_type: 'homebrew',
                    source: undefined,
                    authors: undefined,
                    page: undefined,
                },
            },
            {
                title_tag: 'Choir of the Drowned',
                theme_type: 'mythos',
                category: 'EXPOSURE',
                power_tags: [
                    'voices of the dead',
                    'warnings before danger',
                    'a hymn that carries',
                    'the dead remember',
                    'cold, calming presence',
                ],
                weakness_tags: ['they never stop singing'],
                quest: 'I must give every drowned voice one last listener.',
                description:
                    'Since the lantern, the dead of the old harbour sing to Vesper. Most of the time it is a comfort. Some nights it is a crowd.',
                special: {
                    name: 'Chorus',
                    description:
                        'Once per session, when burning a tag from this theme for Power, you may add 5 Power to the roll instead of 3. After the roll is resolved, you take *haunted-2*.',
                },
                upgrade: undefined,
                decay: undefined,
                meta: {
                    publication_type: 'homebrew',
                    source: undefined,
                    authors: undefined,
                    page: undefined,
                },
            },
            {
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
                upgrade: undefined,
                decay: undefined,
                meta: {
                    publication_type: 'homebrew',
                    source: undefined,
                    authors: undefined,
                    page: undefined,
                },
            },
            {
                title_tag: 'Patched Ambulance Drone',
                theme_type: 'noise',
                category: 'CUTTING EDGE',
                power_tags: [
                    'flies over traffic',
                    'carries a med-kit',
                    'thermal camera',
                    'loudspeaker',
                    'auto-return home',
                ],
                weakness_tags: ['battery anxiety'],
                quest: 'Find out how far the drone can really go.',
                description:
                    "Decommissioned by the city, rebuilt in Vesper's kitchen. It answers to a whistle and does not like rain.",
                special: {
                    name: 'Overwatch',
                    description:
                        'Once per session, if the drone can take off before a scene, you may gain *eye-in-the-sky-2* or a similar tier-2 status.',
                },
                upgrade: undefined,
                decay: undefined,
                meta: {
                    publication_type: 'homebrew',
                    source: undefined,
                    authors: undefined,
                    page: undefined,
                },
            },
        ],
        tag_combos: [
            {
                label: 'Light up a liar',
                tags: [
                    'The Lantern of Saint Ives',
                    'light that shows what is hidden',
                    'burns away lies',
                ],
                power: 3,
                effect: '**Influence** *confessing*',
            },
            {
                label: 'Patch someone up',
                tags: [
                    'Night-Shift Paramedic',
                    'field triage',
                    'calm under sirens',
                ],
                power: 3,
                effect: '**Restore** harm statuses',
            },
            {
                label: 'Ask the dead',
                tags: [
                    'Choir of the Drowned',
                    'voices of the dead',
                    'the dead remember',
                ],
                power: 3,
                effect: '**Discover** what happened here',
            },
            {
                label: 'Eyes over the block',
                tags: [
                    'Patched Ambulance Drone',
                    'flies over traffic',
                    'thermal camera',
                    'knows every back street',
                ],
                power: 4,
                effect: '**Discover** *spotted*',
            },
        ],
        loadout: [
            {
                name: 'Trauma Bag',
                feature_tags: ['Trauma Bag', 'everything for a bleed'],
                weakness_tag: '',
                loaded: true,
            },
            {
                name: 'Reflective Jacket',
                feature_tags: ['Reflective Jacket', 'people make way'],
                weakness_tag: 'seen from a mile away',
                loaded: true,
            },
            {
                name: 'Pocket Defibrillator',
                feature_tags: [],
                weakness_tag: '',
                loaded: true,
            },
            {
                name: 'Prayer Beads',
                feature_tags: [],
                weakness_tag: '',
                loaded: true,
            },
            {
                name: 'Stun Baton',
                feature_tags: [],
                weakness_tag: '',
                loaded: undefined,
            },
            {
                name: 'Spare Drone Battery',
                feature_tags: [],
                weakness_tag: '',
                loaded: false,
            },
            {
                name: 'Hospital Keycard',
                feature_tags: [],
                weakness_tag: '',
                loaded: undefined,
            },
            {
                name: 'Flask of Holy Water',
                feature_tags: [],
                weakness_tag: '',
                loaded: undefined,
            },
        ],
        meta: {
            publication_type: 'homebrew',
            authors: ['schema-in-the-mist contributors'],
        },
    }
}
