import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useLegendInTheMistThemeKitStore } from '../../hooks'

export default function QuestForm() {
    const text = useUiText()
    const { legendInTheMistThemeKit, setQuest } =
        useLegendInTheMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-quest">
                    {text('legend:forms.themeKit.quest.label')}
                </Label>
                <Textarea
                    id="theme-kit-quest"
                    className="min-h-24 text-sm"
                    value={legendInTheMistThemeKit.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder={text(
                        'legend:forms.themeKit.quest.placeholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.themeKit.quest.hint')}
                </p>
            </div>
        </div>
    )
}
