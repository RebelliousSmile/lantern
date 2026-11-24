import { useState, type ReactNode } from 'react'
import './foldablePage.css'

/**
 * A page of a character sheet that stays folded until it is needed (the back, the notes): its label
 * is the handle. Folded, the page keeps its real size, so an export still measures it, and it takes
 * no room on screen. The label sits outside the page node: it is never part of an exported page.
 */
export function FoldablePage({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) {
    const [open, setOpen] = useState(false)
    return (
        <div className="lantern-foldable-page" data-folded={!open || undefined}>
            <button
                type="button"
                className="lantern-foldable-page__handle"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                {label}
            </button>
            <div className="lantern-foldable-page__body" inert={!open}>
                {children}
            </div>
        </div>
    )
}
