import { filled, type Entry } from './clean'
import { requiredAt, type SchemaName } from './schemaShapes'

/*
 * What a draft hands the exported document: the blank strings and the empty lists and objects
 * leave, and so does every line or group of a published schema that lacks a key it requires. The
 * lines left out are the ones the panels signal as drafts (`DraftScope`).
 */
const isObject = (value: unknown): value is Entry =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

export function compactAgainst(
    schema: SchemaName,
    value: unknown,
    pointer = ''
): unknown {
    if (typeof value === 'string') return filled(value)
    if (Array.isArray(value)) {
        const kept = value.flatMap((item) => {
            /* A nameless row is a draft whatever else it holds. */
            if (
                isObject(item) &&
                typeof item.nom === 'string' &&
                !filled(item.nom)
            )
                return []
            const cleaned = compactAgainst(schema, item, `${pointer}[]`)
            return cleaned === undefined ? [] : [cleaned]
        })
        return kept.length > 0 ? kept : undefined
    }
    if (isObject(value)) {
        const kept = Object.entries(value).flatMap(([key, item]) => {
            const cleaned = compactAgainst(schema, item, `${pointer}/${key}`)
            return cleaned === undefined ? [] : [[key, cleaned] as const]
        })
        if (kept.length === 0) return undefined
        const next = Object.fromEntries(kept)
        /* The document itself is kept as it is: an export that lacks a root key is reported, not hidden. */
        if (pointer !== '') {
            const required = requiredAt(schema, pointer)
            if (required.some((key) => next[key] === undefined))
                return undefined
        }
        return next
    }
    return value === null ? undefined : value
}
