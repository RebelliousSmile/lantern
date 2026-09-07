import { renderLitmMarkdown } from '@/utils/markdown'
import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'

/* Inside the band, under the name, in the same cream: the description is read
   before anything else on the spread and carries no heading of its own. */
export default function DescriptionBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    return (
        <ClickableSection
            onClick={openBasic}
            ariaLabel="Edit the journey description"
        >
            <div className="journey-band__description">
                {legendInTheMistJourney.description.trim() ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(
                                legendInTheMistJourney.description
                            ),
                        }}
                    />
                ) : (
                    <span className="journey-band__placeholder">
                        describe what crossing this journey feels like
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
