import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
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
                <div className="grid grid-cols-4 overflow-hidden rounded-md border">
                    {TYPES.map((type) => (
                        <Button
                            key={type.value}
                            type="button"
                            variant={
                                cityOfMistThemeCard.theme_type === type.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-1 text-xs',
                                cityOfMistThemeCard.theme_type === type.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() => setThemeType(type.value)}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    Changing type updates the motivation and erosion labels
                    without resetting their text or progress.
                </p>
            </div>
        </div>
    )
}
