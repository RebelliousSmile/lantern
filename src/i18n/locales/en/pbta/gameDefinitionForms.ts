/* Editor strings of the PbtA Game Definition template. English is the source of truth. */
const forms = {
    attributes: {
        defaultLabel: 'Default',
        maxLabel: 'Max',
        defaultValuePlaceholder: 'Default value',
        checkboxLabelPlaceholder: 'Checkbox label (optional)',
        defaultRollPlaceholder: 'Default roll formula',
        descriptionPlaceholder: 'Description (optional)',
        defaultChecked: 'Default checked',
        sortAlphabetically: 'Sort alphabetically',
        condition: 'Condition',
        showResults: 'Show results',
        column: 'Column',
        auto: 'Auto',
        top: 'Top',
        left: 'Left',
        add: 'Add attribute',
    },
    clockPresets: {
        moveUp: 'Move {{name}} up',
        moveDown: 'Move {{name}} down',
        segmentPlaceholder: 'Add segment label and press Enter',
        add: 'Add preset',
    },
    rollResults: {
        rangePlaceholder: 'Range',
    },
    labels: {
        moveTypes: 'Move types',
        attributes: 'Attributes',
        equipmentTypes: 'Equipment types',
        stats: 'Stats',
        statToggle: 'Stat toggle',
    },
    placeholders: {
        moveTypeLabel: 'Move type label',
        equipmentTypeLabel: 'Equipment type label',
        statLabel: 'Stat label',
    },
    importedNote:
        'Imported from TOML - removing the section here will not drop it from the exported file. Blank the fields above instead.',
    sectionBlocked:
        'This document was imported from TOML: export re-applies the original file over any field this form leaves blank, so the {{section}} section would come back. Blank each field above instead.',
    basic: {
        name: 'Game name',
        game: 'Game id',
        version: 'Version',
        namePlaceholder: 'e.g., Apocalypse Keys',
        gamePlaceholder: 'e.g., apocalypse-keys',
        versionPlaceholder: 'e.g., 0.1.0',
        sourcePlaceholder: 'Book or homebrew source',
        source: 'Source',
        versionHint:
            'The version tracks this definition, not the game: bump it whenever stats, attributes or vocabularies change below.',
    },
    statToggle: {
        none: 'None',
        stat: 'Stat key',
        custom: 'Custom',
        statPlaceholder: 'Stat key this toggle switches, e.g. cool',
        modifierPlaceholder: 'Mod',
    },
    roll: {
        formula: 'Roll formula',
        formulaPlaceholder: 'e.g., 2d6',
        minMod: 'Min modifier',
        maxMod: 'Max modifier',
        results: 'Roll results',
    },
    fronts: {
        empty: 'This definition has no fronts-facing content. Add one to give fronts their own threat types, impulses and clock presets.',
        add: 'Add a fronts section',
        remove: 'Remove the fronts section',
        threatTypes: 'Threat types',
        impulses: 'Impulses',
        clockPresets: 'Clock presets',
        threatTypePlaceholder: 'Threat type label',
        impulsePlaceholder: 'Impulse label',
    },
    sectionNames: {
        fronts: 'fronts',
        mc: 'MC',
        npc: 'NPC',
    },
    mc: {
        empty: 'This definition has no MC-facing content. Add one to give the MC their own move types.',
        add: 'Add an MC section',
        remove: 'Remove the MC section',
    },
    npc: {
        empty: 'This definition has no NPC-facing content. Add one to give NPCs their own attributes and move types.',
        add: 'Add an NPC section',
        remove: 'Remove the NPC section',
    },
}

export default forms
