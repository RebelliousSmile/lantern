import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { useLegendInTheMistJourneyStore, type JourneyType } from '../../hooks'
import { journeyTypeOptions } from '../../metadata'

/* Name, type and description are edited together because the band prints them
   together, with no heading between them. The type is the only field that
   changes the sheet's colour, so it sits between the two. */
export default function BasicForm() {
    const { legendInTheMistJourney, setName, setType, setDescription } =
        useLegendInTheMistJourneyStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="journey-name">Name</Label>
                <Input
                    id="journey-name"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistJourney.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="The Long Road to Blackmere"
                />
                <p className="text-xs text-muted-foreground">
                    What the Narrator calls this journey at the table.
                </p>
            </div>

            <div className="grid gap-1">
                <Label>Type</Label>
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
                            {option.label}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    A Landscape is a place crossed, an Occasion an event lived
                    through, an Undertaking a task carried out. The band takes
                    its colour from this.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="journey-description">Description</Label>
                <Textarea
                    id="journey-description"
                    className="min-h-24 text-sm"
                    value={legendInTheMistJourney.description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Read this out when the heroes set off."
                />
                <p className="text-xs text-muted-foreground">
                    Markdown and braced tags are rendered on the spread.
                </p>
            </div>
        </div>
    )
}
