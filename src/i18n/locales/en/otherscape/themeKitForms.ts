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
    description: {
        label: 'Description',
        placeholder:
            'You patch up the people the clinics turn away, and the street remembers it.',
        hint: 'Printed under the header: who carries this theme and what it does for them. Leave a blank line between paragraphs. Markdown and braced tags are rendered.',
        add: 'add the description of this kit',
    },
    special: {
        nameLabel: 'Special name',
        namePlaceholder: 'House Calls',
        descriptionLabel: 'What it lets the character do',
        descriptionPlaceholder:
            'Once per scene, when you patch someone up where they fell, reduce one of their statuses by an extra tier.',
        hint: 'The one Special the kit suggests, printed at its foot behind a checkbox. Markdown and braced tags are rendered.',
        incomplete:
            'A Special needs both a name and a text: until both are filled, it is left out of the exported file.',
        add: 'add the Special this kit suggests',
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
        optional: '(optional)',
        pageLabel: 'Page',
        pagePlaceholder: '71',
        authorsLabel: 'Authors',
        addAuthorPlaceholder: 'Add author...',
        addAuthorAndEnterPlaceholder: 'Add author and press Enter',
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
