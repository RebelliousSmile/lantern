import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useCityOfMistCustomMoveStore, type CustomMoveKind } from '../../hooks'

const KIND_LABEL: Record<CustomMoveKind, string> = {
    danger: 'Danger Move',
    situational: 'Situational Move',
    improvement: 'Improvement Move',
}

/* Always prints: a card with no name is still a card, so the header is not one
   of the zones the appearance panel can hide. */
export default function MoveHeader({ onClick }: { onClick: () => void }) {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()
    const impact = Math.max(0, Math.min(3, cityOfMistCustomMove.impact || 0))

    return (
        <div className="city-move-header">
            <ClickableSection onClick={onClick} ariaLabel="Edit move header">
                <div className="city-move-title-row">
                    <div className="city-move-title">
                        {cityOfMistCustomMove.name || (
                            <span className="city-move-placeholder">
                                name this move
                            </span>
                        )}
                    </div>
                </div>
                <div className="city-move-header-meta">
                    <span className="city-move-badge">
                        {KIND_LABEL[cityOfMistCustomMove.kind]}
                    </span>
                    {impact > 0 ? (
                        <span
                            className="city-move-impact"
                            aria-label={`Impact ${impact} of 3`}
                        >
                            {'●'.repeat(impact)}
                            <span className="city-move-impact--empty">
                                {'○'.repeat(3 - impact)}
                            </span>
                        </span>
                    ) : null}
                </div>
            </ClickableSection>
        </div>
    )
}
