import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
} from '../../hooks'
import { journeyTypeLabel } from '../../metadata'
import { ClickableSection } from '../components/Clickable'

/* The book gives the top half of the spread to a full-bleed illustration, with
   the type, the name and the description laid over it. There is no image field
   in the schema and inventing one is a change to the schema repository, not to
   this card, so the band is a solid panel in the type's own tint. Nothing here
   carries a heading: the order is the hierarchy. */
export default function HeaderBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    return (
        <ClickableSection
            onClick={openBasic}
            ariaLabel="Edit the journey name and type"
        >
            <div className="journey-band__head">
                <div className="journey-band__type">
                    {journeyTypeLabel[legendInTheMistJourney.type]}
                </div>
                <h1 className="journey-band__name">
                    {legendInTheMistJourney.name.trim() || (
                        <span className="journey-band__placeholder">
                            name this journey
                        </span>
                    )}
                </h1>
            </div>
        </ClickableSection>
    )
}
