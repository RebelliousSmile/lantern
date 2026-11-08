/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the spread to edit a specific section.',
    },
    tags: {
        heading: 'Tags',
        bareHint: 'Write tags bare, without braces.',
        tagLabel: 'Tag',
        placeholder: 'a ford only the locals can find',
        emptyValueError: 'Please enter a value.',
        addTag: 'Add tag',
    },
    vignettes: {
        heading: 'Vignettes',
        subheading: 'The moments this journey breaks down into.',
        namePlaceholder: 'The drowned mile',
        triggerLabel: 'Trigger',
        optional: '(optional)',
        triggerPlaceholder: 'What sets this moment off.',
        errorNameRequired: 'A vignette needs a name.',
        addVignette: 'Add vignette',
        consequencesHeading: 'Consequences',
        consequencesMissing:
            'A vignette needs at least one consequence to export.',
        consequencePlaceholder: 'What this moment costs when it goes badly.',
        consequenceCount_one: '{{count}} consequence',
        consequenceCount_other: '{{count}} consequences',
        noTrigger: 'no trigger',
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
        autoFillHint:
            'Selecting a source auto-fills authors. You can still edit below.',
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
        authorsLabel: 'Authors',
        authorsPlaceholder: 'Add author...',
        removeAuthor: 'Remove {{author}}',
        metaHint:
            'Meta helps attribution & search and is preserved on import/export.',
    },
    basic: {
        namePlaceholder: 'The Long Road to Blackmere',
        nameHint: 'What the Narrator calls this journey at the table.',
        typeLabel: 'Type',
        typeHint:
            'A Landscape is a place crossed, an Occasion an event lived through, an Undertaking a task carried out. The band takes its colour from this.',
        typeOptions: {
            landscape: 'Landscape',
            occasion: 'Occasion',
            undertaking: 'Undertaking',
        },
        descriptionPlaceholder: 'Read this out when the heroes set off.',
        descriptionHint: 'Markdown and braced tags are rendered on the spread.',
    },
    benefits: {
        placeholder: 'What the heroes gain by making it through.',
        hint: 'Printed as a sentence after a bold label, not as a list. Markdown and braced tags are rendered on the spread.',
    },
    consequences: {
        hint: 'What the road can cost anywhere.',
        emptyError: 'A consequence needs some text.',
        fieldLabel: 'Consequence',
        fieldPlaceholder: 'Someone in the party takes {tired-2}.',
        fieldHint:
            'Opening with <em>New Challenge:</em> prints that prefix in bold.',
        add: 'Add consequence',
    },
    shared: {
        dragDisabledTitle: 'Finish editing to reorder',
    },
    appearance: {
        autoHideEmptySections: 'Auto-hide empty sections',
        sectionsLabel: 'Sections',
        zoomLabel: 'Zoom',
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
