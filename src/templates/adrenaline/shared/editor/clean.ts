export type Entry = Record<string, unknown>

export const record = (value: unknown): Entry =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Entry)
        : {}

/*
 * The contract is strict: a string is never empty, a list never holds fewer than one element and
 * an object that lost every field is not written. The editor keeps what is typed in a draft,
 * blank rows included, and hands the document only what `clean*` lets through.
 */
export const filled = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim() ? value : undefined

/** `entry` with `key` set, or without it when `value` is undefined. */
export function put(entry: Entry, key: string, value: unknown): Entry {
    const next = { ...entry }
    if (value === undefined) delete next[key]
    else next[key] = value
    return next
}

export function cleanList<T>(
    value: unknown,
    clean: (item: unknown) => T | undefined
): T[] | undefined {
    if (!Array.isArray(value)) return undefined
    const kept = value.flatMap((item) => {
        const cleaned = clean(item)
        return cleaned === undefined ? [] : [cleaned]
    })
    return kept.length > 0 ? kept : undefined
}

/** Key order must not make two equal documents look different. */
export function canonical(value: unknown): string {
    return JSON.stringify(value, (_, item: unknown) =>
        item && typeof item === 'object' && !Array.isArray(item)
            ? Object.fromEntries(
                  Object.entries(item as Entry).sort(([a], [b]) =>
                      a < b ? -1 : a > b ? 1 : 0
                  )
              )
            : item
    )
}

/**
 * What a draft may hand the document: no blank string, no entry of a list that is still
 * nameless, no list or object left empty. `undefined` when nothing is left. Numbers and
 * booleans are values and stay.
 */
export function compact(value: unknown): unknown {
    if (typeof value === 'string') return filled(value)
    if (Array.isArray(value)) {
        const kept = value.flatMap((item) => {
            if (
                item &&
                typeof item === 'object' &&
                !Array.isArray(item) &&
                typeof (item as Entry).nom === 'string' &&
                !filled((item as Entry).nom)
            )
                return []
            const cleaned = compact(item)
            return cleaned === undefined ? [] : [cleaned]
        })
        return kept.length > 0 ? kept : undefined
    }
    if (value && typeof value === 'object') {
        const kept = Object.entries(value as Entry).flatMap(([key, item]) => {
            const cleaned = compact(item)
            return cleaned === undefined ? [] : [[key, cleaned] as const]
        })
        return kept.length > 0 ? Object.fromEntries(kept) : undefined
    }
    return value === null ? undefined : value
}
