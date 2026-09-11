import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'
import {
    AttributeDefinitionList,
    RecordDefinitionList,
} from '../components/DefinitionList'

export default function CharacterBlock({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()
    const { character } = gameDefinition
    const statToggleLabel =
        typeof character.statToggle === 'string'
            ? character.statToggle
            : character.statToggle
              ? `${character.statToggle.label} (${character.statToggle.modifier >= 0 ? '+' : ''}${character.statToggle.modifier})`
              : null

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit character">
            <div className="pbta-def-section">
                {character.description ? <p>{character.description}</p> : null}

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Stats</span>
                    <RecordDefinitionList record={character.stats} />
                </div>

                {statToggleLabel ? (
                    <div className="pbta-def-field">
                        <span className="pbta-def-list-item__key">
                            Stat toggle
                        </span>
                        <span>{statToggleLabel}</span>
                    </div>
                ) : null}

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Attributes</span>
                    <AttributeDefinitionList
                        attributes={character.attributes}
                    />
                </div>

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Move types</span>
                    <RecordDefinitionList record={character.moveTypes} />
                </div>

                {Object.keys(character.equipmentTypes).length > 0 ? (
                    <div className="pbta-def-field">
                        <span className="pbta-def-list-item__key">
                            Equipment types
                        </span>
                        <RecordDefinitionList
                            record={character.equipmentTypes}
                        />
                    </div>
                ) : null}
            </div>
        </ClickableSection>
    )
}
