import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'

export default function PbHeader({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit basic info">
            <div className="pbta-pb-header">
                <h1 className="pbta-pb-title pbta-display">
                    {playbook.name.trim() || (
                        <span className="pbta-placeholder">
                            Untitled playbook
                        </span>
                    )}
                </h1>
                <div className="pbta-pb-header-meta">
                    <span className="pbta-pb-badge pbta-label">
                        {playbook.game}
                    </span>
                    {playbook.actorType ? (
                        <span className="pbta-pb-badge pbta-label">
                            {playbook.actorType}
                        </span>
                    ) : null}
                </div>
                {playbook.description ? (
                    <p className="pbta-pb-description">
                        {playbook.description}
                    </p>
                ) : null}
            </div>
        </ClickableSection>
    )
}
