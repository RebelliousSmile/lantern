/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    editorPanel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    shared: {
        optional: '(optional)',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    basic: {
        nameLabel: 'Kit name',
        namePlaceholder: 'The Hedge Witch',
        nameHint: 'A printed label, not a tag: write it without braces.',
        categoryLabel: 'Themebook',
        categoryPlaceholder: 'Personality, Expertise, Training...',
        categoryHint:
            'Printed in the header bar. Left empty, the bar still shows.',
    },
    quest: {
        label: 'Quest',
        placeholder: 'Heal someone the village has already given up on.',
        hint: 'The quest the kit suggests. A hero makes it their own when they fill the kit in. Markdown and braced tags are rendered on the card.',
    },
    tags: {
        power: { fieldLabel: 'Power tags' },
        weakness: { fieldLabel: 'Weakness tags' },
        hint: 'Write tags bare, without braces.',
        tagLabel: 'Tag',
        tagPlaceholder: 'knows which roots bite back',
        errorRequired: 'Please enter a value.',
        addButton: 'Add tag',
    },
    improvements: {
        heading: 'Improvements',
        subheading: 'The options this kit offers.',
        nameLabel: 'Name',
        namePlaceholder: 'Second Sight',
        effectLabel: 'Effect',
        effectPlaceholder: 'What the improvement lets the hero do.',
        errorNameRequired: 'An improvement needs a name.',
        noEffectWritten: 'no effect written',
        addButton: 'Add improvement',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        types: {
            official: 'Official',
            thirdParty: 'Third Party',
            cauldron: 'Cauldron',
            homebrew: 'Homebrew',
        },
        sourceLabel: 'Source',
        sourceHint:
            'Selecting a source auto-fills authors. You can still edit below.',
        sourcePlaceholderOfficial: 'Select an official book...',
        sourcePlaceholderThirdParty: 'Select a third-party source...',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        sourceTitleLabel: {
            cauldron: 'Cauldron product title',
            homebrew: 'Homebrew title / location',
            default: 'Source title',
        },
        sourceTitlePlaceholder: {
            cauldron: 'e.g., Cauldron: Shadows in Brine',
            homebrew: 'e.g., Personal blog, campaign doc...',
            default: 'Override selected source title',
        },
        pageLabel: 'Page',
        pagePlaceholder: '142',
        authorsLabel: 'Authors',
        authorsAddPlaceholder: 'Add author...',
        authorsInputDefaultPlaceholder: 'Add author and press Enter',
        removeAuthorAria: 'Remove {{author}}',
        hint: 'Meta helps attribution & search and is preserved on import/export.',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        sectionsHeading: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundHeading: 'Background',
        backgroundParchment: 'Parchment',
        backgroundPlain: 'Plain',
        resetView: 'Reset view',
    },
    exportSettings: {
        imageScaleHeading: 'Image scale',
    },
}

export default forms
