/*
 * The notes page has a fixed size: what the player writes must fit it, in characters (the capacity
 * the schema publishes) and in rendered height (the lines the page really holds). The capacity is
 * read from the schema by the caller and never restated here.
 */

/** The attribute the body of a notes page carries, so the editor can measure against the real page. */
export const NOTES_BODY_ATTRIBUTE = 'data-notes-body'

/** Whether a text is accepted: within the capacity and inside the page. */
export function acceptsNotes(
    text: string,
    capacity: number,
    fits: (text: string) => boolean
): boolean {
    return text.length <= capacity && fits(text)
}

/**
 * The longest prefix of `text` the page accepts. The page holding a text implies it holds each of
 * its prefixes, so a bisection finds the cut: a paste beyond the page is cut where the page ends.
 */
export function fittingPrefix(
    text: string,
    capacity: number,
    fits: (text: string) => boolean
): string {
    if (acceptsNotes(text, capacity, fits)) return text
    let low = 0
    let high = Math.min(text.length, capacity)
    while (low < high) {
        const middle = Math.ceil((low + high) / 2)
        if (acceptsNotes(text.slice(0, middle), capacity, fits)) low = middle
        else high = middle - 1
    }
    return text.slice(0, low)
}

/**
 * A fit test against the page drawn in the preview: the text is poured into a copy of its body,
 * same width, same typography, and must not overflow the height of the live body. Without a page in
 * the document (no preview mounted) nothing is measured and the text fits.
 */
export function fitsRenderedPage(root?: ParentNode) {
    return (text: string): boolean => {
        const scope = root ?? (typeof document === 'undefined' ? null : document)
        if (!scope || typeof scope.querySelector !== 'function') return true
        const live = scope.querySelector<HTMLElement>(
            `[${NOTES_BODY_ATTRIBUTE}]`
        )
        const parent = live?.parentElement
        if (!live || !parent || live.clientHeight === 0) return true
        const probe = live.cloneNode(false) as HTMLElement
        probe.removeAttribute(NOTES_BODY_ATTRIBUTE)
        probe.textContent = text
        probe.setAttribute('aria-hidden', 'true')
        probe.style.cssText =
            'position:absolute;visibility:hidden;pointer-events:none;overflow:visible;flex:none;height:auto;' +
            `width:${live.clientWidth}px`
        parent.appendChild(probe)
        const fitting = probe.scrollHeight <= live.clientHeight
        parent.removeChild(probe)
        return fitting
    }
}
