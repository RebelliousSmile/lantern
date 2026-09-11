import type { ReactNode } from 'react'
import type { PlaybookAttributeValue } from '../../model'

export function KeyValueList({
    entries,
    emptyLabel,
}: {
    entries: Array<[string, ReactNode]>
    emptyLabel: string
}) {
    if (entries.length === 0) {
        return <p className="pbta-pb-empty-row">{emptyLabel}</p>
    }

    return (
        <ul className="pbta-pb-list">
            {entries.map(([key, value]) => (
                <li key={key} className="pbta-pb-list-item">
                    <span className="pbta-pb-list-item__key">{key}</span>
                    <span>{value}</span>
                </li>
            ))}
        </ul>
    )
}

export function SimpleList({
    items,
    emptyLabel,
}: {
    items: string[]
    emptyLabel: string
}) {
    if (items.length === 0) {
        return <p className="pbta-pb-empty-row">{emptyLabel}</p>
    }

    return (
        <ul className="pbta-pb-list">
            {items.map((item, index) => (
                <li key={index} className="pbta-pb-list-item">
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    )
}

export function formatAttributeValue(value: PlaybookAttributeValue): string {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
    return String(value)
}
