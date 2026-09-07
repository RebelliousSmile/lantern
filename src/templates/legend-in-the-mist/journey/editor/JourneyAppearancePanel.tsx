import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useLegendInTheMistJourneyViewStore } from '../hooks'
import {
    journeyBackgroundOptions,
    journeySections,
    journeyZoomOptions,
} from '../metadata'
import { PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN } from '../model'

/* Everything here writes to the view, never to the document: a journey exported
   after a zoom change is byte for byte the journey exported before it. */
export function JourneyAppearancePanel() {
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        zoom,
        setZoom,
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        resetViewPrefs,
    } = useLegendInTheMistJourneyViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="journey-auto-hide-empty" className="text-xs">
                    Auto-hide empty sections
                </Label>
                <Switch
                    id="journey-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sections
                </p>
                <div className="grid grid-cols-[1fr_0.8fr] gap-x-3 gap-y-1.5">
                    {journeySections.map((section) => (
                        <label
                            key={section.id}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <Checkbox
                                checked={!hidden[section.id]}
                                onCheckedChange={() => toggleHidden(section.id)}
                            />
                            <span className="text-xs">{section.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* The spread is wide enough that a laptop rarely holds it at 100%,
                so the zoom is offered as fixed steps rather than a slider. */}
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Zoom
                </p>
                <div className="grid grid-cols-4 overflow-hidden rounded-md border">
                    {journeyZoomOptions.map((option) => (
                        <Button
                            key={option}
                            type="button"
                            variant={zoom === option ? 'default' : 'ghost'}
                            className={`h-8 rounded-none border-none px-2 text-xs ${
                                zoom === option ? '' : 'bg-background'
                            }`}
                            onClick={() => setZoom(option)}
                        >
                            {Math.round(option * 100)}%
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="journey-preview-width" className="text-xs">
                        Preview width
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="journey-preview-width"
                    type="range"
                    min={PREVIEW_WIDTH_MIN}
                    max={PREVIEW_WIDTH_MAX}
                    step={10}
                    value={previewWidth}
                    onChange={(event) =>
                        setPreviewWidth(Number(event.target.value))
                    }
                    className="w-full accent-primary"
                    aria-label="Preview width"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{PREVIEW_WIDTH_MIN}px</span>
                    <span>{PREVIEW_WIDTH_MAX}px</span>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Background
                </p>
                <RadioGroup
                    value={background}
                    onValueChange={(value) =>
                        setBackground(value as typeof background)
                    }
                    className="flex flex-wrap items-center gap-3"
                >
                    {journeyBackgroundOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`journey-background-${option.value}`}
                            />
                            <span className="text-xs">{option.label}</span>
                        </label>
                    ))}
                </RadioGroup>
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={resetViewPrefs}
            >
                Reset view
            </Button>
        </div>
    )
}
