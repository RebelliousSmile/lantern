import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'

export default function CreationBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()
    const { creation } = playbook

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit creation">
            <div className="pbta-pb-section">
                {creation.length === 0 ? (
                    <p className="pbta-pb-empty-row">
                        No creation entries defined.
                    </p>
                ) : (
                    creation.map((entry, index) => (
                        <div key={index} className="pbta-pb-field">
                            <span className="pbta-pb-list-item__key">
                                {entry.label}
                            </span>
                            <span>{entry.options.join(', ') || '—'}</span>
                        </div>
                    ))
                )}
            </div>
        </ClickableSection>
    )
}
