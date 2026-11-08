import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { TypeGlyph } from '../../../shared/preview/components/TypeGlyph'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'
import { THEME_TYPE_LABEL } from '../../model'

export default function HeaderBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* The band names the kit and carries the type's mark in a cartouche; under
       it, the themebook then the type, the way the book prints "EXPERTISE
       SELF". None of this is gated: the band is the card's top edge. */
    return (
        <ClickableSection
            onClick={openBasic}
            ariaLabel="Edit the title, themebook and theme type"
        >
            <div className="theme-kit-header">
                <span className="theme-kit-header__title">
                    {otherscapeThemeKit.title_tag || 'Untitled Theme Kit'}
                </span>
                <span className="theme-kit-header__cartouche">
                    <TypeGlyph
                        className="theme-kit-header__glyph"
                        themeType={otherscapeThemeKit.theme_type}
                    />
                </span>
            </div>
            <p className="theme-kit-kicker">
                <span className="theme-kit-kicker__category">
                    {otherscapeThemeKit.category || (
                        <span className="os-placeholder">add a themebook</span>
                    )}
                </span>{' '}
                <span className="theme-kit-kicker__type">
                    {THEME_TYPE_LABEL[otherscapeThemeKit.theme_type]}
                </span>
            </p>
        </ClickableSection>
    )
}
