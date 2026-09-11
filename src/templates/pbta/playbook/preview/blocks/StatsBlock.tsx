import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'
import {
    formatAttributeValue,
    KeyValueList,
} from '../components/DefinitionList'

export default function StatsBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()
    const { stats, statsDetail, attributes } = playbook

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit stats">
            <div className="pbta-pb-section">
                <div className="pbta-pb-field">
                    <span className="pbta-pb-list-item__key">Stats</span>
                    <KeyValueList
                        entries={Object.entries(stats).map(([key, value]) => [
                            key,
                            String(value),
                        ])}
                        emptyLabel="No stats defined."
                    />
                </div>

                {statsDetail ? <p>{statsDetail}</p> : null}

                <div className="pbta-pb-field">
                    <span className="pbta-pb-list-item__key">Attributes</span>
                    <KeyValueList
                        entries={Object.entries(attributes).map(
                            ([key, value]) => [key, formatAttributeValue(value)]
                        )}
                        emptyLabel="No attributes defined."
                    />
                </div>
            </div>
        </ClickableSection>
    )
}
