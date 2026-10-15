import { DeltaEtatDeCreature, EtatDeCreature, Monstre } from 'schema-adrenaline'
import { canonical, compact } from '../../shared/editor/clean'
import type { MonsterState } from '../states'

/** Every key a state may redefine in its `delta`, as the contract declares them. */
export const DELTA_KEYS: string[] = Object.keys(DeltaEtatDeCreature.shape)

/** A delta key the base has no counterpart for (the state's own note): only a state holds it. */
export const isStateOnly = (key: string): boolean => !(key in Monstre.shape)

/*
 * What a state that owns a key may hold once the user has emptied it, as the contract accepts it:
 * probed, never assumed. `undefined` when the contract takes no empty form for the key.
 */
const EMPTY_FORMS: unknown[] = [[], {}, 0]
const emptyForms = new Map<string, unknown>()
export function acceptedEmpty(key: string): unknown {
    if (emptyForms.has(key)) return emptyForms.get(key)
    const form = EMPTY_FORMS.find(
        (empty) =>
            EtatDeCreature.safeParse({
                id: 'sonde',
                nom: 'sonde',
                delta: { [key]: empty },
            }).success
    )
    emptyForms.set(key, form)
    return form
}

export type DeltaWrite =
    | { ok: true; state: MonsterState }
    | { ok: false; reason: 'cannot-be-empty' }

/**
 * `state` with its `delta[key]` set to what the draft holds, cleaned. A key the state owns stays
 * the state's when the draft is emptied (the empty form the contract accepts); a key with no such
 * form is refused, never silently handed back to the base.
 */
export function writeDeltaKey(
    state: MonsterState,
    key: string,
    draft: unknown
): DeltaWrite {
    let value = compact(draft)
    if (value === undefined) {
        value = acceptedEmpty(key)
        if (value === undefined) return { ok: false, reason: 'cannot-be-empty' }
    }
    return {
        ok: true,
        state: {
            ...state,
            delta: { ...state.delta, [key]: value } as MonsterState['delta'],
        },
    }
}

/** A draft kept beside the value it was typed over. */
export type Draft = { value: unknown; over: string }

/**
 * What the editor shows: the draft while the document still holds what the draft cleans to (it was
 * written) or still holds what it was typed over (the write was refused); otherwise the document.
 */
export function shownValue(draft: Draft | undefined, stored: unknown): unknown {
    if (!draft) return stored
    const written =
        canonical(compact(draft.value)) === canonical(compact(stored))
    return written || canonical(stored) === draft.over ? draft.value : stored
}

export type DeltaGift =
    | { kind: 'written'; state: MonsterState }
    | { kind: 'draft' }

/**
 * Gives `state` its own value for `key`: a copy of the base's value, else the empty form the contract
 * accepts. A key with neither (the base has no value and the contract takes no empty form) is only
 * opened as a draft: nothing is written until the user has typed a value the contract accepts.
 */
export function giveDeltaKey(
    state: MonsterState,
    key: string,
    base: unknown
): DeltaGift {
    const value =
        base !== undefined ? structuredClone(base) : acceptedEmpty(key)
    if (value === undefined) return { kind: 'draft' }
    return {
        kind: 'written',
        state: {
            ...state,
            delta: { ...state.delta, [key]: value } as MonsterState['delta'],
        },
    }
}

/** `state` without its own `key`: the card then prints the base's value again. */
export function takeBackDeltaKey(
    state: MonsterState,
    key: string
): MonsterState {
    const delta = { ...state.delta } as Record<string, unknown>
    delete delta[key]
    return { ...state, delta: delta as MonsterState['delta'] }
}

/** One delta key as the panel for one profile edits it: its current value, who owns it, how to write it. */
export type DeltaSource = {
    key: string
    /** The profile edited: a state, or `undefined` for the base. */
    state: MonsterState | undefined
    index: number
    /** The state when it holds its own value for `key`; `undefined` when the value is the base's. */
    owner: MonsterState | undefined
    value: unknown
    /** The field shows what was typed, but the document still holds the stored value (the write was refused). */
    refused: boolean
    write: (value: unknown) => void
}
