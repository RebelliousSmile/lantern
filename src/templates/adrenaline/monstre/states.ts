import {
    EtatDeCreature,
    resoudreEtatMonstre,
    type EtatDeCreatureValeur,
    type MonstreDocument,
    type MonstreResolu,
} from 'schema-adrenaline'

export type MonsterDocument = Record<string, unknown>
export type MonsterState = EtatDeCreatureValeur
export type MonsterStateError = 'duplicate-id' | 'invalid-state'
export type MonsterStateResult =
    | { ok: true; document: MonsterDocument }
    | { ok: false; error: MonsterStateError }

export function monsterStates(document: MonsterDocument): MonsterState[] {
    return Array.isArray(document.etats)
        ? (document.etats as MonsterState[])
        : []
}

export function nextMonsterStateId(
    states: MonsterState[],
    base = 'etat'
): string {
    const ids = new Set(states.map((state) => state.id))
    if (!ids.has(base)) return base
    let suffix = 2
    while (ids.has(`${base}-${suffix}`)) suffix += 1
    return `${base}-${suffix}`
}

export function addMonsterState(
    document: MonsterDocument,
    name: string
): MonsterStateResult {
    const states = monsterStates(document)
    const state = {
        id: nextMonsterStateId(states),
        nom: name,
        delta: {},
    }
    const parsed = EtatDeCreature.safeParse(state)
    if (!parsed.success) return { ok: false, error: 'invalid-state' }
    return {
        ok: true,
        document: { ...document, etats: [...states, parsed.data] },
    }
}

export function replaceMonsterState(
    document: MonsterDocument,
    index: number,
    replacement: unknown
): MonsterStateResult {
    const states = monsterStates(document)
    const current = states[index]
    if (!current) return { ok: false, error: 'invalid-state' }

    const parsed = EtatDeCreature.safeParse(replacement)
    if (!parsed.success) return { ok: false, error: 'invalid-state' }
    if (
        states.some(
            (state, candidateIndex) =>
                candidateIndex !== index && state.id === parsed.data.id
        )
    ) {
        return { ok: false, error: 'duplicate-id' }
    }

    const next: MonsterDocument = {
        ...document,
        etats: states.map((state, candidateIndex) =>
            candidateIndex === index ? parsed.data : state
        ),
    }
    if (document.etatActif === current.id) next.etatActif = parsed.data.id
    return { ok: true, document: next }
}

export function removeMonsterState(
    document: MonsterDocument,
    index: number
): MonsterDocument {
    const states = monsterStates(document)
    const removed = states[index]
    if (!removed) return document

    const remaining = states.filter(
        (_, candidateIndex) => candidateIndex !== index
    )
    const next = { ...document }
    if (remaining.length) next.etats = remaining
    else delete next.etats
    if (next.etatActif === removed.id) delete next.etatActif
    return next
}

export function selectMonsterState(
    document: MonsterDocument,
    stateId: string
): MonsterDocument {
    const next = { ...document }
    if (stateId === 'base') {
        delete next.etatActif
        return next
    }
    if (monsterStates(document).some((state) => state.id === stateId)) {
        next.etatActif = stateId
    }
    return next
}

export function resolveMonsterProfile(document: MonsterDocument): MonstreResolu {
    return resoudreEtatMonstre(document as unknown as MonstreDocument)
}
