import { z } from 'zod'

/** =========================
 *  Enums
 *  ========================= */

export const PublicationTypeEnum = z
    .enum(['official', 'third_party', 'cauldron', 'homebrew'])
    .meta({
        description:
            'Where this content comes from. Use to help downstream tools filter sources.',
        examples: ['official', 'homebrew'],
    })
export type PublicationType = z.infer<typeof PublicationTypeEnum>

/** =========================
 *  Subschemas
 *  ========================= */

// The granted kits and the ones the player picks between are the same thing
// written twice, so the entry shape is declared once here and used by both
// lists. Both fields are required and spelled exactly as on the kit itself, so
// a pair resolves against a kit record with no mapping table in between.
export const ThemeKitRefSchema = z
    .object({
        title_tag: z
            .string()
            .trim()
            .min(1, 'Theme kit title tag is required')
            .meta({
                description:
                    'Title tag of the theme kit, spelled as the kit itself spells it.',
                examples: [
                    'Rites Of The Cold Signal',
                    'Licensed Cleanser',
                    'Warded Handset',
                ],
            }),
        category: z
            .string()
            .trim()
            .min(1, 'Theme kit category is required')
            .meta({
                description:
                    'Category the theme kit is filed under, as printed on the kit.',
                examples: ['RITUAL', 'AFFILIATION', 'ARTIFACT'],
            }),
    })
    .meta({
        description:
            'A reference to a theme kit, by the two fields that identify one. It names a kit, it does not carry it: the kit itself is an `otherscape/theme-kit` document of its own.',
    })

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                "Classifies the Character Trope's source to aid cataloging and tooling.",
            examples: ['official', 'homebrew'],
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Source title (book, supplement, PDF) where this Character Trope appears.',
                examples: [
                    'Metro:Otherscape - Core Book',
                    'Cairo:Otherscape - Playtest',
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
                examples: [64, 71],
            }),
    })
    .meta({
        description:
            "Attribution and cataloging fields for the Character Trope's origin.",
    })

/** =========================
 *  Root schema
 *  ========================= */

export const OtherscapeCharacterTropeSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Character Trope name is required')
            .default('Untitled Character Trope')
            .meta({
                description: 'The name/title of the Character Trope.',
                examples: ['Neon Exorcist', 'Corporate Fixer', 'Street Oracle'],
            }),
        category: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'The family of characters this trope belongs to. A free label rather than a themebook: it groups tropes on the page, nothing resolves against it.',
                examples: ['MYSTICS & MEDIUMS', 'FIXERS', 'RUNNERS'],
            }),
        description: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Short player-facing summary of who this trope is. One string rather than a list of lines: paragraph breaks are carried by newlines. Supports inline Markdown.',
                examples: [
                    'Something walked out of the Source and into the grid, and it has been wearing other people’s hardware ever since.',
                ],
            }),
        theme_kits: z.array(ThemeKitRefSchema).optional().meta({
            description:
                'The theme kits this trope grants outright, before the player chooses anything.',
        }),
        choices: z.array(ThemeKitRefSchema).optional().meta({
            description:
                'The theme kits this trope offers to pick between, in the same shape as the granted ones.',
        }),
        loadout: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Loadout entry cannot be empty')
                    .meta({
                        description:
                            'One piece of starting gear, transcribed as printed, parentheticals included.',
                        examples: [
                            'salt-line projector (requires setup)',
                            'prayer deck (all: incriminating)',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    'The gear this trope starts with, as prose. These entries deliberately do not resolve against `otherscape/loadout-item`: they name what the character carries, they are not catalog keys.',
            }),
        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Character Trope's origin.",
        }),
    })
    .meta({
        description:
            ':Otherscape - Character Trope, a starting package of theme kits and gear. A composite, but a flat one: it embeds the names of the kits it grants, not the kits themselves.',
    })

/** =========================
 *  Exported TS types
 *  ========================= */
export type ThemeKitRef = z.infer<typeof ThemeKitRefSchema>
export type CharacterTropeMeta = z.infer<typeof MetaSchema>
export type OtherscapeCharacterTropeData = z.infer<
    typeof OtherscapeCharacterTropeSchema
>
