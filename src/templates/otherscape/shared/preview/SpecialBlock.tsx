import { useUiText } from '@/i18n/text'
import { renderLitmMarkdown } from '@/utils/markdown'
import type { SpecialValue } from '../SpecialForm'
import { ClickableSection } from './components/Clickable'
import './ruleAndSpecial.css'

/* The printed card closes on its one Special, behind the box the character
   ticks when they take it as an improvement. The kit and the theme print the
   same object, so it is drawn once and each owner says what a click opens. */
export default function SpecialBlock({
    special,
    onOpen,
}: {
    special: SpecialValue
    onOpen: () => void
}) {
    const text = useUiText()

    return (
        <ClickableSection
            onClick={onOpen}
            ariaLabel={text('otherscape:themeKit.sections.special')}
        >
            <div className="os-special">
                <span className="os-rule-label">
                    {text('otherscape:themeKit.sections.special')}
                </span>
                {special.name.trim() || special.description.trim() ? (
                    <div className="os-special__line">
                        <span className="os-special__box" aria-hidden />
                        <div className="os-special__text">
                            <strong className="os-special__name">
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
