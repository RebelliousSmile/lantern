import type { ReactNode } from 'react'

export function AdrenalineHeader({
    eyebrow,
    title,
    aside,
}: {
    eyebrow: string
    title: string
    aside?: ReactNode
}) {
    return (
        <header className="adr-header">
            <p className="adr-header__eyebrow">{eyebrow}</p>
            <div className="flex items-end justify-between gap-3">
                <h1 className="adr-header__title">{title}</h1>
                {aside}
            </div>
        </header>
    )
}

export function AdrenalineSection({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section>
            <h2 className="adr-section-title">{title}</h2>
            <div className="adr-block">{children}</div>
        </section>
    )
}

export function AdrenalineStatGrid({
    values,
}: {
    values: Array<{ label: string; value: string | number | undefined }>
}) {
    return (
        <div className="adr-stat-grid">
            {values.map(({ label, value }) => (
                <div className="adr-stat" key={label}>
                    <span className="adr-stat__label">{label}</span>
                    <strong className="adr-stat__value">{value ?? '—'}</strong>
                </div>
            ))}
        </div>
    )
}
