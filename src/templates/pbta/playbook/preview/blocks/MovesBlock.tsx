import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'
import { SimpleList } from '../components/DefinitionList'

export default function MovesBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()
    const { moves, startingMoves } = playbook

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit moves">
            <div className="pbta-pb-section">
                <div className="pbta-pb-field">
                    <span className="pbta-pb-list-item__key">Moves</span>
                    {moves.length === 0 ? (
                        <p className="pbta-pb-empty-row">No moves defined.</p>
                    ) : (
                        <ul className="pbta-pb-list">
                            {moves.map((move, index) => (
                                <li key={index} className="pbta-pb-list-item">
                                    <span className="pbta-pb-list-item__key">
                                        {move.kind === 'ref'
                                            ? move.ref
                                            : move.name || 'Untitled move'}
                                    </span>
                                    {move.kind === 'inline' && move.moveType ? (
                                        <span>{move.moveType}</span>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="pbta-pb-field">
                    <span className="pbta-pb-list-item__key">
                        Starting moves
                    </span>
                    <SimpleList
                        items={startingMoves}
                        emptyLabel="No starting moves selected."
                    />
                </div>
            </div>
        </ClickableSection>
    )
}
