import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
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
                <SegmentedRadioGroup
                    id="theme-kit-type"
                    value={cityOfMistThemeKit.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={TYPES}
                    ariaLabel="Theme type"
                />
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
