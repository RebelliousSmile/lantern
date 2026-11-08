import { useUiText } from '@/i18n/text'
import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'

export default function DescriptionBlock() {
    const text = useUiText()
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const openDescription = () =>
        openSheet({ kind: 'description', mode: 'edit' })

    /* Paragraph breaks are carried by blank lines in the one string, so the
       Markdown renderer splits them the way the printed kit does. */
    return (
        <ClickableSection
            onClick={openDescription}
            ariaLabel={text('otherscape:forms.themeKit.description.label')}
        >
            <div className="theme-kit-description">
                {otherscapeThemeKit.description.trim() ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(
                                otherscapeThemeKit.description
                            ),
                        }}
                    />
                ) : (
                    <span className="text-xs underline decoration-dotted cursor-pointer">
                        {text('otherscape:forms.themeKit.description.add')}
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
