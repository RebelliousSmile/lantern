import { renderLitmMarkdown } from '@/utils/markdown'
import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
} from '../../hooks'
import { ClickableInline } from '../components/Clickable'
import { SectionHeader } from '../components/SectionHeader'

/* The Journey's own list: what it can cost anywhere along it, as opposed to
   the list a vignette carries. The heading only appears once there is a list
   under it. */
export default function ConsequencesBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const consequences = legendInTheMistJourney.consequences

    if (!consequences.length) {
        return (
            <p className="journey-consequences__empty">
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'consequences', mode: 'create' })
                    }
                >
                    add what this journey costs along the way
                </button>
            </p>
        )
    }

    return (
        <div className="journey-consequences">
            <SectionHeader
                title="General consequences"
                onClick={() => openSheet({ kind: 'consequences' })}
            />
            <div className="journey-conseq-list">
                {consequences.map((consequence, index) => (
                    <div key={`conseq-${index}`} className="journey-conseq-row">
                        <div>
                            <span className="ico ico-conseq" aria-hidden />
                        </div>
                        <ClickableInline
                            onClick={() =>
                                openSheet({
                                    kind: 'consequences',
                                    index,
                                    mode: 'edit',
                                })
                            }
                            ariaLabel={`Edit consequence ${index + 1}`}
                        >
                            <span
                                className="journey-conseq-text"
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(consequence),
                                }}
                            />
                        </ClickableInline>
                    </div>
                ))}
            </div>
        </div>
    )
}
