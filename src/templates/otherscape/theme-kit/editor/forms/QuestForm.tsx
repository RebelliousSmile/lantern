import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOtherscapeThemeKitStore } from '../../hooks'
import { QUEST_LABEL, THEME_TYPE_LABEL } from '../../model'

const PLACEHOLDER: Record<string, string> = {
    self: 'Keep the clinic open, whatever the district asks in return.',
    mythos: 'Finish the rite the old city started and never closed.',
    noise: 'Get the signal out before the tower notices it is gone.',
    crew: 'Own the block outright, one favour at a time.',
}

export default function QuestForm() {
    const { otherscapeThemeKit, setQuest } = useOtherscapeThemeKitStore()
    const themeType = otherscapeThemeKit.theme_type

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-quest">
                    {QUEST_LABEL[themeType]}
                </Label>
                <Textarea
                    id="os-theme-kit-quest"
                    className="min-h-24 text-sm"
                    value={otherscapeThemeKit.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder={PLACEHOLDER[themeType]}
                />
                <p className="text-xs text-muted-foreground">
                    What a {THEME_TYPE_LABEL[themeType]} theme is chasing. The
                    card prints it under that name. Markdown and braced tags are
                    rendered.
                </p>
            </div>
        </div>
    )
}
