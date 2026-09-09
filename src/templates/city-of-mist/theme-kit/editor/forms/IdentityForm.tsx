import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import { useCityOfMistThemeKitStore, type ThemeType } from '../../hooks'
import StringListInput from './StringListInput'

const TYPES: { value: ThemeType; label: string }[] = [
    { value: 'mythos', label: 'Mythos' },
    { value: 'logos', label: 'Logos' },
    { value: 'extra', label: 'Extra' },
    { value: 'crew', label: 'Crew' },
]

export default function IdentityForm() {
    const {
        cityOfMistThemeKit,
        setCityOfMistThemeKit,
        setThemeType,
        setKeywords,
    } = useCityOfMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-name">Themebook name</Label>
                <Input
                    id="theme-kit-name"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeKit.name}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            name: event.target.value || 'Untitled Themebook',
                        })
                    }
                    placeholder="Personality"
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
                                cityOfMistThemeKit.theme_type === type.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-1 text-xs',
                                cityOfMistThemeKit.theme_type === type.value
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
                    The type decides the banner and how the motivation zone is
                    named. Switching it renames the zone without touching what
                    you wrote in it.
                </p>
            </div>
            <div className="grid gap-1">
                <Label>Keywords</Label>
                <StringListInput
                    value={cityOfMistThemeKit.keywords}
                    onChange={setKeywords}
                    placeholder="Add keyword..."
                />
            </div>
        </div>
    )
}
