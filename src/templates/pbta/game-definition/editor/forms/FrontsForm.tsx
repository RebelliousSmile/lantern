import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useUiText } from '@/i18n/text'
import { useGameDefinitionStore } from '../../hooks'
import { ClockPresetsEditor } from '../ClockPresetsEditor'
import { RecordListEditor } from '../RecordListEditor'

export default function FrontsForm() {
    const { gameDefinition, setFronts, clearFronts } = useGameDefinitionStore()
    const text = useUiText()
    const fronts = gameDefinition.fronts
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!fronts) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    {text('pbta:forms.gameDefinition.fronts.empty')}
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setFronts({})}
                >
                    {text('pbta:forms.gameDefinition.fronts.add')}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.fronts.threatTypes')}
                </Label>
                <RecordListEditor
                    value={fronts.threatTypes}
                    onChange={(threatTypes) => setFronts({ threatTypes })}
                    keyPlaceholder={text('pbta:forms.shared.keyPlaceholder')}
                    valuePlaceholder={text(
                        'pbta:forms.gameDefinition.fronts.threatTypePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.fronts.impulses')}
                </Label>
                <RecordListEditor
                    value={fronts.impulses}
                    onChange={(impulses) => setFronts({ impulses })}
                    keyPlaceholder={text('pbta:forms.shared.keyPlaceholder')}
                    valuePlaceholder={text(
                        'pbta:forms.gameDefinition.fronts.impulsePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.fronts.clockPresets')}
                </Label>
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
                        ? text('pbta:forms.gameDefinition.sectionBlocked', {
                              section: text(
                                  'pbta:forms.gameDefinition.sectionNames.fronts'
                              ),
                          })
                        : undefined
                }
            >
                {text('pbta:forms.gameDefinition.fronts.remove')}
            </Button>
            {importedDoc && (
                <p className="text-xs text-muted-foreground">
                    {text('pbta:forms.gameDefinition.importedNote')}
                </p>
            )}
        </div>
    )
}
