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
 *  Meta
 *  ========================= */

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                "Classifies the Loadout Item's source to aid cataloging and tooling.",
            examples: ['official', 'homebrew'],
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Source title (book, supplement, PDF) where this Loadout Item appears.',
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
                examples: [212, 226],
            }),
    })
    .meta({
        description:
            "Attribution and cataloging fields for the Loadout Item's origin.",
    })

/** =========================
 *  Loadout Item
 *  ========================= */

export const OtherscapeLoadoutItemSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Name is required')
            .default('Untitled Loadout Item')
            .meta({
                description:
                    "The item's name, as printed at the head of its Street Catalog entry. The same string is also the first entry of `feature_tags`, which is how the catalog prints it; both hold it, because one is the record's title and the other is a tag that gets invoked in play.",
                examples: [
                    'Kestrel Whisperlink',
                    'Sable-9 Sidearm',
                    'Ghost Rig',
                ],
            }),
        category: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'The Street Catalog rubric this item is filed under. Kept a free string rather than a closed set, so homebrew rubrics stay expressible. Same house rule as `category` on an :Otherscape Theme Kit, though the two hold unrelated things: that one names a themebook.',
                examples: [
                    'Weapons',
                    'Armor',
                    'Cybernetics',
                    'Drones',
                    'Source-Touched Items',
                    'Vehicles',
                ],
            }),
        description: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'The prose the catalog prints for this item: what it is and what carrying it says about you. Supports inline Markdown; use `\\n\\n` for paragraph breaks.',
                examples: [
                    'A throat-mounted relay that turns a whisper into a clean signal three blocks out.',
                ],
            }),
        feature_tags: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'A feature tag cannot be empty')
                    .meta({
                        description:
                            'One tag this item grants, which its bearer invokes to be Favored. Written without the surrounding braces of the inline tag syntax; a renderer adds them.',
                        examples: [
                            'Kestrel Whisperlink',
                            'subvocal, so nobody hears you talk',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    "The tags this item grants, in the order the catalog prints them. The first entry is the item's own name, which is the catalog's convention; it is not lifted into a field of its own, because here it is only a naming convention inside this list. Read `name` when the title is what is wanted.",
            }),
        weakness_tag: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'The one tag this item turns against its bearer, which the MC invokes to Imperil them. A single string rather than an array, because the catalog prints exactly one per specific item. Optional, because a few catalog entries print none. Written without the surrounding braces and without the leading marker of the inline weakness syntax.',
                examples: ['only as quiet as the room', 'runs hot'],
            }),
        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Loadout Item's origin.",
        }),
    })
    .meta({
        description:
            ":Otherscape - Loadout Item, one specific item of the Street Catalog: its name, the rubric it is filed under, its prose, the tags it grants and the one tag it turns against its bearer. It models the catalog's specific items only; the general-items blocks are a lookup table rather than a record and are left out.",
    })

/** =========================
 *  Exported TS types
 *  ========================= */
export type LoadoutItemMeta = z.infer<typeof MetaSchema>
export type OtherscapeLoadoutItemData = z.infer<
    typeof OtherscapeLoadoutItemSchema
>
