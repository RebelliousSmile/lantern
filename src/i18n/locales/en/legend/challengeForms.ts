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
        descriptionPlaceholder: 'Write a short summary of the challenge here...',
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
}

export default forms
