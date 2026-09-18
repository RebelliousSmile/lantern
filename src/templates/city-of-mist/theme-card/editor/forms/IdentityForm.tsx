import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import { useCityOfMistThemeCardStore, type ThemeType } from '../../hooks'

const TYPES: { value: ThemeType; label: string }[] = [
    { value: 'mythos', label: 'Mythos' },
    { value: 'logos', label: 'Logos' },
    { value: 'extra', label: 'Extra' },
    { value: 'crew', label: 'Crew' },
]

export default function IdentityForm() {
    const { cityOfMistThemeCard, setCityOfMistThemeCard, setThemeType } =
        useCityOfMistThemeCardStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-card-themebook">Themebook</Label>
                <Input
                    id="theme-card-themebook"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeCard.themebook}
                    onChange={(event) =>
                        setCityOfMistThemeCard({
                            themebook: event.target.value,
                        })
                    }
                    placeholder="Divination"
                />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-card-title">Card title</Label>
                <Input
                    id="theme-card-title"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeCard.title}
                    onChange={(event) =>
                        setCityOfMistThemeCard({ title: event.target.value })
                    }
                    placeholder="The Reading I Cannot Stop"
                />
            </div>
            <div className="grid gap-1">
                <Label>Theme type</Label>
                <SegmentedRadioGroup
                    id="theme-card-type"
                    value={cityOfMistThemeCard.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={TYPES}
                    ariaLabel="Theme type"
                />
                <p className="text-xs text-muted-foreground">
                    Changing type updates the motivation and erosion labels
                    without resetting their text or progress.
                </p>
            </div>
        </div>
    )
}
