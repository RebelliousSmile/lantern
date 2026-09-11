import type { Playbook as PlaybookData } from './schema'

export type MoveRef = { ref: string }
export type MoveRollConfig = {
    rollType: string
    rollFormula: string
    rollMod: number | null
}
export type MoveResult = { label: string; text: string }

export type MoveInline = {
    description: string
    name: string
    moveType: string
    audience: 'character' | 'npc' | 'mc' | null
    playbook: string
    trigger: string
    roll: MoveRollConfig | null
    results: Record<string, MoveResult>
    uses: number | null
    choices: string
    tags: string[]
}

export type MoveEntry =
    | { kind: 'ref'; ref: string }
    | ({ kind: 'inline' } & MoveInline)

export type ChoiceEntry =
    | { kind: 'ref'; ref: string; granted: number; advancement: number }
    | ({ kind: 'inline'; granted: number; advancement: number } & MoveInline)

export type ChoiceSet = {
    title: string
    description: string
    type: 'single' | 'multi'
    repeatable: boolean
    grantOn: string
    choices: ChoiceEntry[]
}

export type CreationEntry = { label: string; options: string[] }

export type GearEntry = {
    name: string
    equipmentType: string
    description: string
    quantity: number | null
    tags: string[]
}

export type PlaybookAttributeValue = string | number | boolean | string[]

/* Every optional the schema allows is filled in here so a form never has to
   guard against `undefined`, mirroring game-definition/model.ts: a string
   becomes '', a missing array becomes [], a missing record becomes {}. What
   is empty on the way out is dropped again by `toPlaybookPayload`. */
export type PbtaPlaybook = {
    slug: string
    name: string
    game: string
    actorType: string
    description: string
    playbookImage: string
    stats: Record<string, number>
    statsDetail: string
    attributes: Record<string, PlaybookAttributeValue>
    moves: MoveEntry[]
    startingMoves: string[]
    choiceSets: ChoiceSet[]
    advancement: string[]
    creation: CreationEntry[]
    gear: GearEntry[]
}

function toMoveInline(raw: {
    description: string
    name: string
    moveType: string
    audience?: 'character' | 'npc' | 'mc'
    playbook?: string
    trigger?: string
    roll?: { rollType: string; rollFormula?: string; rollMod?: number }
    results?: Record<string, MoveResult>
    uses?: number
    choices?: string
    tags?: string[]
}): MoveInline {
    return {
        description: raw.description,
        name: raw.name,
        moveType: raw.moveType,
        audience: raw.audience ?? null,
        playbook: raw.playbook ?? '',
        trigger: raw.trigger ?? '',
        roll: raw.roll
            ? {
                  rollType: raw.roll.rollType,
                  rollFormula: raw.roll.rollFormula ?? '',
                  rollMod: raw.roll.rollMod ?? null,
              }
            : null,
        results: raw.results ?? {},
        uses: raw.uses ?? null,
        choices: raw.choices ?? '',
        tags: raw.tags ?? [],
    }
}

function toMoveInlinePayload(move: MoveInline): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        description: move.description,
        name: move.name,
        moveType: move.moveType,
    }
    if (move.audience != null) payload.audience = move.audience
    if (move.playbook.trim()) payload.playbook = move.playbook.trim()
    if (move.trigger.trim()) payload.trigger = move.trigger.trim()
    if (move.roll) {
        const rollPayload: Record<string, unknown> = {
            rollType: move.roll.rollType,
        }
        if (move.roll.rollFormula.trim())
            rollPayload.rollFormula = move.roll.rollFormula.trim()
        if (move.roll.rollMod != null) rollPayload.rollMod = move.roll.rollMod
        payload.roll = rollPayload
    }
    if (Object.keys(move.results).length) payload.results = move.results
    if (move.uses != null) payload.uses = move.uses
    if (move.choices.trim()) payload.choices = move.choices.trim()
    if (move.tags.length) payload.tags = move.tags
    return payload
}

export function toPlaybookDocument(raw: PlaybookData): PbtaPlaybook {
    return {
        slug: raw.slug,
        name: raw.name,
        game: raw.game,
        actorType: raw.actorType ?? '',
        description: raw.description,
        playbookImage: raw.playbookImage ?? '',
        stats: raw.stats ?? {},
        statsDetail: raw.statsDetail ?? '',
        attributes: raw.attributes ?? {},
        moves: (raw.moves ?? []).map((move) =>
            'ref' in move
                ? { kind: 'ref', ref: move.ref }
                : { kind: 'inline', ...toMoveInline(move) }
        ),
        startingMoves: raw.startingMoves ?? [],
        choiceSets: (raw.choiceSets ?? []).map((choiceSet) => ({
            title: choiceSet.title,
            description: choiceSet.description ?? '',
            type: choiceSet.type,
            repeatable: choiceSet.repeatable ?? false,
            grantOn: choiceSet.grantOn ?? '',
            choices: choiceSet.choices.map((choice) =>
                'ref' in choice
                    ? {
                          kind: 'ref',
                          ref: choice.ref,
                          granted: choice.granted,
                          advancement: choice.advancement,
                      }
                    : {
                          kind: 'inline',
                          granted: choice.granted,
                          advancement: choice.advancement,
                          ...toMoveInline(choice),
                      }
            ),
        })),
        advancement: raw.advancement ?? [],
        creation: (raw.creation ?? []).map((entry) => ({
            label: entry.label,
            options: [...entry.options],
        })),
        gear: (raw.gear ?? []).map((entry) => ({
            name: entry.name,
            equipmentType: entry.equipmentType ?? '',
            description: entry.description ?? '',
            quantity: entry.quantity ?? null,
            tags: entry.tags ?? [],
        })),
    }
}

