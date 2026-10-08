import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useUrbanShadowsViewStore } from '../hooks'
import { urbanShadowsSections } from '../metadata'
export function UrbanShadowsPlaybookAppearancePanel() {
    const text = useUiText()
    const { hidden, setHidden, previewWidth, setPreviewWidth } =
        useUrbanShadowsViewStore()
    return (
        <div className="space-y-3">
            <Label>
                {text('pbta:urbanShadows.editor.previewWidth')}{' '}
                {/* Below 840px the booklet flows in one column, above it lays its three. */}
                <input
                    type="range"
                    min="360"
                    max="1400"
                    step="10"
                    value={previewWidth}
                    onChange={(e) => setPreviewWidth(Number(e.target.value))}
                />
            </Label>
            {urbanShadowsSections.map((section) => (
                <label className="flex gap-2" key={section.id}>
                    <Checkbox
                        checked={!hidden[section.id]}
                        onCheckedChange={(value) =>
                            setHidden(section.id, !value)
                        }
                    />
                    {text(section.label)}
                </label>
            ))}
        </div>
    )
}
