import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import type { Improvement } from '../../schema'

type Props = {
    themebookName: string
    improvements: Improvement[]
    onAddClick: () => void
    onItemClick: (index: number) => void
}

export default function ImprovementsBlock({
    themebookName,
    improvements,
    onAddClick,
    onItemClick,
}: Props) {
    /* The books head this block with the themebook's own name — PERSONALITY
       THEME IMPROVEMENTS — so the block still reads as belonging to that
       themebook once a page is cut out and filed with fifty others. */
    const title = themebookName.trim()
        ? `${themebookName.trim()} Theme Improvements`
        : 'Theme Improvements'

    return (
        <section className="city-kit-section city-kit-improvements">
            <SectionHeader title={title} onClick={onAddClick} />
            {improvements.length ? (
                <ul className="city-kit-improvement-list">
                    {improvements.map((improvement, index) => (
                        <li key={`${index}-${improvement.name}`}>
                            <ClickableInline
                                onClick={() => onItemClick(index)}
                                ariaLabel={`Edit improvement ${improvement.name}`}
                                className="city-kit-improvement"
                            >
                                <span
                                    className="city-kit-improvement__check"
                                    aria-hidden="true"
                                >
                                    ☐
                                </span>
                                <span>
                                    <strong className="city-kit-improvement__name">
                                        {improvement.name}
                                    </strong>
                                    {improvement.effect ? (
                                        <span
                                            className="city-kit-improvement__effect"
                                            dangerouslySetInnerHTML={{
                                                __html: renderLitmInline(
                                                    improvement.effect
                                                ),
                                            }}
                                        />
                                    ) : null}
                                </span>
                            </ClickableInline>
                        </li>
                    ))}
                </ul>
            ) : (
                <button
                    type="button"
                    className="city-kit-add"
                    onClick={onAddClick}
                >
                    add the five improvements
                </button>
            )}
        </section>
    )
}
