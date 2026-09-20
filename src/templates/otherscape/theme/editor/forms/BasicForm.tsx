import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import type { TranslationKey } from '@/i18n/text'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeStore, type ThemeType } from '../../hooks'

const THEME_TYPES: ThemeType[] = ['self', 'mythos', 'noise', 'crew']

const THEME_TYPE_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.themeType.self',
    mythos: 'otherscape:forms.theme.themeType.mythos',
    noise: 'otherscape:forms.theme.themeType.noise',
    crew: 'otherscape:forms.theme.themeType.crew',
}

const THEME_TYPE_HELP_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.basic.themeTypeHelp.self',
    mythos: 'otherscape:forms.theme.basic.themeTypeHelp.mythos',
    noise: 'otherscape:forms.theme.basic.themeTypeHelp.noise',
    crew: 'otherscape:forms.theme.basic.themeTypeHelp.crew',
}

export default function BasicForm() {
    const { otherscapeTheme, setTitleTag, setThemeType, setCategory } =
        useOtherscapeThemeStore()
    const text = useUiText()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-title-tag">
                    {text('otherscape:forms.theme.basic.titleTagLabel')}
                </Label>
                <Input
                    id="os-theme-title-tag"
                    className="h-8 px-2 text-sm"
                    value={otherscapeTheme.title_tag}
                    onChange={(event) => setTitleTag(event.target.value)}
                    placeholder={text(
                        'otherscape:forms.theme.basic.titleTagPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.theme.basic.titleTagHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('otherscape:forms.theme.basic.themeTypeLabel')}
                </Label>
                <SegmentedRadioGroup
                    id="os-theme-type"
                    value={otherscapeTheme.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    options={THEME_TYPES.map((value) => ({
                        value,
                        label: text(THEME_TYPE_KEY[value]),
                    }))}
                    ariaLabel={text(
                        'otherscape:forms.theme.basic.themeTypeAriaLabel'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text(THEME_TYPE_HELP_KEY[otherscapeTheme.theme_type])}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-theme-category">
                    {text('otherscape:forms.theme.basic.themebookLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('otherscape:forms.theme.basic.optionalSuffix')}
                    </span>
                </Label>
                <Input
                    id="os-theme-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeTheme.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder={text(
                        'otherscape:forms.theme.basic.themebookPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.theme.basic.themebookHelp')}
                </p>
            </div>
        </div>
    )
}
