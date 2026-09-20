/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    basic: {
        nameLabel: 'Challenge name',
        namePlaceholder: 'e.g., Chrome Vulture Runner',
        scaleLabel: 'Scale',
        scaleHint:
            'Leave the scale empty for a person-sized Challenge. Larger counts up, and smaller counts down.',
        descriptionPlaceholder: 'Write a short summary of the challenge here...',
    },
    tags: {
        rawValueLabel: 'Raw value',
        rawValuePlaceholder:
            '{power tag}, {status-3}, {!weakness tag} or plain text',
        addEntry: 'Add entry',
        errorRequired: 'Please enter a value.',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    limits: {
        levelLabel: 'Level',
        levelTitle: '1–6',
        polarLabel: 'Polar limit',
        polarHint:
            'Two opposed poles written as one name, joined by a slash',
        progressLabel: 'Progress limit',
        onMaxPlaceholder: 'When this progress limit fills up…',
        addLimit: 'Add limit',
        errorNameRequired: 'Name is required.',
        errorDuplicateName: 'Limit name already exists.',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    specials: {
        descriptionMarkdownLabel: 'Description (Markdown)',
        descriptionPlaceholder: 'When this happens... then do that.',
        addSpecial: 'Add special',
        errorNameRequired: 'Name is required.',
        errorDescriptionRequired: 'Description is required.',
        noDescription: 'No description',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    consequences: {
        helperText:
            'What the Challenge costs the Crew whatever Threat is running. A Threat with consequences of its own keeps them in the Threats form.',
        addGeneralConsequence: 'Add general consequence',
        dragAriaLabel: 'Drag to reorder consequence',
        finishEditingToReorder: 'Finish editing to reorder',
        errorEmpty: 'Consequence cannot be empty.',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        typeOfficial: 'Official',
        typeThirdParty: 'Third Party',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Homebrew',
        sourceLabel: 'Source',
        sourceHint:
            'Selecting a source auto-fills authors. You can still edit below.',
        sourcePlaceholderOfficial: 'Select an official book...',
        sourcePlaceholderThirdParty: 'Select a third-party source...',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        sourceTitleLabelCauldron: 'Cauldron product title',
        sourceTitleLabelHomebrew: 'Homebrew title / location',
        sourceTitleLabelDefault: 'Source title',
        optionalSuffix: '(optional)',
        sourceTitlePlaceholderCauldron: 'e.g., Cauldron: Neon Debts',
        sourceTitlePlaceholderHomebrew: 'e.g., Personal blog, campaign doc...',
        sourceTitlePlaceholderDefault: 'Override selected source title',
        pageLabel: 'Page',
        authorsLabel: 'Authors',
        authorsPlaceholder: 'Add author...',
        removeAuthorAriaLabel: 'Remove {{author}}',
        footerHint:
            'Meta helps attribution & search and is preserved on import/export.',
    },
    appearance: {
        autoHideEmptyLabel: 'Auto-hide empty sections',
        sectionsHeading: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundHeading: 'Background',
        backgroundNeon: 'Neon',
        backgroundPlain: 'Plain',
        resetView: 'Reset view',
    },
    imageExport: {
        scaleHeading: 'Image scale',
    },
}

export default forms
