import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import type { CrewOutcome, CrewRelationship } from '../../schema'

/* What the scenario does to the crew, printed as the books print it: the
   sentence the themebook starts is finished by the outcome, so the two read as
   one line rather than as a row and a label. */
const OUTCOME: Record<CrewOutcome, string> = {
    help: 'we help each other.',
    hurt: 'we hurt each other.',
    either: 'we help or hurt each other.',
}

type Props = {
    relationships: CrewRelationship[]
    onAddClick: () => void
    onItemClick: (index: number) => void
}

export default function CrewRelationshipsBlock({
    relationships,
    onAddClick,
    onItemClick,
}: Props) {
    return (
        <section className="city-kit-section city-kit-crew">
            <SectionHeader title="Crew Relationships" onClick={onAddClick} />
            {relationships.length ? (
                <ul className="city-kit-crew-list">
                    {relationships.map((relationship, index) => (
                        <li key={`${index}-${relationship.scenario}`}>
                            <ClickableInline
                                onClick={() => onItemClick(index)}
                                ariaLabel={`Edit crew relationship ${relationship.scenario}`}
                                className="city-kit-crew-row"
                            >
                                <span
                                    className="city-kit-crew-row__scenario"
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(
                                            relationship.scenario
                                        ),
                                    }}
                                />{' '}
                                <span className="city-kit-crew-row__outcome">
                                    {OUTCOME[relationship.outcome]}
                                </span>
                            </ClickableInline>
                        </li>
                    ))}
                </ul>
            ) : (
                <button
                    type="button"
                    className="city-kit-add"
                    onClick={onAddClick}
                >
                    add a crew relationship
                </button>
            )}
        </section>
    )
}
