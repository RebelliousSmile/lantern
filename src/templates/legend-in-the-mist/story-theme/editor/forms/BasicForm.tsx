import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import { useTranslation } from 'react-i18next'
import { useLegendInTheMistStoryThemeStore, type ThemeLevel } from '../../hooks'

const LEVEL_VALUES: ThemeLevel[] = ['origin', 'adventure', 'greatness']

export default function BasicForm() {
    const { t } = useTranslation()
    const { legendInTheMistStoryTheme, setTitleTag, setLevel, setCategory } =
        useLegendInTheMistStoryThemeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="story-theme-title">
                    {t('legend:forms.storyTheme.basicForm.titleTagLabel')}
                </Label>
                <Input
                    id="story-theme-title"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistStoryTheme.title_tag}
                    onChange={(event) => setTitleTag(event.target.value)}
                    placeholder={t(
                        'legend:forms.storyTheme.basicForm.titleTagPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {t('legend:forms.storyTheme.basicForm.titleTagHint')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label>
                    {t('legend:forms.storyTheme.basicForm.levelLabel')}
                </Label>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    {LEVEL_VALUES.map((value) => (
                        <Button
                            key={value}
                            type="button"
                            variant={
                                legendInTheMistStoryTheme.level === value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                legendInTheMistStoryTheme.level === value
                                    ? ''
                                    : 'bg-background'
                            )}
                            title={t(
                                `legend:forms.storyTheme.basicForm.levels.${value}.hint`
                            )}
                            onClick={() => setLevel(value)}
                        >
                            {t(
                                `legend:forms.storyTheme.basicForm.levels.${value}.label`
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="story-theme-category">
                    {t('legend:forms.storyTheme.basicForm.categoryLabel')}{' '}
                    <span className="text-muted-foreground">
                        {t(
                            'legend:forms.storyTheme.basicForm.categoryOptional'
                        )}
                    </span>
                </Label>
                <Input
                    id="story-theme-category"
                    className="h-8 px-2 text-sm"
                    value={legendInTheMistStoryTheme.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder={t(
                        'legend:forms.storyTheme.basicForm.categoryPlaceholder'
                    )}
                />
            </div>
        </div>
    )
}
