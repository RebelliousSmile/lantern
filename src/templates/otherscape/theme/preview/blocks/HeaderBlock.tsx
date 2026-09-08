import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
} from '../../hooks'
import { THEME_TYPE_LABEL, type ThemeType } from '../../model'

/* The four marks the card pins to the right of its band. They are drawn here
   rather than loaded so each one takes the band's own colour, and they say the
   same thing as the label beside them: which of the four a theme is. */
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
            className="theme-header__glyph"
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
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* None of this is gated: the band is the card's top edge rather than a
       section, and the title tag is what the card is. A theme that names no
       themebook still prints the band, so the frame stays closed. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the themebook and theme type"
            >
                <div className="theme-header os-bar">
                    <span className="theme-header__category">
                        {otherscapeTheme.category || (
                            <span className="os-placeholder">
                                add a themebook
                            </span>
                        )}
                    </span>
                    <span className="theme-header__type">
                        {THEME_TYPE_LABEL[otherscapeTheme.theme_type]}
                        <TypeGlyph themeType={otherscapeTheme.theme_type} />
                    </span>
                </div>
            </ClickableSection>

            {/* The legend the printed card runs above the stack, so the rows
                below read as what they are without a header on each run. */}
            <div className="theme-legend">
                <span className="os-label theme-legend__key">Tags</span>
                <span className="os-label theme-legend__sep">/</span>
                <span className="os-label">Power</span>
                <span className="os-label theme-legend__sep">&middot;</span>
                <span className="os-label">Weakness</span>
            </div>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the title tag"
            >
                <div className="theme-title os-bar">
                    {/* A printed title, not a tag: the card names the theme here,
                        so it takes no braces and no token renderer. */}
                    <span className="theme-title__text os-display">
                        {otherscapeTheme.title_tag || 'Untitled Theme'}
                    </span>
                </div>
            </ClickableSection>
        </>
    )
}
