import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import { useLegendInTheMistStoryThemeStore, type ThemeLevel } from '../../hooks'

const LEVELS: { value: ThemeLevel; label: string; hint: string }[] = [
    { value: 'origin', label: 'Origin', hint: 'Where the hero comes from' },
    { value: 'adventure', label: 'Adventure', hint: 'What the hero does now' },
    {
        value: 'greatness',
        label: 'Greatness',
        hint: 'What the hero may become',
    },
]

export default function BasicForm() {
    const { legendInTheMistStoryTheme, setTitleTag, setLevel, setCategory } =
        useLegendInTheMistStoryThemeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="story-theme-title">Title tag</Label>
                <Input
                    id="story-theme-title"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistStoryTheme.title_tag}
                    onChange={(event) => setTitleTag(event.target.value)}
                    placeholder="The Village I Left Behind"
                />
                <p className="text-xs text-muted-foreground">
                    The theme's own tag, written bare: the card adds the
                    highlight.
                </p>
            </div>

            <div className="grid gap-1">
                <Label>Level</Label>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    {LEVELS.map((level) => (
                        <Button
                            key={level.value}
                            type="button"
                            variant={
                                legendInTheMistStoryTheme.level === level.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                legendInTheMistStoryTheme.level === level.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            title={level.hint}
                            onClick={() => setLevel(level.value)}
                        >
                            {level.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="story-theme-category">
                    Category{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="story-theme-category"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistStoryTheme.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Kinship, Mission, Destiny..."
                />
            </div>
        </div>
    )
}
