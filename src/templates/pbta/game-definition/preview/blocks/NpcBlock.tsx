import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'
import {
    AttributeDefinitionList,
    RecordDefinitionList,
} from '../components/DefinitionList'

export default function NpcBlock({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()
    const { npc } = gameDefinition

    if (!npc) {
        return (
            <ClickableSection onClick={onClick} ariaLabel="Edit NPC">
                <p className="pbta-placeholder">Click to add an NPC section.</p>
            </ClickableSection>
        )
    }

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit NPC">
            <div className="pbta-def-section">
                {npc.description ? <p>{npc.description}</p> : null}

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Attributes</span>
                    <AttributeDefinitionList attributes={npc.attributes} />
                </div>

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Move types</span>
                    <RecordDefinitionList record={npc.moveTypes} />
                </div>

                {npc.equipmentTypes ? (
                    <div className="pbta-def-field">
                        <span className="pbta-def-list-item__key">
                            Equipment types
                        </span>
                        <RecordDefinitionList record={npc.equipmentTypes} />
                    </div>
                ) : null}
            </div>
        </ClickableSection>
    )
}
