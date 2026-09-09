import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'

/* A headed prose zone. The page prints two of them — CONCEPT and the title
   guidance — and they differ only by their heading and their placeholder, so
   one block serves both rather than a pair that would drift apart on the next
   restyle. */
type Props = {
    title: string
    text: string
    placeholder: string
    onClick: () => void
}

export default function ConceptBlock({
    title,
    text,
    placeholder,
    onClick,
}: Props) {
    return (
        <section className="city-kit-section city-kit-concept">
            <SectionHeader title={title} onClick={onClick} />
            <ClickableSection onClick={onClick} ariaLabel={`Edit ${title}`}>
                {text ? (
                    <div
                        className="city-kit-prose"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(text),
                        }}
                    />
                ) : (
                    <span className="city-kit-placeholder">{placeholder}</span>
                )}
            </ClickableSection>
        </section>
    )
}
