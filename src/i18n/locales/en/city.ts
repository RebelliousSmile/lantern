/* English source of truth for this game family's templates; the French file is typed against it. */
const city = {
    danger: {
        label: 'Danger',
        newTitle: 'New Danger',
        exportToml: 'Export the current danger data as TOML.',
        exportPng: 'Export the current danger preview as PNG.',
        sections: {
            description: 'Description',
            spectrums: 'Spectrums',
            customMoves: 'Custom Moves',
            hardMoves: 'Hard Moves',
            softMoves: 'Soft Moves',
            meta: 'Meta footer',
        },
    },
    customMove: {
        label: 'Custom Move',
        newTitle: 'New Custom Move',
        description:
            'A Custom Move is a rule the MC writes for one situation: what triggers it, what the players roll if they roll at all, and what each outcome does. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current custom move data as TOML.',
        exportPng: 'Export the current custom move card as PNG.',
        sections: {
            trigger: 'Trigger',
            roll: 'Roll',
            outcomes: 'Outcomes',
            meta: 'Meta footer',
        },
        tiers: {
            miss: 'Miss',
            hit: 'Hit',
        },
        warnings: {
            repeatedTiers:
                'Outcome tiers written twice: {{tiers}}. The card prints both rows under the same heading.',
            unreachableTwelve:
                'A 12+ outcome on a move that calls for no roll: nothing can produce that result, so the row never applies.',
            overPicked:
                'Outcomes asking for more options than they list: {{outcomes}}.',
            overPickedItem: '{{tier}} (choose {{count}} of {{total}})',
        },
    },
    themeKit: {
        label: 'Theme Kit',
        newTitle: 'New Theme Kit',
        description:
            'A Theme Kit is a themebook: the blank questionnaire a player fills in to build a theme, with its lettered questions, its selection rules and its five improvements. The filled card is the separate Theme Card. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current themebook data as TOML.',
        exportPng: 'Export the current themebook page as PNG.',
        sections: {
            introduction: 'Introduction',
            concept: 'Concept',
            powerTags: 'Power tag questions',
            weaknessTags: 'Weakness tag questions',
            extraTags: 'Extra tags',
            motivation: 'Motivation',
            titleGuidance: 'Title guidance',
            crewRelationships: 'Crew relationships',
            improvements: 'Improvements',
            meta: 'Meta footer',
        },
        warnings: {
            improvementCount:
                'Every themebook the books print carries five improvements; this one carries {{count}}.',
            powerOutOfSequence:
                'Power tag questions should be lettered A, B, C down the list; found {{detail}}.',
            weaknessOutOfSequence:
                'Weakness tag questions should be lettered A, B, C down the list; found {{detail}}.',
            outOfSequenceItem: '{{letter}} at position {{position}}',
            crewWithoutRelationships:
                'A Crew themebook prints its crew relationships in place of a motivation, and this one carries none.',
            relationshipsWithoutCrew:
                'Crew relationships only print on a Crew themebook, so these will not appear.',
        },
    },
    themeCard: {
        label: 'Theme Card',
        newTitle: 'New Theme Card',
        description:
            'Choose how to start this theme card: blank, example, or import from TOML.',
        exportToml: 'Export the current theme card data as TOML.',
        exportPng: 'Export the current theme card preview as PNG.',
        sections: {
            motivation: 'Motivation',
            tracks: 'Tracks',
            powerTags: 'Power tags',
            weaknessTags: 'Weakness tags',
            improvements: 'Improvements',
            meta: 'Meta footer',
        },
        warnings: {
            mythosErosion:
                'Mythos cards use Fade, but this card carries {{kind}}.',
            logosErosion:
                'Logos cards use Crack, but this card carries {{kind}}.',
            crewErosion:
                'Crew cards carry no erosion track, so this track will not print.',
            weaknessLetters:
                '{{themebook}} has weakness questions A to D, but these tags cite other letters: {{letters}}.',
        },
    },
}

export default city
