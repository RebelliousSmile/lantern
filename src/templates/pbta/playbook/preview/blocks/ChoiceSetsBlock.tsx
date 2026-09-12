import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'

export default function ChoiceSetsBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()
    const { choiceSets } = playbook

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit choice sets">
            <div className="pbta-pb-section">
                {choiceSets.length === 0 ? (
                    <p className="pbta-pb-empty-row">No choice sets defined.</p>
                ) : (
                    choiceSets.map((choiceSet, index) => (
                        <div key={index} className="pbta-pb-field">
                            <span className="pbta-pb-list-item__key">
                                {choiceSet.title || 'Untitled choice set'} (
                                {choiceSet.type})
                            </span>
                            <ul className="pbta-pb-list">
                                {choiceSet.choices.map(
                                    (choice, choiceIndex) => (
                                        <li
                                            key={choiceIndex}
                                            className="pbta-pb-list-item"
                                        >
                                            <span>
                                                {choice.kind === 'ref'
                                                    ? choice.ref
                                                    : choice.name ||
                                                      'Untitled move'}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </ClickableSection>
    )
}
