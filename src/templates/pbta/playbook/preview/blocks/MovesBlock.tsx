import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'
import { SimpleList } from '../components/DefinitionList'

export default function MovesBlock({
    onMoveClick,
}: {
    onMoveClick: (index: number) => void
}) {
    const { playbook } = usePlaybookStore()
    const { moves, startingMoves } = playbook

    return (
        <div className="pbta-pb-section">
            <div className="pbta-pb-field">
                <span className="pbta-pb-list-item__key">Moves</span>
                {moves.length === 0 ? (
                    <p className="pbta-pb-empty-row">No moves defined.</p>
                ) : (
                    <ul className="pbta-pb-list">
                        {moves.map((move, index) => (
                            <ClickableInline
                                key={index}
                                onClick={() => onMoveClick(index)}
                                ariaLabel={`Edit ${move.kind === 'ref' ? move.ref : move.name || 'move'}`}
                                className="pbta-pb-list-item"
                            >
                                <span className="pbta-pb-list-item__key">
                                    {move.checked ? '☑ ' : '☐ '}
                                    {move.kind === 'ref'
                                        ? move.ref
                                        : move.name || 'Untitled move'}
                                </span>
                                {move.kind === 'inline' && move.moveType ? (
                                    <span>{move.moveType}</span>
                                ) : null}
                            </ClickableInline>
                        ))}
                    </ul>
                )}
            </div>

            <div className="pbta-pb-field">
                <span className="pbta-pb-list-item__key">Starting moves</span>
                <SimpleList
                    items={startingMoves}
                    emptyLabel="No starting moves selected."
                />
            </div>
        </div>
    )
}
