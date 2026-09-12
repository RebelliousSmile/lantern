import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useGameDefinitionStore } from '../../hooks'

export default function RollBlock({ onClick }: { onClick: () => void }) {
    const { gameDefinition } = useGameDefinitionStore()
    const { rollFormula, minMod, maxMod, rollResults } = gameDefinition
    const results = Object.entries(rollResults)

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit roll">
            <div className="pbta-def-section">
                <div className="pbta-def-row">
                    <div className="pbta-def-field">
                        <span className="pbta-def-list-item__key">Formula</span>
                        <span>{rollFormula}</span>
                    </div>
                    {minMod != null || maxMod != null ? (
                        <div className="pbta-def-field">
                            <span className="pbta-def-list-item__key">
                                Modifier range
                            </span>
                            <span>
                                {minMod ?? '—'} to {maxMod ?? '—'}
                            </span>
                        </div>
                    ) : null}
                </div>
                {results.length === 0 ? (
                    <p className="pbta-def-empty-row">
                        No roll results defined.
                    </p>
                ) : (
                    <ul className="pbta-def-list">
                        {results.map(([key, result]) => (
                            <li key={key} className="pbta-def-list-item">
                                <span className="pbta-def-list-item__key">
                                    {result.range}
                                </span>
                                <span>{result.label}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ClickableSection>
    )
}
