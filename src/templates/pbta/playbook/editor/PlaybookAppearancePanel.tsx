import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUiText } from '@/i18n/text'
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
    const text = useUiText()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="pbta-pb-auto-hide-empty" className="text-xs">
                    {text('pbta:forms.shared.appearance.autoHideEmptySections')}
                </Label>
                <Switch
                    id="pbta-pb-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="pbta-pb-separators" className="text-xs">
                    {text('pbta:forms.shared.appearance.showSeparators')}
                </Label>
                <Switch
                    id="pbta-pb-separators"
                    checked={showSeparators}
                    onCheckedChange={(value) => setShowSeparators(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text('pbta:forms.shared.appearance.sectionsLabel')}
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
                            <span className="text-xs">
                                {text(section.label)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="pbta-pb-preview-width" className="text-xs">
                        {text('pbta:forms.shared.appearance.previewWidthLabel')}
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
                    aria-label={text(
                        'pbta:forms.shared.appearance.previewWidthLabel'
                    )}
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
                {text('pbta:forms.shared.appearance.resetView')}
            </Button>
        </div>
    )
}
