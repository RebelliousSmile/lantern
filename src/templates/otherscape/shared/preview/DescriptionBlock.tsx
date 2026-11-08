import { useUiText } from '@/i18n/text'
import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from './components/Clickable'
import './ruleAndSpecial.css'

/* Paragraph breaks are carried by blank lines in the one string, so the
   Markdown renderer splits them the way the printed card does. */
export default function DescriptionBlock({
    description,
    onOpen,
}: {
    description: string
    onOpen: () => void
}) {
    const text = useUiText()

    return (
        <ClickableSection
            onClick={onOpen}
            ariaLabel={text('otherscape:forms.themeKit.description.label')}
        >
            <div className="os-description">
                {description.trim() ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(description),
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
