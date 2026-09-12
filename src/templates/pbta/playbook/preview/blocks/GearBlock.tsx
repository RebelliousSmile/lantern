import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'

export default function GearBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()
    const { gear } = playbook

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit gear">
            <div className="pbta-pb-section">
                {gear.length === 0 ? (
                    <p className="pbta-pb-empty-row">No gear defined.</p>
                ) : (
                    <ul className="pbta-pb-list">
                        {gear.map((entry, index) => (
                            <li key={index} className="pbta-pb-list-item">
                                <span className="pbta-pb-list-item__key">
                                    {entry.name}
                                </span>
                                <span>
                                    {[
                                        entry.equipmentType,
                                        entry.quantity != null
                                            ? `x${entry.quantity}`
                                            : null,
                                    ]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ClickableSection>
    )
}
