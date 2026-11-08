import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useUiText } from '@/i18n/text'
import { useGameDefinitionStore } from '../../hooks'
import { RecordListEditor } from '../RecordListEditor'

export default function McForm() {
    const { gameDefinition, setMc, clearMc } = useGameDefinitionStore()
    const text = useUiText()
    const mc = gameDefinition.mc
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!mc) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    {text('pbta:forms.gameDefinition.mc.empty')}
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setMc({})}
                >
                    {text('pbta:forms.gameDefinition.mc.add')}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.labels.moveTypes')}
                </Label>
                <RecordListEditor
                    value={mc.moveTypes}
                    onChange={(moveTypes) => setMc({ moveTypes })}
                    keyPlaceholder={text('pbta:forms.shared.keyPlaceholder')}
                    valuePlaceholder={text(
                        'pbta:forms.gameDefinition.placeholders.moveTypeLabel'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-mc-description">
                    {text('fields.description')}{' '}
                    <span className="text-muted-foreground">
                        {text('pbta:forms.shared.optional')}
                    </span>
                </Label>
                <Textarea
                    id="pbta-def-mc-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={mc.description}
                    onChange={(event) =>
                        setMc({ description: event.target.value })
                    }
                    placeholder={text('pbta:forms.shared.supportsMarkdown')}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={clearMc}
                disabled={importedDoc}
                title={
                    importedDoc
                        ? text('pbta:forms.gameDefinition.sectionBlocked', {
                              section: text(
                                  'pbta:forms.gameDefinition.sectionNames.mc'
                              ),
                          })
                        : undefined
                }
            >
                {text('pbta:forms.gameDefinition.mc.remove')}
            </Button>
            {importedDoc && (
                <p className="text-xs text-muted-foreground">
                    {text('pbta:forms.gameDefinition.importedNote')}
                </p>
            )}
        </div>
    )
}
