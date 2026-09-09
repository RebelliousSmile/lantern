import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useCityOfMistCustomMoveStore } from '../../hooks'

export default function TriggerBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()

    return (
        <div className="city-move-section">
            <ClickableSection onClick={onClick} ariaLabel="Edit trigger">
                <div className="city-move-trigger">
                    {cityOfMistCustomMove.trigger ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(
                                    cityOfMistCustomMove.trigger
                                ),
                            }}
                        />
                    ) : (
                        <span className="city-move-placeholder">
                            add the trigger
                        </span>
                    )}
                </div>
                {cityOfMistCustomMove.frequency ? (
                    <div className="city-move-frequency">
                        {cityOfMistCustomMove.frequency}
                    </div>
                ) : null}
            </ClickableSection>
        </div>
    )
}
