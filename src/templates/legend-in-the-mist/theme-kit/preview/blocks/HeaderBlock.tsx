import {
    useLegendInTheMistThemeKitSheetStore,
    useLegendInTheMistThemeKitStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'

/* The leaf pinned to the right of the bar. It is drawn here rather than loaded
   as an asset so it takes the bar's own colour, and it carries no meaning of
   its own: it is part of the frame, like the bar. */
function LeafGlyph() {
    return (
        <svg
            className="theme-kit-header__leaf"
            viewBox="0 0 24 24"
            aria-hidden
            focusable="false"
        >
            <path
                d="M20 3c-7.2 0-13 3.4-13 9.6 0 2 .6 3.7 1.6 5.1L5 21l1.4 1.4 3.3-3.3c1.4 1 3.1 1.6 5.1 1.6C21 20.7 20 9.4 20 3Z"
                fill="currentColor"
                opacity="0.9"
            />
            <path
                d="M18 6c-4.5 2.2-7.7 5.6-9.7 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.55"
            />
        </svg>
    )
}

export default function HeaderBlock() {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const { openSheet } = useLegendInTheMistThemeKitSheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* Neither part is gated: the bar is the card's top edge rather than a
       section, and the name is what the card is. A kit with no category still
       prints the bar, leaf and all, simply without a label, so the frame stays
       closed. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the themebook this kit belongs to"
            >
                <div className="theme-kit-header">
                    <span className="theme-kit-header__category">
                        {legendInTheMistThemeKit.category || (
                            <span className="theme-kit-header__placeholder">
                                add a themebook
                            </span>
                        )}
                    </span>
                    <LeafGlyph />
                </div>
            </ClickableSection>

            <ClickableSection onClick={openBasic} ariaLabel="Edit the kit name">
                <div className="theme-kit-name-box">
                    {/* A printed label, not a tag: no braces, no token
                        renderer, only the wash that follows the words. */}
                    <span className="theme-kit-name">
                        {legendInTheMistThemeKit.name || 'Untitled Theme Kit'}
                    </span>
                </div>
            </ClickableSection>
        </>
    )
}
