/* Editor strings of the PbtA Playbook template. English is the source of truth. */
const forms = {
    entry: {
        ref: 'Ref',
        inline: 'Inline',
    },
    labels: {
        tags: 'Tags',
    },
    moveFields: {
        name: 'Move name',
        resultLabelPlaceholder: 'Label, e.g. 10+',
        removeResult: 'Remove {{key}} result',
        resultKeyPlaceholder: 'Result key, e.g. strong',
        addResult: 'Add result',
        moveTypeKeyPlaceholder: 'Move type key',
        audience: 'Audience',
        triggerPlaceholder: 'Trigger, e.g. you act despite danger',
        roll: 'Roll',
        rollTypePlaceholder: 'type',
        rollFormulaPlaceholder: 'formula, e.g. 2d6+Nerve',
        rollModPlaceholder: 'mod',
        removeRoll: 'Remove roll',
        addRoll: 'Add roll',
        results: 'Results',
        usesPlaceholder: 'Uses (optional)',
        choicesPlaceholder: 'Choices note (optional)',
    },
    choiceSets: {
        grantedPlaceholder: 'granted',
        advancementPlaceholder: 'advancement',
        removeChoice: 'Remove choice',
        single: 'Single',
        multi: 'Multi',
        repeatable: 'Repeatable',
        grantOnPlaceholder: 'Granted on, e.g. creation',
        choices: 'Choices',
        addChoice: 'Add choice',
        addChoiceSet: 'Add choice set',
    },
    creation: {
        labelPlaceholder: 'Label, e.g. Name',
        add: 'Add entry',
    },
    gear: {
        typeKeyPlaceholder: 'Type key',
        quantityPlaceholder: 'Qty',
        add: 'Add gear',
    },
    audience: {
        any: 'Any',
        character: 'Character',
        npc: 'NPC',
        mc: 'MC',
    },
    moves: {
        acquired: 'Move acquired',
        remove: 'Remove move',
        add: 'Add move',
    },
    readOnly: {
        title: 'Read-only',
        description:
            'Open the "{{game}}" game definition tab to edit this playbook. Without it, its stats and moves can\'t be validated against the game, so editing is disabled.',
    },
    basic: {
        title: 'Playbook',
        name: 'Playbook name',
        slug: 'Slug',
        game: 'Game id',
    },
    creationForm: {
        invalidTarget:
            'This question must target an available Text or LongText attribute for one answer, or a ListMany attribute for multiple answers.',
        apply: 'Apply selection',
    },
    movesForm: {
        moves: 'Moves',
        startingMoves: 'Starting moves',
        slugPlaceholder: 'Add move slug and press Enter',
    },
    statsForm: {
        profile: 'Starting stat profile',
        stats: 'Stats',
        detail: 'Stats detail',
        attributes: 'Attributes',
        attributesHint:
            "Open this playbook's game definition tab (same game id) to edit its attributes here.",
    },
}

export default forms
