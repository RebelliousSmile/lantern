import * as React from 'react'

/* Every Otherscape card edits the same way: the region you want to change is
   the button. These two live here rather than in one template because the six
   Otherscape documents all print regions and tags, and a copy per template
   would drift the hover affordance apart card by card. */
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

            {/* Hover wash. The Otherscape card is a pale slab under coloured
                bars, so it lifts on hover instead of darkening the way the
                Legend card does. */}
            <div
                className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ${overlayClassName}`}
                style={{ background: 'rgba(255,255,255,0.22)' }}
            />
        </div>
    )
}

/* A tag sits inside a slab that is already the width of the run, so it takes
   the click itself and highlights in place rather than under an overlay. */
export function ClickableInline({
    onClick,
    ariaLabel,
    children,
    className = '',
}: {
    onClick: () => void
    ariaLabel: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}`}
        >
            {children}
        </button>
    )
}
