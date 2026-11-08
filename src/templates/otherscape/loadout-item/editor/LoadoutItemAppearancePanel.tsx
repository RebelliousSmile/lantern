import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUiText } from '@/i18n/text'
import { OtherscapeVariantPicker } from '../../shared/OtherscapeVariantPicker'
import { useOtherscapeLoadoutItemViewStore } from '../hooks'
import { loadoutItemSections } from '../metadata'
import { PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN } from '../model'

export function LoadoutItemAppearancePanel() {
    const text = useUiText()
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        previewWidth,
        setPreviewWidth,
        variant,
        setVariant,
        resetViewPrefs,
    } = useOtherscapeLoadoutItemViewStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label
                    htmlFor="os-loadout-item-auto-hide-empty"
                    className="text-xs"
                >
                    {text(
                        'otherscape:forms.loadoutItem.appearance.autoHideEmptyLabel'
                    )}
                </Label>
                <Switch
                    id="os-loadout-item-auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text(
                        'otherscape:forms.loadoutItem.appearance.sectionsTitle'
                    )}
                </p>
                <div className="grid grid-cols-[1fr_0.8fr] gap-x-3 gap-y-1.5">
                    {loadoutItemSections.map((section) => (
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
                        htmlFor="os-loadout-item-preview-width"
                        className="text-xs"
                    >
                        {text(
                            'otherscape:forms.loadoutItem.appearance.previewWidthLabel'
                        )}
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="os-loadout-item-preview-width"
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
                        'otherscape:forms.loadoutItem.appearance.previewWidthLabel'
                    )}
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{PREVIEW_WIDTH_MIN}px</span>
                    <span>{PREVIEW_WIDTH_MAX}px</span>
                </div>
            </div>

            <OtherscapeVariantPicker
                idPrefix="os-loadout-item"
                heading="otherscape:forms.loadoutItem.appearance.variantTitle"
                value={variant}
                onChange={setVariant}
            />

            {/* No background choice: the catalog row has one ground, the light
                page, and neither a neon glow nor a flat fill changed it. */}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={resetViewPrefs}
            >
                {text('otherscape:forms.loadoutItem.appearance.resetView')}
            </Button>
        </div>
    )
}
