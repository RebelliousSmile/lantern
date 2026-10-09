import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useSprawlViewStore } from '../hooks'
import { theSprawlSections } from '../metadata'

export function SprawlPlaybookAppearancePanel() {
    const text = useUiText()
    const { hidden, setHidden, previewWidth, setPreviewWidth } =
        useSprawlViewStore()
    return (
        <div className="space-y-3">
            <Label>
                {text('pbta:sprawl.editor.previewWidth')}{' '}
                {/* Below 840px the faces flow in one column, above it each lays its two. */}
                <input
                    type="range"
                    min="360"
                    max="1400"
                    step="10"
                    value={previewWidth}
                    onChange={(e) => setPreviewWidth(Number(e.target.value))}
                />
            </Label>
            {theSprawlSections.map((section) => (
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
