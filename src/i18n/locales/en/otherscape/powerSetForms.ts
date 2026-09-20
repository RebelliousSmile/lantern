/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    panel: {
        emptyState: 'Click on the card to edit a specific section.',
    },
    basic: {
        nameLabel: 'Power Set name',
        namePlaceholder: 'e.g., Source-Touched Berserk',
        typeLabel: 'Type',
        typeHint:
            'The type colours the card and says where the power comes from: Self from the person, Mythos from something older, Noise from the network.',
        typeOptions: {
            self: 'Self',
            mythos: 'Mythos',
            noise: 'Noise',
        },
        descriptionPlaceholder:
            'Write a short summary of the power set here...',
    },
    specials: {
        nameRequiredError: 'Name is required.',
        descriptionRequiredError: 'Description is required.',
        descriptionHint: '(Markdown)',
        descriptionPlaceholder: 'When this happens... then do that.',
        addButton: 'Add special',
        dragTitleDisabled: 'Finish editing to reorder',
        noDescription: 'No description',
    },
    consequences: {
        emptyError: 'Consequence cannot be empty.',
        hint: 'What the Power Set costs the Crew whatever Threat is running. A Threat with consequences of its own keeps them in the Threats form.',
        dragTitleDisabled: 'Finish editing to reorder',
    },
}

export default forms
