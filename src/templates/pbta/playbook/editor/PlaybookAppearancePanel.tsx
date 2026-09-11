import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePlaybookViewStore } from '../hooks'
import { playbookSections } from '../metadata'
import { PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN } from '../model'

export function PlaybookAppearancePanel() {
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        previewWidth,
        setPreviewWidth,
        showSeparators,
        setShowSeparators,
        resetViewPrefs,
    } = usePlaybookViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="pbta-pb-auto-hide-empty" className="text-xs">
                    Auto-hide empty sections
                </Label>
                <Switch
                    id="pbta-pb-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="pbta-pb-separators" className="text-xs">
                    Show separators
                </Label>
                <Switch
                    id="pbta-pb-separators"
                    checked={showSeparators}
                    onCheckedChange={(value) => setShowSeparators(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sections
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {playbookSections.map((section) => (
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

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="pbta-pb-preview-width" className="text-xs">
                        Preview width
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="pbta-pb-preview-width"
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
