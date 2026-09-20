import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useLegendInTheMistThemeKitStore } from '../../hooks'

export default function BasicForm() {
    const text = useUiText()
    const { legendInTheMistThemeKit, setName, setCategory } =
        useLegendInTheMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-name">
                    {text('legend:forms.themeKit.basic.nameLabel')}
                </Label>
                <Input
                    id="theme-kit-name"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistThemeKit.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={text(
                        'legend:forms.themeKit.basic.namePlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.themeKit.basic.nameHint')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-category">
                    {text('legend:forms.themeKit.basic.categoryLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('legend:forms.themeKit.shared.optional')}
                    </span>
                </Label>
                <Input
                    id="theme-kit-category"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistThemeKit.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder={text(
                        'legend:forms.themeKit.basic.categoryPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('legend:forms.themeKit.basic.categoryHint')}
                </p>
            </div>
        </div>
    )
}
