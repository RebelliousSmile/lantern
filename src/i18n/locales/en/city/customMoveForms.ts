/* Editor strings of the Custom Move template. English is the source of truth. */
const forms = {
    trigger: {
        nameLabel: 'Move name',
        namePlaceholder: 'e.g., War-Torn City',
        impactLabel: 'Impact (0-3)',
        kindLabel: 'Kind',
        kindDanger: 'Danger',
        kindDangerHint: 'Belongs to a danger and fires when it acts.',
        kindSituational: 'Situational',
        kindSituationalHint:
            'Belongs to a place or a situation the crew walks into.',
        kindImprovement: 'Improvement',
        kindImprovementHint:
            'Belongs to a theme and is bought as an improvement.',
        triggerLabel: 'Trigger',
        triggerPlaceholder: 'When you spend a day in the war-torn city,',
        triggerHelp:
            'Supports Markdown. A trigger reads as the opening half of a sentence the outcomes finish.',
        frequencyLabel: 'Frequency',
        frequencyPlaceholder: 'e.g., Once per day spent in the city.',
        mcNoteLabel: 'MC note',
        mcNotePlaceholder: 'How to run the move at the table.',
    },
    roll: {
        empty: 'This move calls for no roll: the card prints its outcome without a roll line.',
        add: 'Add a roll',
        remove: 'Remove the roll',
        statLabel: 'Stat',
        statPower: 'Power',
        statMythos: 'Mythos',
        statLogos: 'Logos',
        statCustom: 'Custom',
        labelCustom: 'What is rolled',
        labelOverride: 'Label override',
        labelPlaceholder: "e.g., the tier of the city's {war-torn} status",
        modifierLabel: 'Modifier',
    },
    outcomes: {
        tierLabel: 'Tier',
        tierMiss: 'Miss',
        tier7to9: '7-9',
        tier10plus: '10+',
        tier12plus: '12+',
        tierHit: 'Hit',
        textLabel: 'Text',
        textPlaceholder: 'Describe what happens.',
        optionsLabel: 'Options, one per line',
        optionsPlaceholder:
            'You lose something you carried.\nSomeone notices where you were.',
        pickCountLabel: 'Choose how many',
        add: 'Add outcome',
        errorTextRequired: 'Outcome text is required.',
        optionCount_one: '{{count}} option',
        optionCount_other: '{{count}} options',
    },
    templateGuide: {
        label: 'Start from a Toolkit template',
        generate: 'Generate trigger and outcomes',
        overwriteHelp:
            'Overwrites the trigger and the outcomes with editable text.',
        activeShield: {
            name: 'Active Shield',
            summary:
                'A status that defends on its own against one kind of attack.',
            statusLabel: 'Shield status',
            statusPlaceholder: 'e.g., warded',
            threatLabel: 'What it defends against',
            threatPlaceholder: 'e.g., a supernatural attack',
        },
        countdownOutcome: {
            name: 'Countdown Outcome',
            summary:
                'A recurring situation whose cost rises as a status climbs its tiers.',
            eventLabel: 'What the players do',
            eventPlaceholder: 'e.g., spend a day in the war-torn city',
            statusLabel: 'Status that counts up',
            statusPlaceholder: 'e.g., war-torn',
        },
        startingStatus: {
            name: 'Starting Status',
            summary:
                'A scene or a situation that hands out a status before anything is rolled.',
            situationLabel: 'When it applies',
            situationPlaceholder: 'e.g., you enter the flooded district',
            statusLabel: 'Status handed out',
            statusPlaceholder: 'e.g., soaked-2',
        },
        statusFilter: {
            name: 'Status Filter',
            summary:
                'A status that changes what another move is allowed to do.',
            statusLabel: 'Status doing the filtering',
            statusPlaceholder: 'e.g., unseen',
            effectLabel: 'What it blocks or allows',
            effectPlaceholder: 'e.g., no one can target you directly',
        },
        statusPayload: {
            name: 'Status Payload',
            summary:
                'A status that fires something off once it reaches a given tier.',
            statusLabel: 'Status carrying the payload',
            statusPlaceholder: 'e.g., overloaded',
            payloadLabel: 'What it does when it goes off',
            payloadPlaceholder: 'e.g., it detonates and hits everyone nearby',
        },
    },
}

export default forms
