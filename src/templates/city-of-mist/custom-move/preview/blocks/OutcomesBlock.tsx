import { renderSystemMarkdownInline } from '@/utils/markdown'
import {
    ClickableSection,
    handleClickableKeyDown,
} from '../../../shared/preview/components/Clickable'
import { useCityOfMistCustomMoveStore, type OutcomeTier } from '../../hooks'

const TIER_LABEL: Record<OutcomeTier, string> = {
    miss: 'Miss',
    hit: 'Hit',
    '7-9': '7-9',
    '10+': '10+',
    '12+': '12+',
}

export default function OutcomesBlock({
    onAddClick,
    onItemClick,
}: {
    onAddClick: () => void
    onItemClick: (index: number) => void
}) {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()

    return (
        <div className="city-move-section">
            {cityOfMistCustomMove.outcomes.length ? (
                <ul className="city-move-outcomes">
                    {cityOfMistCustomMove.outcomes.map((outcome, index) => (
                        <li
                            key={`${outcome.tier}-${index}`}
                            className="city-move-outcome"
                            onClick={() => onItemClick(index)}
                            onKeyDown={(event) =>
                                handleClickableKeyDown(event, () =>
                                    onItemClick(index)
                                )
                            }
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit outcome ${TIER_LABEL[outcome.tier]}`}
                        >
                            <div className="city-move-outcome__head">
                                <span className="city-move-outcome__tier">
                                    {TIER_LABEL[outcome.tier]}
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderSystemMarkdownInline(
                                            outcome.text
                                        ),
                                    }}
                                />
                            </div>
                            {outcome.options?.length ? (
                                <ul className="city-move-options">
                                    {outcome.options.map((option, optIndex) => (
                                        <li
                                            key={`${option}-${optIndex}`}
                                            className="city-move-option"
                                            dangerouslySetInnerHTML={{
                                                __html: renderSystemMarkdownInline(
                                                    option
                                                ),
                                            }}
                                        />
                                    ))}
                                </ul>
                            ) : null}
                            {outcome.pick_count ? (
                                <div className="city-move-outcome__pick">
                                    choose {outcome.pick_count}
                                </div>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <ClickableSection
                    onClick={onAddClick}
                    ariaLabel="Edit outcomes"
                >
                    <div className="city-move-empty-row">
                        <span className="city-move-placeholder">
                            add outcomes
                        </span>
                    </div>
                </ClickableSection>
            )}
        </div>
    )
}
