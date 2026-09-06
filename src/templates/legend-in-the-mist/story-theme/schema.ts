import { z } from 'zod'

/** =========================
 *  Enums
 *  ========================= */

export const ThemeLevelEnum = z
    .enum(['origin', 'adventure', 'greatness'])
    .meta({
        description:
            'Tier of the Story Theme, which determines the themebooks it can be built from and the kind of Quest it carries.',
        examples: ['origin', 'adventure', 'greatness'],
    })
export type ThemeLevel = z.infer<typeof ThemeLevelEnum>

export const PublicationTypeEnum = z
    .enum(['official', 'third_party', 'cauldron', 'homebrew'])
    .meta({
        description:
            'Where this content comes from. Use to help downstream tools filter sources.',
        examples: ['official', 'cauldron'],
    })
export type PublicationType = z.infer<typeof PublicationTypeEnum>

/** =========================
 *  Meta
 *  ========================= */

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                'Whether the Story Theme is official, third party, from a Cauldron product, or homebrew.',
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Book, product or place this Story Theme was published in.',
                examples: ['Legend in the Mist - Vol. I - The Player'],
            }),
        authors: z
            .array(
                z.string().trim().min(1, 'Author name cannot be empty').meta({
                    description: 'One author credited for this Story Theme.',
                })
            )
            .optional()
            .meta({
                description: 'Everyone credited for this Story Theme.',
            }),
        page: z.coerce
            .number()
            .int()
            .min(1)
            .optional()
            .meta({
                description: 'Page the Story Theme appears on in its source.',
                examples: [42],
            }),
    })
    .meta({
        description:
            "Attribution and cataloging fields for the Story Theme's origin.",
    })

/** =========================
 *  Story Theme
 *  ========================= */

export const LegendInTheMistStoryThemeSchema = z
    .object({
        title_tag: z
            .string()
            .trim()
            .min(1, 'Story Theme title tag is required')
            .default('Untitled Story Theme')
            .meta({
                description:
                    "The Story Theme's own tag, which names it and can be invoked like any other tag. Written without the surrounding braces of the inline tag syntax.",
                examples: [
                    'The Village I Left Behind',
                    'Sworn to the Winter Court',
                    'Blade of my Father',
                ],
            }),
        level: ThemeLevelEnum.default('origin').meta({
            description:
                'Tier the Story Theme sits at, which constrains the themebooks it can be built from.',
        }),
        category: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Themebook this Story Theme is built from. Kept a free string rather than a closed set, so that homebrew themebooks remain expressible.',
                examples: [
                    'Past',
                    'Personality',
                    'Relic',
                    'Destiny',
                    'Companion',
                ],
            }),
        power_tags: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'A power tag cannot be empty')
                    .meta({
                        description:
                            'One tag the Story Theme grants, which a Hero can invoke to be Favored. Written without the surrounding braces of the inline tag syntax; a renderer adds them.',
                        examples: [
                            'stubborn as the hills',
                            'knows every back alley',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    'The tags this Story Theme grants to the Hero, in the order they are written on the sheet.',
            }),
        weakness_tags: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'A weakness tag cannot be empty')
                    .meta({
                        description:
                            'One tag that works against the Hero, which the Narrator can invoke to Imperil them. Written without the surrounding braces and without the leading marker of the inline weakness syntax; belonging to this field is what makes it a weakness.',
                        examples: ['owes a debt', 'cannot refuse a dare'],
                    })
            )
            .optional()
            .meta({
                description:
                    'The tags this Story Theme turns against the Hero, in the order they are written on the sheet.',
            }),
        quest: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'What the Hero is trying to achieve through this Story Theme. Supports inline Markdown.',
                examples: [
                    'Return to the village and face what I owe the people I abandoned.',
                ],
            }),
        improve: z.coerce
            .number()
            .int()
            .min(0)
            .optional()
            .meta({
                description:
                    'How many times the Story Theme has been improved. No upper bound is encoded, since the cap belongs to the rules rather than to the interchange format.',
                examples: [0, 2],
            }),
        abandon: z.coerce
            .number()
            .int()
            .min(0)
            .optional()
            .meta({
                description:
                    'How many times the Story Theme has been abandoned.',
                examples: [0, 1],
            }),
        milestone: z.boolean().optional().meta({
            description:
                'Whether the Story Theme has reached a milestone and is ready to change.',
        }),
        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Story Theme's origin.",
        }),
    })
    .meta({
        description:
            'Legend in the Mist - Story Theme, one of the themes a Hero is built from, holding its title tag, the tags it grants, the tags it turns against the Hero, and the Quest it carries.',
    })

/** =========================
 *  Exported TS types
 *  ========================= */
export type StoryThemeMeta = z.infer<typeof MetaSchema>
export type LegendInTheMistStoryThemeData = z.infer<
    typeof LegendInTheMistStoryThemeSchema
>
