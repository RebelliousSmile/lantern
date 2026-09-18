import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'

export default function AdvancementBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit advancement">
            <div className="pbta-pb-section">
                {playbook.advancement.length ? (
                    <ul className="pbta-pb-list">
                        {playbook.advancement.map((entry, index) => (
                            <li key={index} className="pbta-pb-list-item">
                                {entry.checked ? '☑' : '☐'} {entry.label}
                            </li>
                        ))}
                    </ul>
                ) : <p className="pbta-pb-empty-row">No advancement options defined.</p>}
            </div>
        </ClickableSection>
    )
}
