/* Editor strings of the Theme Kit template. English is the source of truth. */
const forms = {
    appearance: {
        columnsLabel: 'Columns',
        oneColumn: 'One column',
        twoColumns: 'Two columns',
    },
    stringList: {
        removeAriaLabel: 'Remove {{entry}}',
        addPlaceholder: 'Add...',
    },
    identity: {
        nameLabel: 'Themebook name',
        namePlaceholder: 'Personality',
        typeLabel: 'Theme type',
        typeHelp:
            'The type decides the banner and how the motivation zone is named. Switching it renames the zone without touching what you wrote in it.',
        keywordsLabel: 'Keywords',
        keywordPlaceholder: 'Add keyword...',
    },
    concept: {
        introductionLabel: 'Introduction',
        introductionPlaceholder:
            'The paragraph that pitches this theme to the player.',
        conceptLabel: 'Concept',
        conceptPlaceholder: 'You are who you are, and that is enough.',
        extraTagsLabel: 'Extra tags',
        extraTagPlaceholder: 'Add tag...',
        extraTagsHelp:
            'Tags the themebook hands out directly, without a question to answer.',
        titleGuidanceLabel: 'Title guidance',
        titleGuidancePlaceholder:
            'Name the part of yourself this theme is about.',
    },
    motivation: {
        kindEither: "Player's choice",
        crewNote:
            'A Crew themebook prints its crew relationships in place of a motivation, so this zone will not appear on the page.',
        writtenAs: 'Written as',
        fixedKind: 'A {{type}} themebook always writes this zone as {{zone}}.',
        introLabel: 'Intro line',
        introPlaceholder: 'What is the question you cannot stop asking?',
        introHelp:
            'The line the themebook prints above the zone. Supports inline Markdown.',
        examplesLabel: 'Examples',
        examplePlaceholder: 'Add example...',
        optionsLabel: 'Closed list',
        optionPlaceholder: 'Add option...',
        optionsHelp:
            'For the themebooks that offer a list to pick from instead of a blank line.',
        ruleLabel: 'Rule',
        rulePlaceholder:
            'When you answer this Mystery, the theme fades and you lose it.',
        remove: 'Remove the motivation zone',
    },
    questions: {
        powerTitle: 'Power tag questions',
        powerPlaceholder: 'What is the one thing you are best at?',
        weaknessTitle: 'Weakness tag questions',
        weaknessPlaceholder: 'What does that same strength cost you?',
        add: 'Add question',
        examplesLabel: 'Examples',
        examplePlaceholder: 'Add example...',
        howManyLabel: 'How many are answered',
        requiredLabel: 'Required',
        freeChoiceLabel: 'Free choice',
        noteLabel: 'Note',
        notePlaceholder:
            'Answer the first question, then two more of your choice.',
    },
    improvements: {
        heading: 'Improvements',
        countWarning:
            'Every themebook the books print carries five improvements; this one carries {{count}}.',
        add: 'Add improvement',
        rowLabel: 'Improvement {{n}}',
        namePlaceholder: 'Second Sight',
        effectLabel: 'Effect',
        effectPlaceholder: 'Take an additional power tag for this theme.',
    },
    crew: {
        heading: 'Crew relationships',
        offPageNote:
            'Only a Crew themebook prints these, so they stay off the page until you switch the theme type.',
        add: 'Add relationship',
        scenarioLabel: 'Scenario',
        outcomeLabel: 'What it does to the crew',
        outcomeHelp: 'Helps',
        outcomeHurt: 'Hurts',
        outcomeEither: 'Either',
    },
}

export default forms
