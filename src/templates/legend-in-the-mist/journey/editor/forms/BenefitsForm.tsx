import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useLegendInTheMistJourneyStore } from '../../hooks'

/* Benefits is a single run of prose on the printed page, not a list, so it is
   edited as one field. */
export default function BenefitsForm() {
    const text = useUiText()
    const { legendInTheMistJourney, setBenefits } =
        useLegendInTheMistJourneyStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="journey-benefits">
                    {text('legend:journey.sections.benefits')}
                </Label>
                <Textarea
                    id="journey-benefits"
                    className="min-h-24 text-sm"
                    value={legendInTheMistJourney.benefits}
                    onChange={(event) => setBenefits(event.target.value)}
                    placeholder={text(
                        'legend:forms.journey.benefits.placeholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.journey.benefits.hint')}
                </p>
            </div>
        </div>
    )
}
