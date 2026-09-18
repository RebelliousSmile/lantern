import {
    getAtPath,
    moveAtPath,
    removeAtPath,
    setAtPath,
} from '@/core/editor-schema/path'
import type { EditorPath } from '@/core/editor-schema/types'
import {
    getPbtaCollectionPresentation,
    type PbtaCollectionPresentation,
} from 'schema-pbta'

export function collectionPath(path: string): EditorPath | null {
    if (!path || path.includes('[]')) return null
    return path.split('.')
}

export function collectionFor(
    target: PbtaCollectionPresentation['target'],
    path: string
) {
    return getPbtaCollectionPresentation(target, path)
}

export function collectionItems(
    document: Record<string, unknown>,
    presentation: PbtaCollectionPresentation
): unknown[] | null {
    const path = collectionPath(presentation.path)
    if (!path) return null
    const value = getAtPath(document, path)
    return value === undefined ? [] : Array.isArray(value) ? value : null
}

export function replaceCollectionItems(
    document: Record<string, unknown>,
    presentation: PbtaCollectionPresentation,
    items: unknown[]
) {
    const path = collectionPath(presentation.path)
    if (!path) return document
    return setAtPath(document, path, items)
}

export function removeCollectionItem(
    document: Record<string, unknown>,
    presentation: PbtaCollectionPresentation,
    index: number
) {
    if (presentation.cardinality !== 'mutable') return document
    const path = collectionPath(presentation.path)
    return path ? removeAtPath(document, path, index) : document
}

export function reorderCollectionItem(
    document: Record<string, unknown>,
    presentation: PbtaCollectionPresentation,
    from: number,
    to: number
) {
    const path = collectionPath(presentation.path)
    return path && presentation.reorder
        ? moveAtPath(document, path, from, to)
        : document
}
