/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    basic: {
        nameLabel: 'Character Trope name',
        namePlaceholder: 'e.g., Neon Exorcist',
        categoryLabel: 'Category',
        categoryPlaceholder: 'e.g., MYSTICS & MEDIUMS',
        categoryHint:
            'The family of characters this trope belongs to, as the book files it.',
        descriptionPlaceholder:
            'Write a short summary of the character trope here...',
    },
    themeKits: {
        hint: 'The theme kits this trope grants outright. Spell the title tag and the category the way the kit itself spells them: that pair is what points at the kit.',
        titleTagLabel: 'Title tag',
        categoryLabel: 'Category',
        categoryPlaceholder: 'e.g., RITUAL',
        addButton: 'Add theme kit',
        noCategory: 'No category',
        finishEditingToReorder: 'Finish editing to reorder',
        titleTagRequired: 'Title tag is required.',
        categoryRequired: 'Category is required.',
    },
    choices: {
        hint: 'One of these theme kits, the player’s pick. Spell the title tag and the category the way the kit itself spells them: that pair is what points at the kit.',
        titleTagLabel: 'Title tag',
        categoryLabel: 'Category',
        categoryPlaceholder: 'e.g., RITUAL',
        addButton: 'Add choice',
        noCategory: 'No category',
        finishEditingToReorder: 'Finish editing to reorder',
        titleTagRequired: 'Title tag is required.',
        categoryRequired: 'Category is required.',
    },
    loadout: {
        hint: 'The gear the character walks in with. Write each entry the way it should print; it names what is carried rather than pointing at a loadout item document.',
        addButton: 'Add loadout entry',
        emptyEntryError: 'Loadout entry cannot be empty.',
        dragAriaLabel: 'Drag to reorder loadout entry',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        type: {
            official: 'Official',
            thirdParty: 'Third Party',
            cauldron: 'Cauldron',
            homebrew: 'Homebrew',
        },
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        selectOfficialBookPlaceholder: 'Select an official book...',
        selectThirdPartySourcePlaceholder: 'Select a third-party source...',
        sourceHint:
            'Selecting a source auto-fills authors. You can still edit below.',
        sourceTitleLabel: {
            cauldron: 'Cauldron product title',
            homebrew: 'Homebrew title / location',
            default: 'Source title',
        },
        sourceTitlePlaceholder: {
            cauldron: 'e.g., Cauldron: Neon Debts',
            homebrew: 'e.g., Personal blog, campaign doc...',
            default: 'Override selected source title',
        },
        optional: '(optional)',
        pageLabel: 'Page',
        pagePlaceholderExample: '71',
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
        backgroundOption: {
            neon: 'Neon',
            plain: 'Plain',
        },
        resetViewButton: 'Reset view',
    },
    imageExport: {
        scaleHeading: 'Image scale',
        scale1x: '1x',
        scale2x: '2x',
        scale3x: '3x',
    },
}

export default forms
