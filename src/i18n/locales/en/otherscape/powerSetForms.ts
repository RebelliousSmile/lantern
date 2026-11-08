/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    basic: {
        nameLabel: 'Power Set name',
        namePlaceholder: 'e.g., Source-Touched Berserk',
        typeLabel: 'Type',
        typeHint:
            'The type colours the card and says where the power comes from: Self from the person, Mythos from something older, Noise from the network.',
        typeOptions: {
            self: 'Self',
            mythos: 'Mythos',
            noise: 'Noise',
        },
        descriptionPlaceholder:
            'Write a short summary of the power set here...',
        ratingLabel: 'Added rating',
        ratingNone: 'None',
        optionalRatingLabel: 'Optional stars',
        ratingHint:
            'Stars the Power Set adds to the Challenge it is grafted onto, printed +⊕ beside its name. Optional stars print in parentheses, +⊕(⊕), and need a rating.',
    },
    tags: {
        label: 'Tags and statuses, one per line',
        placeholder: '{enraged-2}\n{skin like scrap iron}',
        hint: 'What the Power Set adds to the Challenge, written with their braces as on a Challenge, so the list copies across.',
    },
    specials: {
        nameRequiredError: 'Name is required.',
        descriptionRequiredError: 'Description is required.',
        descriptionHint: '(Markdown)',
        descriptionPlaceholder: 'When this happens... then do that.',
        addButton: 'Add special',
        dragTitleDisabled: 'Finish editing to reorder',
        noDescription: 'No description',
    },
    consequences: {
        emptyError: 'Consequence cannot be empty.',
        addButton: 'Add general consequence',
        hint: 'What the Power Set costs the Crew whatever Threat is running. A Threat with consequences of its own keeps them in the Threats form.',
        dragTitleDisabled: 'Finish editing to reorder',
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
        authorsPlaceholderDefault: 'Add author and press Enter',
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
