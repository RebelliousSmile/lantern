import type { Attribute } from '../shared/attributeField'
import type { GameDefinition as GameDefinitionData } from './schema'

type Item<Value> =
    NonNullable<Value> extends readonly (infer Entry)[] ? Entry : never

export type RollResult = GameDefinitionData['rollResults'][string]
export type StatToggle = NonNullable<
    GameDefinitionData['character']['statToggle']
>

export type CharacterSection = {
    stats: Record<string, string>
    attributes: Record<string, Attribute>
    statToggle: StatToggle | null
    moveTypes: Record<string, string>
    equipmentTypes: Record<string, string>
    description: string
}

export type NpcSection = {
    attributes: Record<string, Attribute>
    moveTypes: Record<string, string>
    equipmentTypes: Record<string, string>
    description: string
}

export type McSection = {
    moveTypes: Record<string, string>
    description: string
}

export type ClockPreset = Item<
    NonNullable<GameDefinitionData['fronts']>['clockPresets']
>

export type FrontsSection = {
    threatTypes: Record<string, string>
    impulses: Record<string, string>
    clockPresets: ClockPreset[]
}

/* Every optional the schema allows is filled in here so a form never has to
   guard against `undefined`: a string becomes '', a missing record becomes
   {}, and an absent section (npc/mc/fronts) becomes null rather than an
   empty shell - a game with no MC-facing moves is not the same document as
   one with an MC section nobody filled in. What is empty on the way out is
   dropped again by `toGameDefinitionPayload`. */
export type PbtaGameDefinition = {
    game: string
    name: string
    version: string
    source: string
    rollFormula: string
    minMod: number | null
    maxMod: number | null
    rollResults: Record<string, RollResult>
    character: CharacterSection
    npc: NpcSection | null
    mc: McSection | null
    fronts: FrontsSection | null
}

export function toGameDefinitionDocument(
    raw: GameDefinitionData
): PbtaGameDefinition {
    return {
        game: raw.game,
        name: raw.name,
        version: raw.version,
        source: raw.source ?? '',
        rollFormula: raw.rollFormula,
        minMod: raw.minMod ?? null,
        maxMod: raw.maxMod ?? null,
        rollResults: raw.rollResults ?? {},
        character: {
            stats: raw.character.stats ?? {},
            attributes: raw.character.attributes ?? {},
            statToggle: raw.character.statToggle ?? null,
            moveTypes: raw.character.moveTypes ?? {},
            equipmentTypes: raw.character.equipmentTypes ?? {},
            description: raw.character.description ?? '',
        },
        npc: raw.npc
            ? {
                  attributes: raw.npc.attributes ?? {},
                  moveTypes: raw.npc.moveTypes ?? {},
                  equipmentTypes: raw.npc.equipmentTypes ?? {},
                  description: raw.npc.description ?? '',
              }
            : null,
        mc: raw.mc
            ? {
                  moveTypes: raw.mc.moveTypes ?? {},
                  description: raw.mc.description ?? '',
              }
            : null,
        fronts: raw.fronts
            ? {
                  threatTypes: raw.fronts.threatTypes ?? {},
                  impulses: raw.fronts.impulses ?? {},
                  clockPresets: raw.fronts.clockPresets ?? [],
              }
            : null,
    }
}

/* The reverse trip, key by key. A blank optional is left out of the object
   rather than written as an empty value: TOML has no way to say "absent"
   once a key is printed. On an imported document this payload is still
   overlaid onto the import's canonical source (`overlayCanonicalSource`),
   which re-injects a key this function omitted - see `hasCanonicalSource`
   and the "Remove the ... section" forms for the user-facing consequence. */
