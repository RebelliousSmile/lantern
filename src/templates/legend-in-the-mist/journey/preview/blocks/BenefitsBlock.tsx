import { renderLitmInline } from '@/utils/markdown'
import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'

/* Same device as the tags run: a bold label opening a sentence, not a heading
   over a block. An empty benefit prints the affordance alone, so nothing
   labelled sits above an empty line. */
export default function BenefitsBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const openBenefits = () => openSheet({ kind: 'benefits', mode: 'edit' })
    const benefits = legendInTheMistJourney.benefits.trim()

    if (!benefits) {
        return (
            <p className="journey-benefits">
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={openBenefits}
                >
                    add what seeing this journey through is worth
                </button>
            </p>
        )
    }

    return (
        <ClickableSection
            onClick={openBenefits}
            ariaLabel="Edit the journey benefits"
        >
            <p className="journey-benefits">
                <span className="journey-benefits__label">Benefits:</span>{' '}
                <span
                    dangerouslySetInnerHTML={{
                        __html: renderLitmInline(benefits),
                    }}
                />
            </p>
        </ClickableSection>
    )
}
