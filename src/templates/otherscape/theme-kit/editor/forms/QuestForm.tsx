import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeKitStore } from '../../hooks'

export default function QuestForm() {
    const text = useUiText()
    const { otherscapeThemeKit, setQuest } = useOtherscapeThemeKitStore()
    const themeType = otherscapeThemeKit.theme_type

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-quest">
                    {text(`otherscape:forms.themeKit.questLabel.${themeType}`)}
                </Label>
                <Textarea
                    id="os-theme-kit-quest"
                    className="min-h-24 text-sm"
                    value={otherscapeThemeKit.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder={text(
                        `otherscape:forms.themeKit.quest.placeholder.${themeType}`
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text(`otherscape:forms.themeKit.quest.hint.${themeType}`)}
                </p>
            </div>
        </div>
    )
}
