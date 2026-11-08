import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUiText } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { useCityOfMistDangerViewStore } from '../hooks'
import { dangerBackgroundOptions, dangerSections } from '../metadata'
import {
    COLUMN_HEIGHT_MAX,
    COLUMN_HEIGHT_MIN,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from '../model'

export function DangerAppearancePanel() {
    const text = useUiText()
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        columnCount,
        setColumnCount,
        titlePlacement,
        setTitlePlacement,
        columnHeight,
        setColumnHeight,
        showSeparators,
        setShowSeparators,
        resetViewPrefs,
    } = useCityOfMistDangerViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="danger-auto-hide-empty" className="text-xs">
                    {text('city:forms.shared.appearance.autoHideEmptySections')}
                </Label>
                <Switch
                    id="danger-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="danger-separators" className="text-xs">
                    {text('city:forms.shared.appearance.showSeparators')}
                </Label>
                <Switch
                    id="danger-separators"
                    checked={showSeparators}
                    onCheckedChange={(value) => setShowSeparators(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.shared.appearance.sectionsLabel')}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {dangerSections.map((section) => (
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
                    <Label htmlFor="danger-preview-width" className="text-xs">
                        {text('city:forms.shared.appearance.previewWidthLabel')}
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="danger-preview-width"
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
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{PREVIEW_WIDTH_MIN}px</span>
                    <span>{PREVIEW_WIDTH_MAX}px</span>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('city:forms.shared.appearance.backgroundLabel')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {dangerBackgroundOptions.map((option) => (
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {text('city:forms.danger.appearance.layoutLabel')}
                        </p>
                        <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
                            <button
                                type="button"
                                className={cn(
                                    'h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors',
                                    columnCount === 1
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                                onClick={() => setColumnCount(1)}
                                aria-pressed={columnCount === 1}
                            >
                                {text('city:forms.danger.appearance.oneColumn')}
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    'h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors',
                                    columnCount === 2
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                                onClick={() => setColumnCount(2)}
                                aria-pressed={columnCount === 2}
                            >
                                {text(
                                    'city:forms.danger.appearance.twoColumns'
                                )}
                            </button>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'space-y-2 transition-opacity',
                            columnCount === 2 ? 'opacity-100' : 'opacity-45'
                        )}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {text(
                                'city:forms.shared.appearance.titlePlacementLabel'
                            )}
                        </p>
                        <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
                            <button
                                type="button"
                                disabled={columnCount !== 2}
                                className={cn(
                                    'h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors disabled:pointer-events-none',
                                    titlePlacement === 'outside'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                                onClick={() => setTitlePlacement('outside')}
                                aria-pressed={titlePlacement === 'outside'}
                            >
                                {text(
                                    'city:forms.shared.appearance.titleOutside'
                                )}
                            </button>
                            <button
                                type="button"
                                disabled={columnCount !== 2}
                                className={cn(
                                    'h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors disabled:pointer-events-none',
                                    titlePlacement === 'inside'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                                onClick={() => setTitlePlacement('inside')}
                                aria-pressed={titlePlacement === 'inside'}
                            >
                                {text(
                                    'city:forms.shared.appearance.titleInside'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    'space-y-2 transition-opacity',
                    columnCount === 2 ? 'opacity-100' : 'opacity-45'
                )}
            >
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="danger-column-height" className="text-xs">
                        {text('city:forms.danger.appearance.blockHeight')}
                    </Label>
                    <span className="text-xs font-medium">
                        {columnHeight}px
                    </span>
                </div>
                <input
                    id="danger-column-height"
                    type="range"
                    min={COLUMN_HEIGHT_MIN}
                    max={COLUMN_HEIGHT_MAX}
                    step={10}
                    value={columnHeight}
                    onChange={(event) =>
                        setColumnHeight(Number(event.target.value))
                    }
                    className="w-full accent-primary disabled:cursor-not-allowed"
                    aria-label={text(
                        'city:forms.danger.appearance.blockHeight'
                    )}
                    disabled={columnCount !== 2}
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{COLUMN_HEIGHT_MIN}px</span>
                    <span>{COLUMN_HEIGHT_MAX}px</span>
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
