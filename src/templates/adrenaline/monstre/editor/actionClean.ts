import {
    cleanList,
    filled,
    put,
    record,
    type Entry,
} from '../../shared/editor/clean'

export { canonical } from '../../shared/editor/clean'
export type { Entry }

/*
 * What is typed stays in the document, a group that lacks a key the schema requires included: it
 * is a draft the panels signal and the preview shows, and the export leaves it out
 * (`compactAgainst`). Only blank strings and emptied containers leave.
 */
function cleanProfile(value: unknown): Entry | undefined {
    const profile = record(value)
    let next = put(profile, 'des', filled(profile.des))
    /* A nature the editor does not list is kept as entered: the contract, not the editor, refuses it. */
    next = put(next, 'nature', filled(profile.nature))
    next = put(next, 'condition', filled(profile.condition))
    return Object.keys(next).length > 0 ? next : undefined
}

export function cleanDamage(value: unknown): Entry | undefined {
    const damage = record(value)
    let next = put(damage, 'profils', cleanList(damage.profils, cleanProfile))
    next = put(next, 'versant', filled(damage.versant))
    next = put(next, 'liant', filled(damage.liant))
    next = put(
        next,
        'proprietes',
        cleanList(damage.proprietes, filled) as string[] | undefined
    )
    next = put(next, 'munitions', filled(damage.munitions))
    next = put(next, 'portee', filled(damage.portee))
    return Object.keys(next).length > 0 ? next : undefined
}

function cleanTest(value: unknown): Entry | undefined {
    const test = record(value)
    /* A percentage is never invented: a test without one is a draft, signalled as such. */
    const next = put(test, 'nom', filled(test.nom))
    return Object.keys(next).length > 0 ? next : undefined
}

/** The fields an action and a follow-up share; legacy damage keys pass through untouched. */
function cleanCommon(value: unknown): Entry {
    const action = record(value)
    let next = put(action, 'nom', filled(action.nom))
    next = put(next, 'test', cleanTest(action.test))
    next = put(next, 'degats', cleanDamage(action.degats))
    next = put(
        next,
        'effets',
        cleanList(action.effets, filled) as string[] | undefined
    )
    next = put(
        next,
        'conditions',
        cleanList(action.conditions, filled) as string[] | undefined
    )
    return put(next, 'notes', filled(action.notes))
}

function cleanFollowUp(value: unknown): Entry | undefined {
    const next = put(cleanCommon(value), 'suites', undefined)
    return Object.keys(next).length > 0 ? next : undefined
}

export function cleanAction(value: unknown): Entry | undefined {
    const action = cleanCommon(value)
    const next = put(
        action,
        'suites',
        cleanList(record(value).suites, cleanFollowUp)
    )
    return Object.keys(next).length > 0 ? next : undefined
}

/** The figure a plain number or a triplet stands for. */
function currentOf(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    const current = record(value).current
    return typeof current === 'number' && Number.isFinite(current)
        ? current
        : undefined
}

/**
 * The one line a folded action or follow-up shows: its name, its test with the percentage, the
 * dice of its first damage profile. `undefined` when it has none of them yet.
 */
export function actionSummary(value: unknown): string | undefined {
    const action = record(value)
    const test = record(action.test)
    const percentage = currentOf(test.pourcentage)
    const testLine = filled(test.nom)
        ? `${String(test.nom).trim()}${percentage === undefined ? '' : ` ${percentage} %`}`
        : undefined
    const profiles = Array.isArray(record(action.degats).profils)
        ? (record(action.degats).profils as unknown[])
        : []
    const dice = profiles
        .map((profile) => filled(record(profile).des))
        .find((des) => des !== undefined)
    const parts = [filled(action.nom), testLine, dice].filter(
        (part): part is string => part !== undefined
    )
    return parts.length > 0 ? parts.join(' · ') : undefined
}

/** Whether the part of an action kept behind "More" holds a value, so it opens by itself. */
export function hasMoreFields(value: unknown): boolean {
    const action = record(value)
    const damage = record(action.degats)
    return (
        [damage.versant, damage.liant, damage.munitions, damage.portee].some(
            (field) => filled(field) !== undefined
        ) ||
        cleanList(damage.proprietes, filled) !== undefined ||
        cleanList(action.conditions, filled) !== undefined ||
        filled(action.notes) !== undefined
    )
}
