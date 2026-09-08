import { renderSystemMarkdownInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useCityOfMistCustomMoveStore, type RollStat } from '../../hooks'

const STAT_LABEL: Record<Exclude<RollStat, 'custom'>, string> = {
    power: 'Power',
    mythos: 'Mythos',
    logos: 'Logos',
}

/* Renders nothing at all when the move calls for no roll: an empty roll line
   would read as a roll of zero rather than as a move that never rolls. */
export default function RollBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()
    const roll = cityOfMistCustomMove.roll
    if (!roll) return null

    const stat =
        roll.stat === 'custom'
            ? roll.label || 'a custom stat'
            : (roll.label ?? STAT_LABEL[roll.stat])
    const modifier = roll.modifier ?? 0

    return (
        <div className="city-move-section">
            <ClickableSection onClick={onClick} ariaLabel="Edit roll">
                <div className="city-move-roll">
                    <span className="city-move-roll__label">Roll</span>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: renderSystemMarkdownInline(`+ ${stat}`),
                        }}
                    />
                    {modifier !== 0 ? (
                        <span className="city-move-roll__modifier">
                            {modifier > 0 ? `+${modifier}` : modifier}
                        </span>
                    ) : null}
                </div>
            </ClickableSection>
        </div>
    )
}
