import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLegendInTheMistJourneyStore } from '../../hooks'

/* Benefits is a single run of prose on the printed page, not a list, so it is
   edited as one field. */
export default function BenefitsForm() {
    const { legendInTheMistJourney, setBenefits } =
        useLegendInTheMistJourneyStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="journey-benefits">Benefits</Label>
                <Textarea
                    id="journey-benefits"
                    className="min-h-24 text-sm"
                    value={legendInTheMistJourney.benefits}
                    onChange={(event) => setBenefits(event.target.value)}
                    placeholder="What the heroes gain by making it through."
                />
                <p className="text-xs text-muted-foreground">
                    Printed as a sentence after a bold label, not as a list.
                    Markdown and braced tags are rendered on the spread.
                </p>
            </div>
        </div>
    )
}
