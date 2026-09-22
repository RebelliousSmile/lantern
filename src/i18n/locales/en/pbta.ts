/* English source of truth for this game family's templates; the French file is typed against it. */
const pbta = {
    playbook: {
        label: 'Playbook',
        newTitle: 'New Playbook',
        description:
            'A Playbook is an Apocalypse World character type: its stats, its moves, the choices made at creation, and the gear it starts with. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current playbook as TOML.',
        exportPng: 'Export the current playbook sheet as PNG.',
        sections: {
            stats: 'Stats',
            moves: 'Moves',
            choiceSets: 'Choice Sets',
            advancement: 'Advancement',
            creation: 'Creation',
            gear: 'Gear',
        },
    },
    gameDefinition: {
        label: 'Game Definition',
        newTitle: 'New Game Definition',
        description:
            'A Game Definition defines an Apocalypse World game such as Salvage Run: its stats, its move types, the results a roll can land on, and who gets a character sheet. Start blank, open the example, or import a TOML file.',
        exportToml: 'Export the current game definition as TOML.',
        exportPng: 'Export the current game definition sheet as PNG.',
        sections: {
            roll: 'Roll',
            character: 'Character',
            npc: 'NPC',
            mc: 'MC',
            fronts: 'Fronts',
        },
    },
    specialized: {
        description:
            'Create an original {{game}} playbook as one TOML document.',
        sections: {
            stats: 'Stats',
            labels: 'Labels',
            moves: 'Moves',
            momentOfTruth: 'Moment of Truth',
            improvements: 'Improvements',
            directives: 'Directives',
            editorial: 'Editorial',
        },
    },
    monsterhearts: {
        label: 'Skin',
        newTitle: 'New Skin',
        description: 'Create an original Monsterhearts skin.',
        exportToml: 'Export this skin as TOML.',
        exportPng: 'Export this skin as PNG.',
        sections: {
            stats: 'Stats',
            strings: 'Strings',
            ascendants: 'Ascendants',
            conditions: 'Conditions',
            editorial: 'Editorial',
            moves: 'Moves',
            advancement: 'Advancement',
            advances: 'Advances',
            harm: 'Harm',
        },
        empty: {
            moves: 'No actions yet.',
            ascendants: 'None yet.',
            conditions: 'None yet.',
        },
        fields: {
            minimum: 'Minimum',
            starting: 'Starting',
            maximum: 'Maximum',
            boundsLocked: 'Double-click to unlock this value.',
            value: 'Value',
            label: 'Label',
            trigger: 'Trigger',
            checked: 'Checked',
            moveType: 'Move type',
            name: 'Name',
            description: 'Description',
        },
        defaults: {
            condition: 'New Condition',
        },
    },
    urbanShadows: {
        sections: {
            circles: 'Circles & Status',
            relationships: 'Mortal Relationships',
            harm: 'Harm & Scars',
            corruption: 'Corruption & End Move',
            editorial: 'Editorial',
            moves: 'Moves',
            creation: 'Creation',
            gear: 'Gear',
            advancement: 'Advancement',
        },
    },
}

export default pbta
