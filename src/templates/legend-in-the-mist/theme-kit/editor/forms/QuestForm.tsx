import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLegendInTheMistThemeKitStore } from '../../hooks'

export default function QuestForm() {
    const { legendInTheMistThemeKit, setQuest } =
        useLegendInTheMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-quest">Quest</Label>
                <Textarea
                    id="theme-kit-quest"
                    className="min-h-24 text-sm"
                    value={legendInTheMistThemeKit.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder="Heal someone the village has already given up on."
                />
                <p className="text-xs text-muted-foreground">
                    The quest the kit suggests. A hero makes it their own when
                    they fill the kit in. Markdown and braced tags are rendered
                    on the card.
                </p>
            </div>
        </div>
    )
}
