import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'

/* The one zone the books print without a heading: the introduction runs
   straight under the keyword line, in the themebook's own voice, and a
   SectionHeader over it would turn a pitch into a form field. */
type Props = {
    introduction: string
    onClick: () => void
}

export default function IntroductionBlock({ introduction, onClick }: Props) {
    return (
        <section className="city-kit-section city-kit-introduction">
            <ClickableSection onClick={onClick} ariaLabel="Edit introduction">
                {introduction ? (
                    <div
                        className="city-kit-prose"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(introduction),
                        }}
                    />
                ) : (
                    <span className="city-kit-placeholder">
                        add an introduction
                    </span>
                )}
            </ClickableSection>
        </section>
    )
}
