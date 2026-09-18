/* English source of truth for this game family's templates; the French file is typed against it. */
const adrenaline = {
    sections: {
        document: 'Document',
    },
    appearance: {
        printedProportions:
            'The Adrenaline sheets use their printed-card proportions for PNG export.',
    },
    pj: {
        label: 'PJ',
        newTitle: 'New player character',
        description:
            'Create a page-one Adrenaline player-character sheet, then exchange it as validated TOML.',
        exportToml: 'Export the current PJ data as TOML.',
        exportPng: 'Export the current PJ preview as PNG.',
    },
    pnj: {
        label: 'PNJ',
        newTitle: 'New non-player character',
        description:
            'Create an Adrenaline non-player character card, from a walk-on to a complete major NPC.',
        exportToml: 'Export the current PNJ data as TOML.',
        exportPng: 'Export the current PNJ preview as PNG.',
    },
    monstre: {
        label: 'Monstre',
        newTitle: 'New monster',
        description:
            'Create an Adrenaline creature card with alternate-state and contagion data.',
        exportToml: 'Export the current monster data as TOML.',
        exportPng: 'Export the current monster preview as PNG.',
    },
}

export default adrenaline
