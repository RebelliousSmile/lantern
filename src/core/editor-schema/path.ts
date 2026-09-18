import type { EditorPath, EditorPathSegment } from './types'

export function getAtPath(value: unknown, path: EditorPath): unknown {
    return path.reduce<unknown>((current, segment) => {
        if (Array.isArray(current) && typeof segment === 'number')
            return current[segment]
        if (
            current &&
            typeof current === 'object' &&
            typeof segment === 'string'
        )
            return (current as Record<string, unknown>)[segment]
        return undefined
    }, value)
}

export function setAtPath<T>(value: T, path: EditorPath, next: unknown): T {
    if (!path.length) return next as T
    const [head, ...tail] = path
    const source = value && typeof value === 'object' ? value : {}
    if (typeof head === 'number') {
        const list = Array.isArray(source) ? [...source] : []
        list[head] = setAtPath(list[head], tail, next)
        return list as T
    }
    return {
        ...(source as Record<string, unknown>),
        [head]: setAtPath(
            (source as Record<string, unknown>)[head],
            tail,
            next
        ),
    } as T
}

export function appendAtPath<T>(value: T, path: EditorPath, item: unknown): T {
    const current = getAtPath(value, path)
    return setAtPath(value, path, [
        ...(Array.isArray(current) ? current : []),
        item,
    ])
}

export function removeAtPath<T>(value: T, path: EditorPath, index: number): T {
    const current = getAtPath(value, path)
    if (!Array.isArray(current)) return value
    return setAtPath(
        value,
        path,
        current.filter((_, itemIndex) => itemIndex !== index)
    )
}

export function moveAtPath<T>(
    value: T,
    path: EditorPath,
    from: number,
    to: number
): T {
    const current = getAtPath(value, path)
    if (!Array.isArray(current) || to < 0 || to >= current.length) return value
    const next = [...current]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return setAtPath(value, path, next)
}

export function joinPath(
    path: EditorPath,
    segment: EditorPathSegment
): EditorPath {
    return [...path, segment]
}
