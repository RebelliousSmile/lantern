/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the preview to edit a specific section.',
    },
    basicForm: {
        nameLabel: 'Challenge name',
        namePlaceholder: 'e.g., The Heap Thing',
        ratingLabel: 'Rating (1-5)',
        rolesLabel: 'Roles',
        rolesHint:
            'Pick one or more roles that best describe this challenge (see <i>Legend in the Mist - Vol. II - The Narrator</i>, p. 110)',
        descriptionLabel: 'Description',
        descriptionPlaceholder:
            'Write a short summary of the challenge here...',
        roles: {
            Aggressor: 'Aggressor',
            Charge: 'Charge',
            Countdown: 'Countdown',
            Influence: 'Influence',
            Mystery: 'Mystery',
            Obstacle: 'Obstacle',
            Pursuer: 'Pursuer',
            Quarry: 'Quarry',
            Sapper: 'Sapper',
            Support: 'Support',
            Watcher: 'Watcher',
        },
    },
    appearancePanel: {
        autoHideEmpty: 'Auto-hide empty sections',
        sections: 'Sections',
        previewWidth: 'Preview width',
        backgroundLabel: 'Background',
        resetView: 'Reset view',
        background: {
            parchment: 'Parchment',
            plain: 'Plain',
        },
    },
    imageExportSettings: {
        imageScale: 'Image scale',
    },
    consequencesPanel: {
        selectThreatPrompt: 'Select a threat to edit its consequences',
        consequencesForTitle: 'Consequences for: {{name}}',
        addConsequence: 'Add consequence',
        addGeneralConsequence: 'Add general consequence',
        consequenceEmptyError: 'Consequence cannot be empty.',
        consequenceMinError: 'Each threat needs at least one consequence.',
        back: 'Back',
    },
    shared: {
        finishEditingToReorder: 'Finish editing to reorder',
        noDescription: 'No description',
    },
    limits: {
        immuneLabel: 'Immune',
        immuneLevelTitle: 'Ignored when immune',
        progressLabel: 'Progress limit',
        onMaxPlaceholder: 'When this progress limit is maxed…',
        addLimit: 'Add limit',
        errorNameRequired: 'Name is required.',
        errorDuplicateName: 'Limit name already exists.',
    },
    mights: {
        vulnerabilityLabel: 'Vulnerability',
        vulnerabilityPlaceholder: 'e.g., flattery',
        addMight: 'Add might',
        errorNameRequired: 'Name is required.',
        errorDuplicate: 'A Might with that name and level already exists.',
    },
    specials: {
        markdownHint: '(Markdown)',
        descriptionPlaceholder: 'When this happens... then do that.',
        addFeature: 'Add feature',
        errorNameRequired: 'Name is required.',
        errorDescriptionRequired: 'Description is required.',
    },
    tags: {
        rawValueLabel: 'Raw value',
        rawValuePlaceholder:
            '{power tag}, {status-3}, {!weakness tag} or plain text',
        addEntry: 'Add entry',
        errorRequired: 'Please enter a value.',
    },
    threats: {
        addThreat: 'Add threat',
        editGeneralConsequences: 'Edit general consequences',
        errorNameRequired: 'Threat name is required.',
        errorDescriptionRequired: 'Threat description is required.',
        descriptionLabel: 'Short description',
        descriptionHint: '(Markdown + tokens)',
        descriptionPlaceholder: 'What the challenge starts to do…',
        charactersCount: '{{length}}/{{max}} characters',
        consequencesTitle: 'Consequences',
        editConsequencesAriaLabel: 'Edit consequences',
        dragThreatAriaLabel: 'Drag to reorder threat',
        dragConsequenceAriaLabel: 'Drag to reorder consequence',
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
}

export default forms