export function toGameDefinitionPayload(
    doc: PbtaGameDefinition
): Record<string, unknown> {
    const character: Record<string, unknown> = {
        stats: doc.character.stats,
        moveTypes: doc.character.moveTypes,
    }
    if (Object.keys(doc.character.attributes).length) {
        character.attributes = doc.character.attributes
    }
    if (doc.character.statToggle != null) {
        character.statToggle = doc.character.statToggle
    }
    if (Object.keys(doc.character.equipmentTypes).length) {
        character.equipmentTypes = doc.character.equipmentTypes
    }
    if (doc.character.description.trim()) {
        character.description = doc.character.description.trim()
    }

    const payload: Record<string, unknown> = {
        game: doc.game,
        name: doc.name,
        version: doc.version,
        rollFormula: doc.rollFormula,
        rollResults: doc.rollResults,
        character,
    }

    if (doc.source.trim()) payload.source = doc.source.trim()
    if (doc.minMod != null) payload.minMod = doc.minMod
    if (doc.maxMod != null) payload.maxMod = doc.maxMod

    if (doc.npc) {
        const npc: Record<string, unknown> = { moveTypes: doc.npc.moveTypes }
        if (Object.keys(doc.npc.attributes).length) {
            npc.attributes = doc.npc.attributes
        }
        if (Object.keys(doc.npc.equipmentTypes).length) {
            npc.equipmentTypes = doc.npc.equipmentTypes
        }
        if (doc.npc.description.trim()) {
            npc.description = doc.npc.description.trim()
        }
        payload.npc = npc
    }

    if (doc.mc) {
        const mc: Record<string, unknown> = { moveTypes: doc.mc.moveTypes }
        if (doc.mc.description.trim())
            mc.description = doc.mc.description.trim()
        payload.mc = mc
    }

    if (doc.fronts) {
        const fronts: Record<string, unknown> = {
            threatTypes: doc.fronts.threatTypes,
            impulses: doc.fronts.impulses,
        }
        if (doc.fronts.clockPresets.length) {
            fronts.clockPresets = doc.fronts.clockPresets
        }
        payload.fronts = fronts
    }

    return payload
}

/* The name/game/version header is not a section: a card with no name is
   still a card, so it prints unconditionally and only these five zones can
   be hidden. */
export type SectionId = 'roll' | 'character' | 'npc' | 'mc' | 'fronts'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

/* No `background` here, unlike the City swatch-picker templates: PbtA cards
   use the one fixed palette declared in `shared/tokens.css`, not a choice of
   paper. `autoHideEmpty` still earns its place - npc/mc/fronts are the three
   sections a minimal definition legitimately omits. */
export type GameDefinitionViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    autoHideEmpty: boolean
    showSeparators: boolean
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'roll'; mode?: 'edit' }
    | { kind: 'character'; mode?: 'edit' }
    | { kind: 'npc'; mode?: 'edit' }
    | { kind: 'mc'; mode?: 'edit' }
    | { kind: 'fronts'; mode?: 'edit' }

export type GameDefinitionSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 360
export const PREVIEW_WIDTH_MAX = 920
export const PREVIEW_WIDTH_DEFAULT = 560

export const defaultHidden: Record<SectionId, boolean> = {
    roll: false,
    character: false,
    npc: false,
    mc: false,
    fronts: false,
}

export const defaultGameDefinitionView: GameDefinitionViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    hidden: defaultHidden,
    autoHideEmpty: true,
    showSeparators: true,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultGameDefinitionSheetState: GameDefinitionSheetState = {
    open: false,
    target: null,
}

export const blankGameDefinition = (): PbtaGameDefinition => ({
    game: 'untitled-game',
    name: 'Untitled Game',
    version: '0.1.0',
    source: '',
    rollFormula: '2d6',
    minMod: null,
    maxMod: null,
    rollResults: {
        miss: { range: '6-', label: 'Miss' },
        weak: { range: '7-9', label: 'Weak hit' },
        strong: { range: '10+', label: 'Strong hit' },
    },
    character: {
        stats: {},
        attributes: {},
        statToggle: null,
        moveTypes: {},
        equipmentTypes: {},
        description: '',
    },
    npc: null,
    mc: null,
    fronts: null,
})
