/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    basicForm: {
        titleTagLabel: 'Title tag',
        titleTagPlaceholder: 'The Village I Left Behind',
        titleTagHint: "The theme's own tag, written bare: the card adds the highlight.",
        levelLabel: 'Level',
        levels: {
            origin: {
                label: 'Origin',
                hint: 'Where the hero comes from',
            },
            adventure: {
                label: 'Adventure',
                hint: 'What the hero does now',
            },
            greatness: {
                label: 'Greatness',
                hint: 'What the hero may become',
            },
        },
        categoryLabel: 'Category',
        categoryOptional: '(optional)',
        categoryPlaceholder: 'Kinship, Mission, Destiny...',
    },
    tagsForm: {
        fieldLabel: {
            power: 'Power tags',
            weakness: 'Weakness tags',
        },
        bareHint: 'Write tags bare, without braces.',
        tagLabel: 'Tag',
        placeholder: {
            power: 'knows every face in town',
            weakness: 'they still expect me back',
        },
        emptyValueError: 'Please enter a value.',
        addTag: 'Add tag',
        finishEditingToReorder: 'Finish editing to reorder',
    },
    questForm: {
        questLabel: 'Quest',
        questPlaceholder: 'Return home with something worth showing.',
        questHint:
            'What the theme pushes the hero towards. Markdown and braced tags are rendered on the card.',
        improveLabel: 'Improve',
        abandonLabel: 'Abandon',
        milestoneLabel: 'Milestone',
        milestoneHint: 'Marked once the theme has reached its turning point.',
    },
    metaForm: {
        publicationTypeLabel: 'Publication type',
        publicationTypes: {
            official: 'Official',
            thirdParty: 'Third Party',
            cauldron: 'Cauldron',
            homebrew: 'Homebrew',
        },
        sourceLabel: 'Source',
        selectOfficialSource: 'Select an official book...',
        selectThirdPartySource: 'Select a third-party source...',
        autoFillHint: 'Selecting a source auto-fills authors. You can still edit below.',
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
        optional: '(optional)',
        pageLabel: 'Page',
        pagePlaceholder: '142',
        authorsLabel: 'Authors',
        authorsPlaceholder: 'Add author...',
        removeAuthor: 'Remove {{author}}',
        metaHint: 'Meta helps attribution & search and is preserved on import/export.',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        sectionsLabel: 'Sections',
        previewWidthLabel: 'Preview width',
        backgroundLabel: 'Background',
        backgroundOptions: {
            parchment: 'Parchment',
            plain: 'Plain',
        },
        resetView: 'Reset view',
        imageScaleLabel: 'Image scale',
    },
}

export default forms
