import { limitAt } from '../../shared/editor/pjLimits'

type Entry = Record<string, unknown>

/** The smallest number from 1 up that no NPC carries yet: a number given to an NPC is never renumbered. */
export function nextNumber(entries: readonly Entry[]): number | undefined {
    const taken = new Set(entries.map((entry) => entry.numero))
    const limit = limitAt('relations', '/pnjs[]/numero')
    const first = limit?.min ?? 1
    const last = limit?.max ?? 99
    for (let candidate = first; candidate <= last; candidate += 1)
        if (!taken.has(candidate)) return candidate
    return undefined
}
