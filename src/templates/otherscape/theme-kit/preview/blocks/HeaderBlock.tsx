import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'
import { THEME_TYPE_LABEL, type ThemeType } from '../../model'

/* The four marks the card pins to the right of its band. They are drawn here
   rather than loaded so each one takes the band's own colour, and they say the
   same thing as the label beside them: which of the four a kit is. */
function TypeGlyph({ themeType }: { themeType: ThemeType }) {
    const shape: Record<ThemeType, React.ReactNode> = {
        // Self: a figure, closed on itself.
        self: <circle cx="12" cy="12" r="7" />,
        // Mythos: the point where something larger breaks through.
        mythos: <path d="M12 3 21 12 12 21 3 12Z" />,
        // Noise: the city's flat, repeating signal.
        noise: <path d="M3 12h4l2.5-6 5 12L17 12h4" />,
        // Crew: two standing together.
        crew: (
            <path d="M4 19v-2a4 4 0 0 1 8 0v2M12 17a4 4 0 0 1 8 0v2M8 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm8 1a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
        ),
    }

    return (
        <svg
            className="theme-kit-header__glyph"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            focusable="false"
        >
            {shape[themeType]}
        </svg>
    )
}

export default function HeaderBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* None of this is gated: the band is the card's top edge rather than a
       section, and the title tag is what the card is. A kit that names no
       themebook still prints the band, so the frame stays closed. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the themebook and theme type"
            >
                <div className="theme-kit-header os-bar">
                    <span className="theme-kit-header__category">
                        {otherscapeThemeKit.category || (
                            <span className="os-placeholder">
                                add a themebook
                            </span>
                        )}
                    </span>
                    <span className="theme-kit-header__type">
                        {THEME_TYPE_LABEL[otherscapeThemeKit.theme_type]}
                        <TypeGlyph themeType={otherscapeThemeKit.theme_type} />
                    </span>
                </div>
            </ClickableSection>

            {/* The legend the printed card runs above the stack, so the rows
                below read as what they are without a header on each run. */}
            <div className="theme-kit-legend">
                <span className="os-label theme-kit-legend__key">Tags</span>
                <span className="os-label theme-kit-legend__sep">/</span>
                <span className="os-label">Power</span>
                <span className="os-label theme-kit-legend__sep">&middot;</span>
                <span className="os-label">Weakness</span>
            </div>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the title tag"
            >
                <div className="theme-kit-title os-bar">
                    {/* A printed title, not a tag: the card names the kit here,
                        so it takes no braces and no token renderer. */}
                    <span className="theme-kit-title__text os-display">
                        {otherscapeThemeKit.title_tag || 'Untitled Theme Kit'}
                    </span>
                </div>
            </ClickableSection>
        </>
    )
}
