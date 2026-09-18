/* English source of truth for this game family's templates; the French file is typed against it. */
const otherscape = {
    /* Messages several templates raise word for word. */
    warnings: {
        invalidTokens:
            "Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: {{tokens}}.",
        titleRepeated:
            'The title tag is repeated in Power tags: {{title}}. The card already prints it as the title, so it would appear twice.',
        power: {
            braced: 'Power tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
            marked: 'Power tags written with a leading "!": {{tags}}. A tag that works against the character belongs in Weakness tags.',
            statusLike:
                'Power tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
        },
        weakness: {
            braced: 'Weakness tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
            marked: 'Weakness tags written with a leading "!": {{tags}}. Weakness tags are already marked by the field they are in.',
            statusLike:
                'Weakness tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
        },
    },
    challenge: {
        label: 'Challenge',
        newTitle: 'New Challenge',
        description:
            'A Challenge is anything the Crew has to get through: its scale, the tags and statuses on it, the Limits that stop it, the Specials it breaks the rules with, and the Threats it answers with. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current challenge data as TOML.',
        exportPng: 'Export the current challenge preview as PNG.',
        sections: {
            description: 'Description',
            tagsStatuses: 'Tags & Statuses',
            limits: 'Limits',
            specials: 'Specials',
            threats: 'Threats',
            generalConsequences: 'General Consequences',
            meta: 'Meta footer',
        },
        warnings: {
            limitTokens:
                'Limit-like tokens were found in Tags & Statuses and will be ignored by some tools: {{tokens}}. Consider moving them to the Limits section.',
            progressWithoutOnMax:
                'Progress limit(s) without "on_max": {{limits}}. The track fills up and nothing is printed for it.',
            polarWithoutSlash:
                'Polar limit(s) with no "/" in their name: {{limits}}. A polar Limit joins its two poles with a slash, as in "catch/outrun".',
            onMaxWithoutProgress:
                'Limit(s) carrying an "on_max" outcome without being a progress track: {{limits}}. The outcome will never be reached.',
            noLimits:
                'This Challenge has no Limits, so there is no printed way to overcome it.',
        },
    },
    characterTrope: {
        label: 'Character Trope',
        newTitle: 'New Character Trope',
        description:
            'A Character Trope is a ready-made character package: the theme kits it grants, the kits it offers a pick between, and the gear it starts with. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current character trope data as TOML.',
        exportPng: 'Export the current character trope preview as PNG.',
        sections: {
            description: 'Description',
            themeKits: 'Theme kits',
            choices: 'Choices',
            loadout: 'Loadout',
            meta: 'Meta footer',
        },
        warnings: {
            grantsNothing:
                'This Character Trope grants no theme kit and offers none to pick, so it hands a player nothing to build on.',
            singleChoice:
                'Only one entry sits under Choices, so there is nothing to choose between. Move it to the granted theme kits, or add the options it is meant to compete with.',
            grantedAndOffered:
                'Some theme kits are both granted and offered as a choice: {{kits}}.',
        },
    },
    loadoutItem: {
        label: 'Loadout Item',
        newTitle: 'New Loadout Item',
        description:
            'A Loadout Item is one entry of the Street Catalog: its name, the rubric it is filed under, the prose the catalog prints, the tags it grants, and the one tag it turns against its bearer. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current loadout item data as TOML.',
        exportPng: 'Export the current loadout item card as PNG.',
        sections: {
            description: 'Description',
            featureTags: 'Feature tags',
            weaknessTag: 'Weakness tag',
            meta: 'Meta footer',
        },
        warnings: {
            feature: {
                braced: 'Feature tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Feature tags written with a leading "!": {{tags}}. A tag that works against its bearer belongs in the weakness tag.',
                statusLike:
                    'Feature tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            weakness: {
                braced: 'Weakness tag written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Weakness tag written with a leading "!": {{tags}}. The weakness tag is already marked by the field it is in.',
                statusLike:
                    'Weakness tag that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            noTags: 'This Loadout Item grants no tags, so there is nothing to invoke it with.',
            firstTagNotName:
                'The first feature tag is "{{firstTag}}" rather than the item\'s name, "{{name}}". The Street Catalog opens the list with the name, and the card prints the rest of the list under it.',
        },
    },
    powerSet: {
        label: 'Power Set',
        newTitle: 'New Power Set',
        description:
            'A Power Set is a bundle of Specials, Threats and Consequences drawn from the Self, the Mythos or the Noise, published on its own and grafted onto any Challenge. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current power set data as TOML.',
        exportPng: 'Export the current power set preview as PNG.',
        sections: {
            description: 'Description',
            specials: 'Specials',
            threats: 'Threats',
            generalConsequences: 'General Consequences',
            meta: 'Meta footer',
        },
        warnings: {
            grantsNothing:
                'This Power Set grants no Specials and no Threats, so grafting it onto a Challenge changes nothing.',
        },
    },
    theme: {
        label: 'Theme',
        newTitle: 'New Theme',
        description:
            'A Theme is a card a character has made their own: a title tag, the theme type it belongs to, its power and weakness tags, the quest it sets, and the Upgrade and Decay tracks holding how far it has been played. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current theme data as TOML.',
        exportPng: 'Export the current theme card as PNG.',
        sections: {
            powerTags: 'Power tags',
            weaknessTags: 'Weakness tags',
            quest: 'Quest',
            tracks: 'Tracks',
            meta: 'Meta footer',
        },
        warnings: {
            noTags: 'This Theme carries no tags, so there is nothing to invoke it with.',
        },
    },
    themeKit: {
        label: 'Theme Kit',
        newTitle: 'New Theme Kit',
        description:
            'A Theme Kit is the card a themebook offers a character: a title tag, the theme type it belongs to, the power and weakness tags it suggests, and the quest it sets. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current theme kit data as TOML.',
        exportPng: 'Export the current theme kit card as PNG.',
        sections: {
            powerTags: 'Power tags',
            weaknessTags: 'Weakness tags',
            quest: 'Quest',
            meta: 'Meta footer',
        },
        warnings: {
            noTags: 'This Theme Kit suggests no tags, so there is nothing for a character to pick from.',
        },
    },
}

export default otherscape
