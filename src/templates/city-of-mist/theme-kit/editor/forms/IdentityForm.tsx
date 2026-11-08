import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useCityOfMistThemeKitStore, type ThemeType } from '../../hooks'
import StringListInput from './StringListInput'

const TYPES: { value: ThemeType; label: TranslationKey }[] = [
    { value: 'mythos', label: 'city:forms.shared.themeType.mythos' },
    { value: 'logos', label: 'city:forms.shared.themeType.logos' },
    { value: 'extra', label: 'city:forms.shared.themeType.extra' },
    { value: 'crew', label: 'city:forms.shared.themeType.crew' },
]

export default function IdentityForm() {
    const text = useUiText()
    const {
        cityOfMistThemeKit,
        setCityOfMistThemeKit,
        setThemeType,
        setKeywords,
    } = useCityOfMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-name">
                    {text('city:forms.themeKit.identity.nameLabel')}
                </Label>
                <Input
                    id="theme-kit-name"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistThemeKit.name}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            name: event.target.value || 'Untitled Themebook',
                        })
                    }
                    placeholder={text(
                        'city:forms.themeKit.identity.namePlaceholder'
                    )}
                />
            </div>
            <div className="grid gap-1">
                <Label>{text('city:forms.themeKit.identity.typeLabel')}</Label>
                <SegmentedRadioGroup
                    id="theme-kit-type"
                    value={cityOfMistThemeKit.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={TYPES.map((entry) => ({
                        value: entry.value,
                        label: text(entry.label),
                    }))}
                    ariaLabel={text('city:forms.themeKit.identity.typeLabel')}
                />
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeKit.identity.typeHelp')}
                </p>
            </div>
            <div className="grid gap-1">
                <Label>
                    {text('city:forms.themeKit.identity.keywordsLabel')}
                </Label>
                <StringListInput
                    value={cityOfMistThemeKit.keywords}
                    onChange={setKeywords}
                    placeholder={text(
                        'city:forms.themeKit.identity.keywordPlaceholder'
                    )}
                />
            </div>
        </div>
    )
}
