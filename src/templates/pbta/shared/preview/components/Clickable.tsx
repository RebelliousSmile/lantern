import * as React from 'react'

/* Every PbtA card edits the same way: the region you want to change is the
   button. These live here rather than in one template because both the game
   definition and the playbook print regions and rows, and a copy per
   template would drift the hover affordance apart card by card. */
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
                className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            {/* content */}
            <div className="relative z-0">{children}</div>

            {/* Hover wash. The PbtA card is cream stock like City's parchment,
                so a region darkens on hover rather than lightening the way
                :Otherscape's near-black slab pair does. */}
            <div
                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${overlayClassName}`}
                style={{ background: 'rgba(0,0,0,0.05)' }}
            />
        </div>
    )
}

/* A row that is already the width of the run takes the click itself and
   highlights in place rather than under an overlay. */
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

/* A block that makes a non-button element clickable needs the keyboard back:
   Enter and Space are what a button would have given it for free. */
export function handleClickableKeyDown(
    event: React.KeyboardEvent,
    onClick: () => void
) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick()
    }
}
