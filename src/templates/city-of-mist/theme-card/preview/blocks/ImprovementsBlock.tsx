import type { CityCardImprovement as Improvement } from '@/contracts/mist-engine'
import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'

type Props = {
    improvements: Improvement[]
    onAddClick: () => void
    onItemClick: (index: number) => void
}

export default function ImprovementsBlock({
    improvements,
    onAddClick,
    onItemClick,
}: Props) {
    return (
        <section className="city-card-section city-card-improvements">
            <SectionHeader title="Improvements" onClick={onAddClick} />
            {improvements.length ? (
                <ul className="city-card-improvement-list">
                    {improvements.map((improvement, index) => (
                        <li key={`${improvement.name}-${index}`}>
                            <ClickableInline
                                onClick={() => onItemClick(index)}
                                ariaLabel={`Edit improvement ${improvement.name}`}
                                className="city-card-improvement"
                            >
                                <span
                                    className="city-card-improvement__check"
                                    aria-label={
                                        improvement.is_taken
                                            ? 'Taken'
                                            : 'Not taken'
                                    }
                                >
                                    {improvement.is_taken ? '☑' : '☐'}
                                </span>
                                <span>
                                    <strong className="city-card-improvement__name">
                                        {improvement.name}
                                    </strong>
                                    {improvement.effect ? (
                                        <span
                                            className="city-card-improvement__effect"
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
                    className="city-card-add"
                    onClick={onAddClick}
                >
                    add an improvement
                </button>
            )}
        </section>
    )
}
