import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useGameDefinitionStore } from '../../hooks'
import { ClockPresetsEditor } from '../ClockPresetsEditor'
import { RecordListEditor } from '../RecordListEditor'

export default function FrontsForm() {
    const { gameDefinition, setFronts, clearFronts } = useGameDefinitionStore()
    const fronts = gameDefinition.fronts
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!fronts) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    This definition has no fronts-facing content. Add one to
                    give fronts their own threat types, impulses and clock
                    presets.
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setFronts({})}
                >
                    Add a fronts section
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Threat types</Label>
                <RecordListEditor
                    value={fronts.threatTypes}
                    onChange={(threatTypes) => setFronts({ threatTypes })}
                    keyPlaceholder="key"
                    valuePlaceholder="Threat type label"
                />
            </div>

            <div className="grid gap-1">
                <Label>Impulses</Label>
                <RecordListEditor
                    value={fronts.impulses}
                    onChange={(impulses) => setFronts({ impulses })}
                    keyPlaceholder="key"
                    valuePlaceholder="Impulse label"
                />
            </div>

            <div className="grid gap-1">
                <Label>Clock presets</Label>
                <ClockPresetsEditor
                    value={fronts.clockPresets}
                    onChange={(clockPresets) => setFronts({ clockPresets })}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={clearFronts}
                disabled={importedDoc}
                title={
                    importedDoc
                        ? 'This document was imported from TOML: export re-applies the original file over any field this form leaves blank, so the fronts section would come back. Blank each field above instead.'
                        : undefined
                }
            >
                Remove the fronts section
            </Button>
            {importedDoc && (
                <p className="text-xs text-muted-foreground">
                    Imported from TOML - removing the section here will not drop
                    it from the exported file. Blank the fields above instead.
                </p>
            )}
        </div>
    )
}
