import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import { useCityOfMistThemeCardViewStore } from '../hooks'
import { themeCardBackgroundOptions, themeCardSections } from '../metadata'
import { PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN } from '../model'

export function ThemeCardAppearancePanel() {
    const {
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
    } = useCityOfMistThemeCardViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="theme-card-auto-hide-empty" className="text-xs">
                    Auto-hide empty sections
                </Label>
                <Switch
                    id="theme-card-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sections
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {themeCardSections.map((section) => (
                        <label key={section.id} className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={!hidden[section.id]}
                                onCheckedChange={() => toggleHidden(section.id)}
                            />
                            <span className="text-xs">{section.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="theme-card-preview-width" className="text-xs">
                        Preview width
                    </Label>
                    <span className="text-xs font-medium">{previewWidth}px</span>
                </div>
                <input
                    id="theme-card-preview-width"
                    type="range"
                    min={PREVIEW_WIDTH_MIN}
                    max={PREVIEW_WIDTH_MAX}
                    step={10}
                    value={previewWidth}
                    onChange={(event) => setPreviewWidth(Number(event.target.value))}
                    className="w-full accent-primary"
                    aria-label="Preview width"
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Background
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {themeCardBackgroundOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={cn(
                                'h-7 w-7 rounded-full border-2 transition-transform hover:scale-105',
                                background === option.value ? 'border-foreground' : 'border-border'
                            )}
                            style={{ backgroundColor: option.color }}
                            onClick={() => setBackground(option.value)}
                            aria-label={`Use ${option.label} background`}
                            title={option.label}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Title placement
                </p>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border">
                    {(['inside', 'outside'] as const).map((placement) => (
                        <Button
                            key={placement}
                            type="button"
                            variant={titlePlacement === placement ? 'default' : 'ghost'}
                            className="h-8 rounded-none border-none px-2 text-xs capitalize"
                            onClick={() => setTitlePlacement(placement)}
                        >
                            {placement}
                        </Button>
                    ))}
                </div>
            </div>

            <Button type="button" variant="secondary" size="sm" className="h-8 w-full text-xs" onClick={resetViewPrefs}>
                Reset view
            </Button>
        </div>
    )
}
