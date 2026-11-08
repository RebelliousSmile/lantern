import { useUiText } from '@/i18n/text'
import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'

export default function SpecialBlock() {
    const text = useUiText()
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()
    const special = otherscapeThemeKit.special

    const openSpecial = () => openSheet({ kind: 'special', mode: 'edit' })

    /* The printed kit closes on its one Special, behind the box the character
       ticks when they take it as an improvement. */
    return (
        <ClickableSection
            onClick={openSpecial}
            ariaLabel={text('otherscape:themeKit.sections.special')}
        >
            <div className="theme-kit-special">
                <span className="theme-kit-rule-label">
                    {text('otherscape:themeKit.sections.special')}
                </span>
                {special.name.trim() || special.description.trim() ? (
                    <div className="theme-kit-special__line">
                        <span className="theme-kit-special__box" aria-hidden />
                        <div className="theme-kit-special__text">
                            <strong className="theme-kit-special__name">
                                {special.name}
                            </strong>{' '}
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(
                                        special.description
                                    ),
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <span className="text-xs underline decoration-dotted cursor-pointer">
                        {text('otherscape:forms.themeKit.special.add')}
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
