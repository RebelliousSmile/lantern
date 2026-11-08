import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useCityOfMistThemeCardStore, type ThemeType } from '../../hooks'

const LABEL: Record<ThemeType, TranslationKey> = {
    mythos: 'city:forms.shared.zone.mystery',
    logos: 'city:forms.shared.zone.identity',
    extra: 'city:forms.shared.zone.motivation',
    crew: 'city:forms.shared.zone.motivation',
}

export default function MotivationForm() {
    const text = useUiText()
    const { cityOfMistThemeCard, setCityOfMistThemeCard } =
        useCityOfMistThemeCardStore()
    const label = LABEL[cityOfMistThemeCard.theme_type]

    function setText(value: string) {
        const trimmed = value.trim()
        const kind =
            cityOfMistThemeCard.theme_type === 'mythos'
                ? 'mystery'
                : cityOfMistThemeCard.theme_type === 'logos'
                  ? 'identity'
                  : 'neutral'
        setCityOfMistThemeCard({
            motivation: trimmed ? { kind, text: value } : undefined,
        })
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="theme-card-motivation">{text(label)}</Label>
            <Textarea
                id="theme-card-motivation"
                className="min-h-24 text-sm"
                value={cityOfMistThemeCard.motivation?.text ?? ''}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                    cityOfMistThemeCard.theme_type === 'mythos'
                        ? text(
                              'city:forms.themeCard.motivation.placeholderMythos'
                          )
                        : text(
                              'city:forms.themeCard.motivation.placeholderOther'
                          )
                }
            />
            <p className="text-xs text-muted-foreground">
                {text('city:forms.shared.help.inlineMarkdown')}
            </p>
        </div>
    )
}
