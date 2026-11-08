import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUiText } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { useCityOfMistThemeKitViewStore } from '../hooks'
import { themeKitBackgroundOptions, themeKitSections } from '../metadata'
import { PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN } from '../model'

export function ThemeKitAppearancePanel() {
    const text = useUiText()
    const {
        columnCount,
        setColumnCount,
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        titlePlacement,
        setTitlePlacement,
        resetViewPrefs,
    } = useCityOfMistThemeKitViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="theme-kit-auto-hide-empty" className="text-xs">
                    {text('city:forms.shared.appearance.autoHideEmptySections')}
                </Label>
                <Switch
                    id="theme-kit-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.shared.appearance.sectionsLabel')}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {themeKitSections.map((section) => (
                        <label
                            key={section.id}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <Checkbox
                                checked={!hidden[section.id]}
                                onCheckedChange={() => toggleHidden(section.id)}
                            />
                            <span className="text-xs">
                                {text(section.label)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label
                        htmlFor="theme-kit-preview-width"
                        className="text-xs"
                    >
                        {text('city:forms.shared.appearance.previewWidthLabel')}
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="theme-kit-preview-width"
                    type="range"
                    min={PREVIEW_WIDTH_MIN}
                    max={PREVIEW_WIDTH_MAX}
                    step={10}
                    value={previewWidth}
                    onChange={(event) =>
                        setPreviewWidth(Number(event.target.value))
                    }
                    className="w-full accent-primary"
                    aria-label={text(
                        'city:forms.shared.appearance.previewWidthLabel'
                    )}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.shared.appearance.backgroundLabel')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {themeKitBackgroundOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={cn(
                                'h-7 w-7 rounded-full border-2 transition-transform hover:scale-105',
                                background === option.value
                                    ? 'border-foreground'
                                    : 'border-border'
                            )}
                            style={{ backgroundColor: option.color }}
                            onClick={() => setBackground(option.value)}
                            aria-label={text(
                                'city:forms.shared.appearance.useBackground',
                                {
                                    name: text(option.label),
                                }
                            )}
                            title={text(option.label)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.themeKit.appearance.columnsLabel')}
                </p>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border">
                    {([1, 2] as const).map((count) => (
                        <Button
                            key={count}
                            type="button"
                            variant={
                                columnCount === count ? 'default' : 'ghost'
                            }
                            className="h-8 rounded-none border-none px-2 text-xs"
                            onClick={() => setColumnCount(count)}
                        >
                            {count === 1
                                ? text(
                                      'city:forms.themeKit.appearance.oneColumn'
                                  )
                                : text(
                                      'city:forms.themeKit.appearance.twoColumns'
                                  )}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.shared.appearance.titlePlacementLabel')}
                </p>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border">
                    {(['inside', 'outside'] as const).map((placement) => (
                        <Button
                            key={placement}
                            type="button"
                            variant={
                                titlePlacement === placement
                                    ? 'default'
                                    : 'ghost'
                            }
                            className="h-8 rounded-none border-none px-2 text-xs"
                            onClick={() => setTitlePlacement(placement)}
                        >
                            {text(
                                placement === 'inside'
                                    ? 'city:forms.shared.appearance.titleInside'
                                    : 'city:forms.shared.appearance.titleOutside'
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={resetViewPrefs}
            >
                {text('city:forms.shared.appearance.resetView')}
            </Button>
        </div>
    )
}
