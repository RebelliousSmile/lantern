import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { TranslationKey } from '@/i18n/text'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeStore, type ThemeType } from '../../hooks'

const QUEST_LABEL_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.questLabel.self',
    mythos: 'otherscape:forms.theme.questLabel.mythos',
    noise: 'otherscape:forms.theme.questLabel.noise',
    crew: 'otherscape:forms.theme.questLabel.crew',
}

const QUEST_PLACEHOLDER_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.quest.placeholder.self',
    mythos: 'otherscape:forms.theme.quest.placeholder.mythos',
    noise: 'otherscape:forms.theme.quest.placeholder.noise',
    crew: 'otherscape:forms.theme.quest.placeholder.crew',
}

const QUEST_HELP_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.quest.help.self',
    mythos: 'otherscape:forms.theme.quest.help.mythos',
    noise: 'otherscape:forms.theme.quest.help.noise',
    crew: 'otherscape:forms.theme.quest.help.crew',
}

export default function QuestForm() {
    const { otherscapeTheme, setQuest } = useOtherscapeThemeStore()
    const themeType = otherscapeTheme.theme_type
    const text = useUiText()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-quest">
                    {text(QUEST_LABEL_KEY[themeType])}
                </Label>
                <Textarea
                    id="os-theme-quest"
                    className="min-h-24 text-sm"
                    value={otherscapeTheme.quest}
                    onChange={(event) => setQuest(event.target.value)}
                    placeholder={text(QUEST_PLACEHOLDER_KEY[themeType])}
                />
                <p className="text-xs text-muted-foreground">
                    {text(QUEST_HELP_KEY[themeType])}
                </p>
            </div>
        </div>
    )
}
