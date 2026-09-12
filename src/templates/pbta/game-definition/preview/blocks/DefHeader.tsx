import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'

export default function DefHeader({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit basic info">
            <div className="pbta-def-header">
                <h1 className="pbta-def-title pbta-display">
                    {gameDefinition.name.trim() || (
                        <span className="pbta-placeholder">Untitled game</span>
                    )}
                </h1>
                <div className="pbta-def-header-meta">
                    <span className="pbta-def-badge pbta-label">
                        {gameDefinition.game}
                    </span>
                    <span className="pbta-def-badge pbta-label">
                        v{gameDefinition.version}
                    </span>
                    {gameDefinition.source ? (
                        <span className="pbta-def-badge pbta-label">
                            {gameDefinition.source}
                        </span>
                    ) : null}
                </div>
            </div>
        </ClickableSection>
    )
}
