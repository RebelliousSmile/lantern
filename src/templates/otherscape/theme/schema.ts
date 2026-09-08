import { z } from 'zod'

/** =========================
 *  Enums
 *  ========================= */

export const ThemeTypeEnum = z.enum(['self', 'mythos', 'noise', 'crew']).meta({
    description:
        'Which kind of theme this is. The three character theme types, plus `crew` for the Crew Themes, which are printed with the identical anatomy. Required and deliberately left without a default: none of the four is a neutral starting value.',
    examples: ['self', 'mythos', 'noise', 'crew'],
})
export type ThemeType = z.infer<typeof ThemeTypeEnum>

export const PublicationTypeEnum = z
    .enum(['official', 'third_party', 'cauldron', 'homebrew'])
    .meta({
        description:
            'Where this content comes from. Use to help downstream tools filter sources.',
        examples: ['official', 'homebrew'],
    })
export type PublicationType = z.infer<typeof PublicationTypeEnum>

/** =========================
 *  Meta
 *  ========================= */

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                "Classifies the Theme's source to aid cataloging and tooling.",
            examples: ['official', 'homebrew'],
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Source title (book, supplement, PDF) where this Theme appears.',
                examples: [
                    'Metro:Otherscape - Core Book',
                    'Tokyo:Otherscape - Setting Book',
                ],
            }),
        authors: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Author name cannot be empty')
                    .meta({
                        description: 'One credited author name.',
                        examples: ['Son of Oak', '4rtamis'],
                    })
            )
            .optional()
            .meta({
                description: 'List of credited authors or contributors.',
            }),
        page: z.coerce
            .number()
            .int()
            .min(1)
            .optional()
            .meta({
                description: 'Page number (if relevant to the source).',
                examples: [96, 118],
            }),
    })
    .meta({
        description:
            "Attribution and cataloging fields for the Theme's origin.",
    })

/** =========================
 *  Theme
 *  ========================= */

export const OtherscapeThemeSchema = z
    .object({
        title_tag: z
            .string()
            .trim()
            .min(1, 'Title tag is required')
            .default('Untitled Theme')
            .meta({
                description:
                    "The theme's title tag, which is also how the theme is named: the printed card is a `THEMEBOOK THEMETYPE` header followed by this tag alone on its line, and two themes sharing a header are told apart by it. There is therefore no separate `name` field. Written without the surrounding braces of the inline tag syntax, and not repeated inside `power_tags`.",
                examples: [
                    'The Debt I Never Paid',
                    'Back-Alley Ripperdoc',
                    'Forbidden Cult',
                ],
            }),
        theme_type: ThemeTypeEnum,
        category: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Themebook this Theme belongs to, held as the name printed in the card header. Kept a free string rather than a closed set, so that homebrew themebooks remain expressible. Same field, same spelling as on an :Otherscape Theme Kit, so the value copies across unchanged.',
                examples: [
                    'EXPERTISE',
                    'AFFILIATION',
                    'AUGMENTATION',
                    'ARTIFACT',
                    'PERSONALITY',
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
                            'One tag this Theme carries, which the character invokes to be Favored. Written without the surrounding braces of the inline tag syntax; a renderer adds them.',
                        examples: [
                            'they still take my call',
                            'knows what the favour was worth',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    'The tags this Theme carries, in the order they are printed. The title tag is not repeated here.',
            }),
        weakness_tags: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'A weakness tag cannot be empty')
                    .meta({
                        description:
                            'One tag on this Theme that works against the character, which the MC can invoke to Imperil them. Written without the surrounding braces and without the leading marker of the inline weakness syntax; belonging to this field is what makes it a weakness.',
                        examples: [
                            'cannot refuse when they ask',
                            'owes the wrong people',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    'The tags on this Theme that turn against the character, in the order they are printed.',
            }),
        quest: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'The one Quest line this Theme prints, whatever the sheet labels it: Identity on a Self theme, Ritual on a Mythos theme, Itch on a Noise theme. One field rather than three mutually exclusive ones; read `theme_type` for the label it carries. Supports inline Markdown.',
                examples: [
                    'Settle the debt on my own terms, before someone else names them for me.',
                    'Find out what the Source wanted with you.',
                ],
            }),
        upgrade: z.coerce
            .number()
            .int()
            .min(0, 'Upgrade runs from 0 to 3')
            .max(3, 'Upgrade runs from 0 to 3')
            .optional()
            .meta({
                description:
                    'Marks on the Upgrade track, from 0 to 3. Left absent on a theme whose track has never been touched: absent and zero read the same at the table, and writing a zero would claim the track was played and then cleared. Deliberately without a default for that reason.',
                examples: [0, 2, 3],
            }),
        decay: z.coerce
            .number()
            .int()
            .min(0, 'Decay runs from 0 to 3')
            .max(3, 'Decay runs from 0 to 3')
            .optional()
            .meta({
                description:
                    'Marks on the Decay track, from 0 to 3, read the same way as `upgrade`. Absent rather than zero while the track is untouched.',
                examples: [0, 1, 3],
            }),
        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Theme's origin.",
        }),
    })
    .meta({
        description:
            ':Otherscape - Theme, a card a character has made their own: the title tag, the power and weakness tags, the Quest it sets, and the two tracks holding how far it has been played. It carries no `level` and no `milestone`, which belong to Legend in the Mist rather than to :Otherscape, and no `improvements`, because Theme Specials are printed on the themebook rather than on the theme.',
    })

/** =========================
 *  Exported TS types
 *  ========================= */
export type ThemeMeta = z.infer<typeof MetaSchema>
export type OtherscapeThemeData = z.infer<typeof OtherscapeThemeSchema>
