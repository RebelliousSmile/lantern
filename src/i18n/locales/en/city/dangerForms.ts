/* Editor strings of the Danger template. English is the source of truth. */
const forms = {
    appearance: {
        layoutLabel: 'Layout',
        oneColumn: '1 column',
        twoColumns: '2 columns',
        blockHeight: 'Block height',
    },
    basic: {
        nameLabel: 'Danger name',
        namePlaceholder: 'e.g., The Red Room',
        levelLabel: 'Level (0-5)',
        descriptionPlaceholder:
            'Describe the danger and how it threatens the crew.',
    },
    spectrums: {
        nameLabel: 'Spectrum name',
        namePlaceholder: 'hurt',
        maximumLabel: 'Maximum',
        immune: 'Immune',
        add: 'Add spectrum',
        errorNameRequired: 'Spectrum name is required.',
    },
    customMoves: {
        add: 'Add custom move',
        untitled: 'Untitled custom move',
        namePlaceholder: 'Custom Move',
        descriptionPlaceholder: 'Describe the custom move.',
        errorNameRequired: 'Custom move name is required.',
        errorDescriptionRequired: 'Custom move description is required.',
    },
    hardMoves: {
        add: 'Add hard move',
        placeholder: 'Describe a hard move.',
        field: 'Hard move',
    },
    softMoves: {
        add: 'Add soft move',
        placeholder: 'Describe a soft move.',
        field: 'Soft move',
    },
}

export default forms