/* The reverse trip, key by key: a blank optional is left out of the object
   rather than written as an empty value, mirroring
   game-definition/model.ts's toGameDefinitionPayload. */
export function toPlaybookPayload(doc: PbtaPlaybook): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        slug: doc.slug,
        name: doc.name,
        game: doc.game,
        description: doc.description,
        stats: doc.stats,
        moves: doc.moves.map((move) =>
            move.kind === 'ref' ? { ref: move.ref } : toMoveInlinePayload(move)
        ),
    }

    if (doc.actorType.trim()) payload.actorType = doc.actorType.trim()
    if (doc.playbookImage.trim())
        payload.playbookImage = doc.playbookImage.trim()
    if (doc.statsDetail.trim()) payload.statsDetail = doc.statsDetail.trim()
    if (Object.keys(doc.attributes).length) payload.attributes = doc.attributes
    if (doc.startingMoves.length) payload.startingMoves = doc.startingMoves

    if (doc.choiceSets.length) {
        payload.choiceSets = doc.choiceSets.map((choiceSet) => {
            const choiceSetPayload: Record<string, unknown> = {
                title: choiceSet.title,
                type: choiceSet.type,
                choices: choiceSet.choices.map((choice) => {
                    if (choice.kind === 'ref') {
                        return {
                            ref: choice.ref,
                            granted: choice.granted,
                            advancement: choice.advancement,
                        }
                    }
                    return {
                        ...toMoveInlinePayload(choice),
                        granted: choice.granted,
                        advancement: choice.advancement,
                    }
                }),
            }
            if (choiceSet.description.trim()) {
                choiceSetPayload.description = choiceSet.description.trim()
            }
            if (choiceSet.repeatable) choiceSetPayload.repeatable = true
            if (choiceSet.grantOn.trim()) {
                choiceSetPayload.grantOn = choiceSet.grantOn.trim()
            }
            return choiceSetPayload
        })
    }

    if (doc.advancement.length) payload.advancement = doc.advancement

    if (doc.creation.length) {
        payload.creation = doc.creation.map((entry) => ({
            label: entry.label,
            options: entry.options,
        }))
    }

    if (doc.gear.length) {
        payload.gear = doc.gear.map((entry) => {
            const gearPayload: Record<string, unknown> = { name: entry.name }
            if (entry.equipmentType.trim()) {
                gearPayload.equipmentType = entry.equipmentType.trim()
            }
            if (entry.description.trim()) {
                gearPayload.description = entry.description.trim()
            }
            if (entry.quantity != null) gearPayload.quantity = entry.quantity
            if (entry.tags.length) gearPayload.tags = entry.tags
            return gearPayload
        })
    }

    return payload
}

/* The name/slug header is not a section: a playbook with no name is still a
   playbook, so it prints unconditionally and only these six zones can be
   hidden. */
export type SectionId =
    | 'stats'
    | 'moves'
    | 'choiceSets'
    | 'advancement'
    | 'creation'
    | 'gear'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type PlaybookViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    autoHideEmpty: boolean
    showSeparators: boolean
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'stats'; mode?: 'edit' }
    | { kind: 'moves'; mode?: 'edit' }
    | { kind: 'choiceSets'; mode?: 'edit' }
    | { kind: 'advancement'; mode?: 'edit' }
    | { kind: 'creation'; mode?: 'edit' }
    | { kind: 'gear'; mode?: 'edit' }

export type PlaybookSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 360
export const PREVIEW_WIDTH_MAX = 920
export const PREVIEW_WIDTH_DEFAULT = 560

export const defaultHidden: Record<SectionId, boolean> = {
    stats: false,
    moves: false,
    choiceSets: false,
    advancement: false,
    creation: false,
    gear: false,
}

export const defaultPlaybookView: PlaybookViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    hidden: defaultHidden,
    autoHideEmpty: true,
    showSeparators: true,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultPlaybookSheetState: PlaybookSheetState = {
    open: false,
    target: null,
}

export const blankPlaybook = (): PbtaPlaybook => ({
    slug: 'untitled-playbook',
    name: 'Untitled Playbook',
    game: 'untitled-game',
    actorType: '',
    description: 'Describe this playbook.',
    playbookImage: '',
    stats: {},
    statsDetail: '',
    attributes: {},
    moves: [],
    startingMoves: [],
    choiceSets: [],
    advancement: [],
    creation: [],
    gear: [],
})
