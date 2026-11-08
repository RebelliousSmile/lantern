import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useCityOfMistThemeCardStore, type ThemeType } from '../../hooks'

const TYPES: { value: ThemeType; label: TranslationKey }[] = [
    { value: 'mythos', label: 'city:forms.shared.themeType.mythos' },
    { value: 'logos', label: 'city:forms.shared.themeType.logos' },
    { value: 'extra', label: 'city:forms.shared.themeType.extra' },
    { value: 'crew', label: 'city:forms.shared.themeType.crew' },
]

export default function IdentityForm() {
    const text = useUiText()
    const { cityOfMistThemeCard, setCityOfMistThemeCard, setThemeType } =
        useCityOfMistThemeCardStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-card-themebook">
                    {text('city:forms.themeCard.identity.themebookLabel')}
                </Label>
                <Input
                    id="theme-card-themebook"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeCard.themebook}
                    onChange={(event) =>
                        setCityOfMistThemeCard({
                            themebook: event.target.value,
                        })
                    }
                    placeholder={text(
                        'city:forms.themeCard.identity.themebookPlaceholder'
                    )}
                />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-card-title">
                    {text('city:forms.themeCard.identity.titleLabel')}
                </Label>
                <Input
                    id="theme-card-title"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeCard.title}
                    onChange={(event) =>
                        setCityOfMistThemeCard({ title: event.target.value })
                    }
                    placeholder={text(
                        'city:forms.themeCard.identity.titlePlaceholder'
                    )}
                />
            </div>
            <div className="grid gap-1">
                <Label>{text('city:forms.themeCard.identity.typeLabel')}</Label>
                <SegmentedRadioGroup
                    id="theme-card-type"
                    value={cityOfMistThemeCard.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={TYPES.map((entry) => ({
                        value: entry.value,
                        label: text(entry.label),
                    }))}
                    ariaLabel={text('city:forms.themeCard.identity.typeLabel')}
                />
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeCard.identity.typeHelp')}
                </p>
            </div>
        </div>
    )
}
