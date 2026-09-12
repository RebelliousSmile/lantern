import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'
import { RecordDefinitionList } from '../components/DefinitionList'

export default function McBlock({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()
    const { mc } = gameDefinition

    if (!mc) {
        return (
            <ClickableSection onClick={onClick} ariaLabel="Edit MC section">
                <p className="pbta-placeholder">Click to add an MC section.</p>
            </ClickableSection>
        )
    }

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit MC section">
            <div className="pbta-def-section">
                {mc.description ? <p>{mc.description}</p> : null}

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Move types</span>
                    <RecordDefinitionList record={mc.moveTypes} />
                </div>
            </div>
        </ClickableSection>
    )
}
