import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'
import { RecordDefinitionList } from '../components/DefinitionList'

export default function FrontsBlock({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()
    const { fronts } = gameDefinition

    if (!fronts) {
        return (
            <ClickableSection onClick={onClick} ariaLabel="Edit fronts">
                <p className="pbta-placeholder">
                    Click to add a fronts section.
                </p>
            </ClickableSection>
        )
    }

    const clockPresets = fronts.clockPresets ?? []

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit fronts">
            <div className="pbta-def-section">
                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">
                        Threat types
                    </span>
                    <RecordDefinitionList record={fronts.threatTypes} />
                </div>

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">Impulses</span>
                    <RecordDefinitionList record={fronts.impulses} />
                </div>

                <div className="pbta-def-field">
                    <span className="pbta-def-list-item__key">
                        Clock presets
                    </span>
                    {clockPresets.length === 0 ? (
                        <p className="pbta-def-empty-row">
                            No clock presets defined.
                        </p>
                    ) : (
                        <ul className="pbta-def-list">
                            {clockPresets.map((preset) => (
                                <li
                                    key={preset.key}
                                    className="pbta-def-list-item"
                                >
                                    <span className="pbta-def-list-item__key">
                                        {preset.label}
                                    </span>
                                    <span>
                                        {preset.segments.length} segments
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </ClickableSection>
    )
}
