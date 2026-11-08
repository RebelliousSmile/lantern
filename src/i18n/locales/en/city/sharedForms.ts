/* Editor strings the four City of Mist templates share. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the preview to edit a specific section.',
    },
    list: {
        finishEditingToReorder: 'Finish editing to reorder',
        valueRequired: 'Please enter a value.',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        showSeparators: 'Show separators',
        sectionsLabel: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundLabel: 'Background',
        useBackground: 'Use {{name}} background',
        titlePlacementLabel: 'Title placement',
        titleOutside: 'Outside',
        titleInside: 'Inside',
        resetView: 'Reset view',
        background: {
            rose: 'Rose',
            cream: 'Cream',
            paper: 'Paper',
            ochre: 'Ochre',
            sand: 'Sand',
            lemon: 'Lemon',
            sage: 'Sage',
            clay: 'Clay',
        },
    },
    exportSettings: {
        imageScale: 'Image scale',
    },
    meta: {
        publicationTypeLabel: 'Publication type',
        typeOfficial: 'Official',
        typeThirdParty: 'Third Party',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Homebrew',
        sourceLabel: 'Source',
        catalogSourceLabel: 'Catalog source',
        selectSourcePlaceholder: 'Select a source...',
        searchSourcePlaceholder: 'Search source...',
        noMatch: 'No match.',
        selectOfficialPlaceholder: 'Select an official book...',
        selectThirdPartyPlaceholder: 'Select a third-party source...',
        autoFillHelp:
            'Selecting a source auto-fills authors. You can still edit them below.',
        cauldronTitleLabel: 'Cauldron product title',
        homebrewTitleLabel: 'Homebrew title / location',
        sourceTitleLabel: 'Source title',
        cauldronTitlePlaceholder: 'e.g., Cauldron: Shadows in Brine',
        homebrewTitlePlaceholder: 'e.g., Personal campaign notes',
        sourceTitlePlaceholder: 'Override selected source title',
        optional: '(optional)',
        pageLabel: 'Page',
        authorsLabel: 'Authors',
        addAuthorPlaceholder: 'Add author...',
        addAuthorAndEnterPlaceholder: 'Add author and press Enter',
        removeAuthorAriaLabel: 'Remove {{author}}',
        footerHelp:
            'Meta is preserved on import/export and rendered as a small footer in the preview.',
        attributionHelp: 'Attribution is preserved in TOML exports.',
    },
    help: {
        markdown: 'Supports Markdown.',
        inlineMarkdown: 'Supports inline Markdown.',
    },
    themeType: {
        mythos: 'Mythos',
        logos: 'Logos',
        extra: 'Extra',
        crew: 'Crew',
    },
    zone: {
        mystery: 'Mystery',
        identity: 'Identity',
        motivation: 'Motivation',
    },
    track: {
        attention: 'Attention',
        fade: 'Fade',
        crack: 'Crack',
    },
}

export default forms
