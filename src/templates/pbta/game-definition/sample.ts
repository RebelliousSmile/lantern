import type { PbtaGameDefinition } from './model'

/* An original, wholly invented PbtA hack - not a transcription of any
   published game - that still exercises every section: five stats, one
   Resource and one Clock attribute, an NPC section, an MC section and a
   fronts section with a clock preset. */
export function getSamplePbtaGameDefinition(): PbtaGameDefinition {
    return {
        game: 'salvage-run',
        name: 'Salvage Run',
        version: '1.0.0',
        source: 'Original playtest draft',
        rollFormula: '2d6',
        minMod: -3,
        maxMod: 3,
        rollResults: {
            miss: { range: '6-', label: 'Miss' },
            weak: { range: '7-9', label: 'Weak hit' },
            strong: { range: '10+', label: 'Strong hit' },
        },
        character: {
            stats: {
                grit: 'Grit',
                nerve: 'Nerve',
                reflex: 'Reflex',
                wits: 'Wits',
                sway: 'Sway',
            },
            attributes: {
                fuel: {
                    type: 'Resource',
                    label: 'Fuel',
                    description: 'Spend to push the rig past its limits.',
                    max: 6,
                    default: 3,
                    position: 'top',
                },
                salvageClock: {
                    type: 'Clock',
                    label: 'Salvage Clock',
                    description: 'Fills as the crew strips a wreck.',
                    max: 6,
                    default: 0,
                    position: 'left',
                },
            },
            statToggle: {
                label: 'Overdrawn',
                modifier: -1,
            },
            moveTypes: {
                basic: 'Basic Moves',
                rig: 'Rig Moves',
            },
            equipmentTypes: {
                gear: 'Gear',
                salvage: 'Salvage',
            },
            description:
                'A crew of scavengers running derelict wrecks for parts.',
        },
        npc: {
            attributes: {
                armor: {
                    type: 'Number',
                    label: 'Armor',
                    default: 0,
                    position: 'top',
                },
            },
            moveTypes: {
                npc: 'NPC Moves',
            },
            equipmentTypes: {},
            description:
                'The crews and scavenger gangs that share the wreck fields.',
        },
        mc: {
            moveTypes: {
                mc: 'MC Moves',
            },
            description: 'The moves the MC makes when the dice call for it.',
        },
        fronts: {
            threatTypes: {
                collapse: 'Structural Collapse',
                rival: 'Rival Crew',
            },
            impulses: {
                collapse: 'to bury what remains',
                rival: 'to strip the wreck first',
            },
            clockPresets: [
                {
                    key: 'small',
                    label: 'Small (4)',
                    segments: ['1', '2', '3', '4'],
                },
                {
                    key: 'large',
                    label: 'Large (8)',
                    segments: ['1', '2', '3', '4', '5', '6', '7', '8'],
                },
            ],
        },
    }
}
