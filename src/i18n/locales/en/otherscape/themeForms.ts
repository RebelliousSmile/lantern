/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
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
    basic: {
        titleTagLabel: 'Title tag',
        titleTagPlaceholder: 'Back-Alley Ripperdoc',
        titleTagHelp:
            'The card prints it as its title, so write it bare, without braces, and leave it out of the power tags.',
        themeTypeLabel: 'Theme type',
        themeTypeAriaLabel: 'Theme type',
        themeTypeHelp: {
            self: "Sets the card's colour and what its quest is called: Identity for a Self theme.",
            mythos: "Sets the card's colour and what its quest is called: Ritual for a Mythos theme.",
            noise: "Sets the card's colour and what its quest is called: Itch for a Noise theme.",
            crew: "Sets the card's colour and what its quest is called: Motivation for a Crew theme.",
        },
        themebookLabel: 'Themebook',
        optionalSuffix: '(optional)',
        themebookPlaceholder: 'Street Trade, Augmented, Enclave...',
        themebookHelp:
            'Printed in the header band. Left empty, the band still shows.',
    },
    quest: {
        help: {
            self: 'What a Self theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            mythos: 'What a Mythos theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            noise: 'What a Noise theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
            crew: 'What a Crew theme is chasing. The card prints it under that name. Markdown and braced tags are rendered.',
        },
        placeholder: {
            self: 'Keep the clinic open, whatever the district asks in return.',
            mythos: 'Finish the rite the old city started and never closed.',
            noise: 'Get the signal out before the tower notices it is gone.',
            crew: 'Own the block outright, one favour at a time.',
        },
    },
    tags: {
        powerLabel: 'Power tags',
        weaknessLabel: 'Weakness tags',
        writeBareHelp: 'Write tags bare, without braces.',
        tagFieldLabel: 'Tag',
        tagInputPlaceholder: 'reads a body like a schematic',
        valueRequired: 'Please enter a value.',
        addButton: 'Add tag',
        finishEditingToReorder: 'Finish editing to reorder',
        power: {
            placeholder1: 'reads a body like a schematic',
            placeholder2: 'a clinic behind the noodle bar',
            placeholder3: 'everyone owes me a favour',
        },
        weakness: {
            placeholder1: 'owes the wrong people',
            placeholder2: 'cannot say no to a patient',
            placeholder3: 'the licence board has a file',
        },
    },
    tracks: {
        heading: 'Tracks',
    },
    trackLabel: {
        upgrade: 'Upgrade',
        decay: 'Decay',
    },
    trackHelp: {
        upgrade: 'Marked as the theme grows. Three marks and it is ready to improve.',
        decay: 'Marked as the theme frays. Three marks and it is ready to be lost.',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        typeOfficial: 'Official',
        typeThirdParty: 'Third Party',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Homebrew',
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        selectOfficialPlaceholder: 'Select an official book...',
        selectThirdPartyPlaceholder: 'Select a third-party source...',
        autoFillHelp:
            'Selecting a source auto-fills authors. You can still edit below.',
        cauldronTitleLabel: 'Cauldron product title',
        homebrewTitleLabel: 'Homebrew title / location',
        sourceTitleLabel: 'Source title',
        cauldronTitlePlaceholder: 'e.g., Cauldron: Neon Debts',
        homebrewTitlePlaceholder: 'e.g., Personal blog, campaign doc...',
        sourceTitlePlaceholder: 'Override selected source title',
        pageLabel: 'Page',
        authorsLabel: 'Authors',
        addAuthorPlaceholder: 'Add author...',
        addAuthorAndEnterPlaceholder: 'Add author and press Enter',
        removeAuthorAriaLabel: 'Remove {{author}}',
        footerHelp:
            'Meta helps attribution & search and is preserved on import/export.',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        sectionsLabel: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundLabel: 'Background',
        resetView: 'Reset view',
        background: {
            neon: 'Neon',
            plain: 'Plain',
        },
    },
    exportSettings: {
        imageScale: 'Image scale',
    },
}

export default forms
