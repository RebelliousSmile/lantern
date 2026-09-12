import type {
    CityOfMistCustomMove as CityOfMistCustomMoveData,
    CityCustomMoveKind as CustomMoveKind,
    CityCustomMoveMeta as CustomMoveMeta,
    CityMoveTemplate as MoveTemplate,
    CityOutcome as Outcome,
    CityOutcomeTier as OutcomeTier,
    CityCustomMovePublicationType as PublicationType,
    CityRoll as Roll,
    CityRollStat as RollStat,
} from '@/contracts/mist-engine'

export type {
    CustomMoveKind,
    CustomMoveMeta,
    MoveTemplate,
    Outcome,
    OutcomeTier,
    PublicationType,
    Roll,
    RollStat,
}

/* The editable document. Every optional the schema allows is filled in here so
   a form never has to guard against `undefined`: a string becomes '', a list
   becomes [], the impact becomes 0 and the roll becomes null. What is empty on
   the way out is dropped again by `toCityOfMistCustomMovePayload`, so an
   untouched field never lands in the exported file as a deliberate value. */
export type CityOfMistCustomMove = {
    name: string
    kind: CustomMoveKind
    template: MoveTemplate
    trigger: string
    impact: number
    roll: Roll | null
    outcomes: Outcome[]
    frequency: string
    mc_note: string
    meta?: CustomMoveMeta
}

export function toCityOfMistCustomMoveDocument(
    cityOfMistCustomMove: CityOfMistCustomMoveData
): CityOfMistCustomMove {
    return {
        name: cityOfMistCustomMove.name,
        kind: cityOfMistCustomMove.kind,
        template: cityOfMistCustomMove.template,
        trigger: cityOfMistCustomMove.trigger,
        impact: cityOfMistCustomMove.impact ?? 0,
        roll: cityOfMistCustomMove.roll ?? null,
        outcomes: cityOfMistCustomMove.outcomes ?? [],
        frequency: cityOfMistCustomMove.frequency ?? '',
        mc_note: cityOfMistCustomMove.mc_note ?? '',
        meta: cityOfMistCustomMove.meta,
    }
}

/* The reverse trip, key by key. A blank optional is left out of the object
   rather than written as an empty string: TOML has no way to say "absent" once
   a key is printed, and the schema rejects an empty trigger label or a zero
   impact anyway. */
export function toCityOfMistCustomMovePayload(
    cityOfMistCustomMove: CityOfMistCustomMove
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: cityOfMistCustomMove.name,
        kind: cityOfMistCustomMove.kind,
        template: cityOfMistCustomMove.template,
        trigger: cityOfMistCustomMove.trigger,
    }

    if (cityOfMistCustomMove.impact > 0) {
        payload.impact = cityOfMistCustomMove.impact
    }

    if (cityOfMistCustomMove.roll) {
        const roll: Record<string, unknown> = {
            stat: cityOfMistCustomMove.roll.stat,
        }
        if (cityOfMistCustomMove.roll.label?.trim()) {
            roll.label = cityOfMistCustomMove.roll.label.trim()
        }
        if (cityOfMistCustomMove.roll.modifier) {
            roll.modifier = cityOfMistCustomMove.roll.modifier
        }
        payload.roll = roll
    }

    if (cityOfMistCustomMove.outcomes.length) {
        payload.outcomes = cityOfMistCustomMove.outcomes.map((outcome) => {
            const entry: Record<string, unknown> = {
                tier: outcome.tier,
                text: outcome.text,
            }
            if (outcome.options?.length) {
                entry.options = outcome.options
            }
            if (outcome.pick_count) {
                entry.pick_count = outcome.pick_count
            }
            return entry
        })
    }

    if (cityOfMistCustomMove.frequency.trim()) {
        payload.frequency = cityOfMistCustomMove.frequency.trim()
    }

    if (cityOfMistCustomMove.mc_note.trim()) {
        payload.mc_note = cityOfMistCustomMove.mc_note.trim()
    }

    const meta = cityOfMistCustomMove.meta
    if (meta) {
        const metaPayload: Record<string, unknown> = {
            publication_type: meta.publication_type,
        }
        if (meta.source?.trim()) metaPayload.source = meta.source.trim()
        if (meta.authors?.length) metaPayload.authors = meta.authors
        if (meta.page != null) metaPayload.page = meta.page
        payload.meta = metaPayload
    }

    return payload
}

/* The move header is not a section: a card with no name is still a card, so it
   prints unconditionally and only these four zones can be hidden. */
export type SectionId = 'trigger' | 'roll' | 'outcomes' | 'meta'

export type Background =
    | 'bg0'
    | 'bg1'
    | 'bg2'
    | 'bg3'
    | 'bg4'
    | 'bg5'
    | 'bg6'
    | 'bg7'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type CityOfMistCustomMoveViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    showSeparators: boolean
    exportPrefs: ExportPrefs
}

/* `basic` and `trigger` both land on the trigger form: the header fields and
   the trigger are written together at the table, and splitting them would make
   the panel flip for a two-word edit. */
export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'trigger'; mode?: 'edit' }
    | { kind: 'roll'; mode?: 'edit' }
    | { kind: 'outcomes'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'meta'; mode?: 'edit' }

export type CityOfMistCustomMoveSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 360
export const PREVIEW_WIDTH_MAX = 920
export const PREVIEW_WIDTH_DEFAULT = 560

export const defaultHidden: Record<SectionId, boolean> = {
    trigger: false,
    roll: false,
    outcomes: false,
    meta: false,
}

export const defaultCityOfMistCustomMoveView: CityOfMistCustomMoveViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'bg1',
    autoHideEmpty: true,
    hidden: defaultHidden,
    showSeparators: true,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultCityOfMistCustomMoveSheetState: CityOfMistCustomMoveSheetState =
    {
        open: false,
        target: null,
    }

export const blankCityOfMistCustomMove = (): CityOfMistCustomMove => ({
    name: 'Untitled Custom Move',
    kind: 'danger',
    template: 'freeform',
    trigger: 'When you ',
    impact: 0,
    roll: null,
    outcomes: [],
    frequency: '',
    mc_note: '',
})
