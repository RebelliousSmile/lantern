import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeKitStore, type ThemeType } from '../../hooks'

const THEME_TYPES: ThemeType[] = ['self', 'mythos', 'noise', 'crew']

export default function BasicForm() {
    const text = useUiText()
    const { otherscapeThemeKit, setTitleTag, setThemeType, setCategory } =
        useOtherscapeThemeKitStore()
    const themeType = otherscapeThemeKit.theme_type

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-title-tag">
                    {text('otherscape:forms.themeKit.basic.titleTagLabel')}
                </Label>
                <Input
                    id="os-theme-kit-title-tag"
                    className="h-8 px-2 text-sm"
                    value={otherscapeThemeKit.title_tag}
                    onChange={(event) => setTitleTag(event.target.value)}
                    placeholder={text(
                        'otherscape:forms.themeKit.basic.titleTagPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.themeKit.basic.titleTagHint')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('otherscape:forms.themeKit.basic.themeTypeLabel')}
                </Label>
                <SegmentedRadioGroup
                    id="os-theme-kit-type"
                    value={otherscapeThemeKit.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={THEME_TYPES.map((value) => ({
                        value,
                        label: text(
                            `otherscape:forms.themeKit.themeType.${value}`
                        ),
                    }))}
                    ariaLabel={text(
                        'otherscape:forms.themeKit.basic.themeTypeLabel'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text(
                        `otherscape:forms.themeKit.basic.themeTypeHint.${themeType}`
                    )}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-category">
                    {text('otherscape:forms.themeKit.basic.themebookLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('otherscape:forms.themeKit.optional')}
                    </span>
                </Label>
                <Input
                    id="os-theme-kit-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeThemeKit.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder={text(
                        'otherscape:forms.themeKit.basic.themebookPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.themeKit.basic.themebookHint')}
                </p>
            </div>
        </div>
    )
}
