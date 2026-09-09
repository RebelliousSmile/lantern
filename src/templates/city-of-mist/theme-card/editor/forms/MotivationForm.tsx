import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCityOfMistThemeCardStore } from '../../hooks'

const LABEL = {
    mythos: 'Mystery',
    logos: 'Identity',
    extra: 'Motivation',
    crew: 'Motivation',
} as const

export default function MotivationForm() {
    const { cityOfMistThemeCard, setCityOfMistThemeCard } =
        useCityOfMistThemeCardStore()
    const label = LABEL[cityOfMistThemeCard.theme_type]

    function setText(text: string) {
        const trimmed = text.trim()
        const kind =
            cityOfMistThemeCard.theme_type === 'mythos'
                ? 'mystery'
                : cityOfMistThemeCard.theme_type === 'logos'
                  ? 'identity'
                  : 'neutral'
        setCityOfMistThemeCard({
            motivation: trimmed ? { kind, text } : undefined,
        })
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="theme-card-motivation">{label}</Label>
            <Textarea
                id="theme-card-motivation"
                className="min-h-24 text-sm"
                value={cityOfMistThemeCard.motivation?.text ?? ''}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                    cityOfMistThemeCard.theme_type === 'mythos'
                        ? 'Who keeps answering when I ask?'
                        : 'I am the one who stays.'
                }
            />
            <p className="text-xs text-muted-foreground">
                Supports inline Markdown.
            </p>
        </div>
    )
}
