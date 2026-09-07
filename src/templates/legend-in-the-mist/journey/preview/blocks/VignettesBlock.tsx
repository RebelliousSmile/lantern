import { renderLitmInline, renderLitmMarkdown } from '@/utils/markdown'
import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
    type JourneyVignette,
} from '../../hooks'
import { ClickableInline, ClickableSection } from '../components/Clickable'

/* The book sets a consequence that opens a new Challenge in bold up to the
   colon, so the Narrator can find it while reading aloud. It is written into
   the text rather than held in a field, so the emphasis is applied here. */
const NEW_CHALLENGE = /^(\s*new challenge\s*:)/i

function renderConsequence(consequence: string) {
    const match = consequence.match(NEW_CHALLENGE)
    if (!match) return renderLitmMarkdown(consequence)

    const rest = consequence.slice(match[0].length)
    return `<strong>${match[0].trim()}</strong>${renderLitmMarkdown(rest)}`
}

function VignetteCard({
    vignette,
    index,
}: {
    vignette: JourneyVignette
    index: number
}) {
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    return (
        <ClickableSection
            onClick={() =>
                openSheet({ kind: 'vignettes', index, mode: 'edit' })
            }
            ariaLabel={`Edit vignette ${vignette.name || index + 1}`}
        >
            <article className="journey-vignette" data-vignette-index={index}>
                <h3 className="journey-vignette__name">
                    {vignette.name.trim() || 'Untitled vignette'}
                </h3>

                {vignette.trigger.trim() && (
                    <p
                        className="journey-vignette__trigger"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmInline(vignette.trigger),
                        }}
                    />
                )}

                {vignette.consequences.length > 0 && (
                    <div className="journey-conseq-list">
                        {vignette.consequences.map((consequence, ci) => (
                            <div
                                key={`vignette-${index}-conseq-${ci}`}
                                className="journey-conseq-row"
                            >
                                <div>
                                    <span
                                        className="ico ico-conseq"
                                        aria-hidden
                                    />
                                </div>
                                <span
                                    className="journey-conseq-text"
                                    dangerouslySetInnerHTML={{
                                        __html: renderConsequence(consequence),
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </ClickableSection>
    )
}

export default function VignettesBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const vignettes = legendInTheMistJourney.vignettes

    /* No heading over the grid: each vignette carries its own name, and an
       empty grid must not leave a label behind. */
    if (!vignettes.length) {
        return (
            <p className="journey-vignettes__empty">
                <ClickableInline
                    onClick={() =>
                        openSheet({ kind: 'vignettes', mode: 'create' })
                    }
                    ariaLabel="Add a vignette"
                >
                    <span className="text-xs underline decoration-dotted opacity-80">
                        add the moments this journey breaks down into
                    </span>
                </ClickableInline>
            </p>
        )
    }

    return (
        <div className="journey-vignettes">
            {vignettes.map((vignette, index) => (
                <VignetteCard
                    key={`vignette-${index}-${vignette.name}`}
                    vignette={vignette}
                    index={index}
                />
            ))}
        </div>
    )
}
