import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { useLegendInTheMistJourneyStore, type JourneyType } from '../../hooks'
import { journeyTypeOptions } from '../../metadata'

/* Name, type and description are edited together because the band prints them
   together, with no heading between them. The type is the only field that
   changes the sheet's colour, so it sits between the two. */
export default function BasicForm() {
    const text = useUiText()
    const { legendInTheMistJourney, setName, setType, setDescription } =
        useLegendInTheMistJourneyStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="journey-name">{text('fields.name')}</Label>
                <Input
                    id="journey-name"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistJourney.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={text(
                        'legend:forms.journey.basic.namePlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.journey.basic.nameHint')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label>{text('legend:forms.journey.basic.typeLabel')}</Label>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    {journeyTypeOptions.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant={
                                legendInTheMistJourney.type === option.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                legendInTheMistJourney.type === option.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() => setType(option.value as JourneyType)}
                        >
                            {text(option.label)}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.journey.basic.typeHint')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="journey-description">
                    {text('fields.description')}
                </Label>
                <Textarea
                    id="journey-description"
                    className="min-h-24 text-sm"
                    value={legendInTheMistJourney.description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={text(
                        'legend:forms.journey.basic.descriptionPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.journey.basic.descriptionHint')}
                </p>
            </div>
        </div>
    )
}
