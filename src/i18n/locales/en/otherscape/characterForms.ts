/* Editor form strings for this template, grouped by form. English is the source of truth.
   The zone titles (Upgrades, Tag combos, Power, Loadout) are not here: they come from the
   published schema's presentation, so a rename upstream reaches the editor without an edit. */
const forms = {
    panel: {
        emptyState: 'Click on the sheet to edit a specific zone.',
    },
    basic: {
        nameLabel: 'Character name',
        namePlaceholder: 'Vesper Quill',
        nameHelp: 'Printed at the top of the sheet.',
    },
    upgrades: {
        readOnly:
            'The Upgrades rule is printed the same way on every sheet. It is not part of the file, so there is nothing to edit here.',
    },
    combos: {
        itemTitle: 'Tag combo {{position}} of {{count}}',
        labelLabel: 'Name',
        labelPlaceholder: 'Light up a liar',
        tagsLabel: 'Tags',
        tagsPlaceholder: 'Add a tag and press Enter',
        tagsHelp: 'Write tags bare, without braces.',
        removeTagAriaLabel: 'Remove {{tag}}',
        powerLabel: 'Power',
        effectLabel: 'Effect',
        effectPlaceholder: 'What the combo does when its tags are all in play.',
        incomplete:
            'A combo needs a name, an effect and at least one tag. Until it has all three it stays on the sheet but is left out of the exported file.',
        removeButton: 'Remove this combo',
        addButton: 'Add a tag combo',
        notFound: 'This tag combo no longer exists.',
    },
    loadout: {
        hint: 'The loadout the character carries. Tick “loaded” for what is on them; the others are dimmed on the sheet.',
        nameLabel: 'Name',
        namePlaceholder: 'Stun baton',
        featureTagsLabel: 'Feature tags',
        featureTagsPlaceholder: 'Add a tag and press Enter',
        weaknessTagLabel: 'Weakness tag',
        weaknessTagPlaceholder: 'needs a charge',
        loadedHelp:
            'Unticked, the item is dimmed on the sheet. A file that never says whether it is loaded stays that way until you tick or untick it.',
        loadedAriaLabel: 'Loaded: {{name}}',
        addButton: 'Add a loadout item',
        removeAriaLabel: 'Remove {{name}}',
        moveUpAriaLabel: 'Move {{name}} up',
        moveDownAriaLabel: 'Move {{name}} down',
        expandAriaLabel: 'Edit {{name}}',
        collapseAriaLabel: 'Close {{name}}',
        empty: 'No loadout item yet.',
    },
    themes: {
        hint: 'A character holds up to four themes. Click a card on the sheet to edit its fields.',
        itemTitle: 'Theme {{position}}',
        addButton: 'Add a theme',
        addType: {
            self: 'Add a Self theme',
            mythos: 'Add a Mythos theme',
            noise: 'Add a Noise theme',
        },
        limitReached:
            'A character holds at most four themes. Remove one to add another.',
        removeButton: 'Remove this theme',
        removeAriaLabel: 'Remove {{title}}',
        moveUpAriaLabel: 'Move {{title}} up',
        moveDownAriaLabel: 'Move {{title}} down',
        editAriaLabel: 'Edit {{title}}',
        empty: 'No theme yet.',
        notFound: 'This theme no longer exists.',
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
