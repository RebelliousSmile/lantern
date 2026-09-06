import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useLegendInTheMistStoryThemeStore } from '../../hooks'

function TrackInput({
    id,
    label,
    value,
    onChange,
}: {
    id: string
    label: string
    value: number
    onChange: (next: number) => void
}) {
    return (
        <div className="grid gap-1">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                className="h-8 px-2 text-sm"
                type="number"
                min={0}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </div>
    )
}

export default function QuestForm() {
    const {
        legendInTheMistStoryTheme,
        setQuest,
        setImprove,
        setAbandon,
        setMilestone,
    } = useLegendInTheMistStoryThemeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="story-theme-quest">Quest</Label>
                <Textarea
                    id="story-theme-quest"
                    className="min-h-24 text-sm"
                    value={legendInTheMistStoryTheme.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder="Return home with something worth showing."
                />
                <p className="text-xs text-muted-foreground">
                    What the theme pushes the hero towards. Markdown and braced
                    tags are rendered on the card.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <TrackInput
                    id="story-theme-improve"
                    label="Improve"
                    value={legendInTheMistStoryTheme.improve}
                    onChange={setImprove}
                />
                <TrackInput
                    id="story-theme-abandon"
                    label="Abandon"
                    value={legendInTheMistStoryTheme.abandon}
                    onChange={setAbandon}
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="grid gap-0.5">
                    <Label htmlFor="story-theme-milestone" className="text-xs">
                        Milestone
                    </Label>
                    <span className="text-xs text-muted-foreground">
                        Marked once the theme has reached its turning point.
                    </span>
                </div>
                <Switch
                    id="story-theme-milestone"
                    checked={legendInTheMistStoryTheme.milestone}
                    onCheckedChange={(value) => setMilestone(!!value)}
                />
            </div>
        </div>
    )
}
