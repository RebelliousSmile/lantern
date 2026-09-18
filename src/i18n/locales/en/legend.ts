/* English source of truth for this game family's templates; the French file is typed against it. */
const legend = {
    challenge: {
        label: 'Challenge',
        newTitle: 'New Challenge',
        exportToml: 'Export the current challenge data as TOML.',
        exportPng: 'Export the current challenge preview as PNG.',
        sections: {
            rolesDesc: 'Roles & Description',
            limits: 'Limits',
            tagsStatuses: 'Tags & Statuses',
            might: 'Might',
            specialFeatures: 'Special Features',
            threats: 'Threats',
            generalConsequences: 'General Consequences',
            meta: 'Meta footer',
        },
        warnings: {
            unknownRoles: 'Unknown role(s): {{roles}}.',
            unrecognizedTokens:
                "Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: {{tokens}}.",
            limitTokens:
                'Limit-like tokens were found in Tags & Statuses and will be ignored by some tools: {{tokens}}. Consider moving them to the Limits section.',
            progressWithoutOnMax:
                'Progress limit(s) without "on_max": {{limits}}.',
        },
    },
    journey: {
        label: 'Journey',
        newTitle: 'New Journey',
        description:
            'A Journey is the stretch of story between two places: a road crossed, an occasion lived through, or a task carried out. It carries the tags it offers, what the heroes gain by making it through, what it can cost anywhere along the way, and the vignettes it breaks down into. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current journey data as TOML.',
        exportPng: 'Export the current journey spread as PNG.',
        sections: {
            description: 'Description',
            tags: 'Tags',
            benefits: 'Benefits',
            consequences: 'General consequences',
            vignettes: 'Vignettes',
            meta: 'Meta footer',
        },
        warnings: {
            bracedTags:
                'Tags written with braces: {{tags}}. They are added when the sheet is rendered, so the braces will show up twice.',
            statusLikeTags:
                'Tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag. A status the Journey hands out belongs in its Consequences.',
            unnamedVignette: 'an unnamed vignette',
            vignettesWithoutConsequence:
                'Vignettes with no Consequence: {{vignettes}}. A vignette carries at least one, and the file cannot be exported until each of these does.',
            noConsequence:
                'This Journey costs nothing anywhere along it: no general Consequence and no vignette to draw one from.',
            noTags: 'This Journey offers no tag, so there is nothing for a Hero to invoke while crossing it.',
        },
    },
    storyTheme: {
        label: 'Story Theme',
        newTitle: 'New Story Theme',
        exportToml: 'Export the current story theme data as TOML.',
        exportPng: 'Export the current story theme preview as PNG.',
        sections: {
            category: 'Category',
            powerTags: 'Power tags',
            weaknessTags: 'Weakness tags',
            quest: 'Quest & tracks',
            meta: 'Meta footer',
        },
        warnings: {
            power: {
                braced: 'Power tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Power tags written with a leading "!": {{tags}}. A tag that works against the Hero belongs in Weakness tags.',
                statusLike:
                    'Power tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            weakness: {
                braced: 'Weakness tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Weakness tags written with a leading "!": {{tags}}. Weakness tags are already marked by the field they are in.',
                statusLike:
                    'Weakness tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            noTags: 'This Story Theme grants no tags, so there is nothing for a Hero to invoke.',
        },
    },
    themeKit: {
        label: 'Theme Kit',
        newTitle: 'New Theme Kit',
        description:
            'A Theme Kit is the card a themebook offers a Hero: a name, the power and weakness tags it suggests, the quest it points at, and the improvements it opens up. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current theme kit data as TOML.',
        exportPng: 'Export the current theme kit card as PNG.',
        sections: {
            powerTags: 'Power tags',
            weaknessTags: 'Weakness tags',
            quest: 'Quest',
            improvements: 'Improvements',
            meta: 'Meta footer',
        },
        warnings: {
            power: {
                braced: 'Power tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Power tags written with a leading "!": {{tags}}. A tag that works against the Hero belongs in Weakness tags.',
                statusLike:
                    'Power tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            weakness: {
                braced: 'Weakness tags written with braces: {{tags}}. They are added when the card is rendered, so the braces will show up twice.',
                marked: 'Weakness tags written with a leading "!": {{tags}}. Weakness tags are already marked by the field they are in.',
                statusLike:
                    'Weakness tags that read as a status or a limit: {{tags}}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.',
            },
            noTags: 'This Theme Kit suggests no tags, so there is nothing for a Hero to pick from.',
            improvementsWithoutEffect:
                'Improvements named without an effect: {{improvements}}. The card prints the label alone, which is right only if the themebook states nothing more.',
        },
    },
}

export default legend
