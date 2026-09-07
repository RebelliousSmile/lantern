import * as React from 'react'

export function ClickableSection({
    onClick,
    ariaLabel,
    children,
    overlayClassName = '',
}: {
    onClick: () => void
    ariaLabel: string
    children: React.ReactNode
    overlayClassName?: string
}) {
    return (
        <div className="relative group">
            {/* click target (above overlay) */}
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className="absolute cursor-pointer inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            {/* content */}
            <div className="relative z-0">{children}</div>

            {/* hover overlay */}
            <div
                className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ${overlayClassName}`}
                style={{ background: 'rgba(0,0,0,0.05)' }}
            />
        </div>
    )
}

/* A tag sits inside a flowing run, so it cannot take the block overlay above:
   it highlights itself instead, and stays inline so the run keeps wrapping as
   a paragraph. */
export function ClickableInline({
    onClick,
    ariaLabel,
    children,
}: {
    onClick: () => void
    ariaLabel: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className="inline cursor-pointer rounded-sm text-left hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
            {children}
        </button>
    )
}
