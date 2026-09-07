import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLegendInTheMistThemeKitStore } from '../../hooks'

export default function BasicForm() {
    const { legendInTheMistThemeKit, setName, setCategory } =
        useLegendInTheMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-name">Kit name</Label>
                <Input
                    id="theme-kit-name"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistThemeKit.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="The Hedge Witch"
                />
                <p className="text-xs text-muted-foreground">
                    A printed label, not a tag: write it without braces.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-category">
                    Themebook{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="theme-kit-category"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistThemeKit.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Personality, Expertise, Training..."
                />
                <p className="text-xs text-muted-foreground">
                    Printed in the header bar. Left empty, the bar still shows.
                </p>
            </div>
        </div>
    )
}
