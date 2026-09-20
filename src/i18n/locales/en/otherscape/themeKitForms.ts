/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    themeType: {
        self: 'Self',
        mythos: 'Mythos',
        noise: 'Noise',
        crew: 'Crew',
    },
    questLabel: {
        self: 'Identity',
        mythos: 'Ritual',
        noise: 'Itch',
        crew: 'Motivation',
    },
    optional: '(optional)',
    basic: {
        titleTagLabel: 'Title tag',
        titleTagPlaceholder: 'Back-Alley Ripperdoc',
        titleTagHint:
            'The card prints it as its title, so write it bare, without braces, and leave it out of the power tags.',
        themeTypeLabel: 'Theme type',
        themeTypeHint: {
            self: "Sets the card's colour and what its quest is called: Identity for a Self theme.",
            mythos: "Sets the card's colour and what its quest is called: Ritual for a Mythos theme.",
            noise: "Sets the card's colour and what its quest is called: Itch for a Noise theme.",
            crew: "Sets the card's colour and what its quest is called: Motivation for a Crew theme.",
        },
        themebookLabel: 'Themebook',
        themebookPlaceholder: 'Street Trade, Augmented, Enclave...',
        themebookHint:
            'Printed in the header band. Left empty, the band still shows.',
    },
    quest: {
        placeholder: {
            self: 'Keep the clinic open, whatever the district asks in return.',
            mythos: 'Finish the rite the old city started and never closed.',
            noise: 'Get the signal out before the tower notices it is gone.',
            crew: 'Own the block outright, one favour at a time.',
        },
        hint: {
            self: 'What a Self theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            mythos: 'What a Mythos theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            noise: 'What a Noise theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            crew: 'What a Crew theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
        },
    },
    tags: {
        fieldLabel: {
            power: 'Power tags',
            weakness: 'Weakness tags',
        },
        hint: 'Write tags bare, without braces.',
        tagLabel: 'Tag',
        tagInputPlaceholder: 'reads a body like a schematic',
        emptyValueError: 'Please enter a value.',
        finishEditingToReorder: 'Finish editing to reorder',
        addTag: 'Add tag',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        publicationType: {
            official: 'Official',
            thirdParty: 'Third Party',
            cauldron: 'Cauldron',
            homebrew: 'Homebrew',
        },
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        selectOfficialBook: 'Select an official book...',
        selectThirdPartySource: 'Select a third-party source...',
        sourceAutofillHint:
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
        pageLabel: 'Page',
        pagePlaceholder: '71',
        authorsLabel: 'Authors',
        addAuthorPlaceholder: 'Add author...',
        removeAuthorAriaLabel: 'Remove {{author}}',
        metaHint:
            'Meta helps attribution & search and is preserved on import/export.',
    },
    editorPanel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        sectionsHeading: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundHeading: 'Background',
        background: {
            neon: 'Neon',
            plain: 'Plain',
        },
        resetView: 'Reset view',
    },
    imageExport: {
        scaleLabel: 'Image scale',
    },
}

export default forms
