import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useUiText } from '@/i18n/text'
import { useGameDefinitionStore } from '../../hooks'
import { AttributeListEditor } from '../AttributeListEditor'
import { RecordListEditor } from '../RecordListEditor'

export default function NpcForm() {
    const { gameDefinition, setNpc, clearNpc } = useGameDefinitionStore()
    const text = useUiText()
    const npc = gameDefinition.npc
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!npc) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    {text('pbta:forms.gameDefinition.npc.empty')}
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setNpc({})}
                >
                    {text('pbta:forms.gameDefinition.npc.add')}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.labels.attributes')}
                </Label>
                <AttributeListEditor
                    value={npc.attributes}
                    onChange={(attributes) => setNpc({ attributes })}
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.labels.moveTypes')}
                </Label>
                <RecordListEditor
                    value={npc.moveTypes}
                    onChange={(moveTypes) => setNpc({ moveTypes })}
                    keyPlaceholder={text('pbta:forms.shared.keyPlaceholder')}
                    valuePlaceholder={text(
                        'pbta:forms.gameDefinition.placeholders.moveTypeLabel'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('pbta:forms.gameDefinition.labels.equipmentTypes')}{' '}
                    <span className="text-muted-foreground">
                        {text('pbta:forms.shared.optional')}
                    </span>
                </Label>
                <RecordListEditor
                    value={npc.equipmentTypes}
                    onChange={(equipmentTypes) => setNpc({ equipmentTypes })}
                    keyPlaceholder={text('pbta:forms.shared.keyPlaceholder')}
                    valuePlaceholder={text(
                        'pbta:forms.gameDefinition.placeholders.equipmentTypeLabel'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-npc-description">
                    {text('fields.description')}{' '}
                    <span className="text-muted-foreground">
                        {text('pbta:forms.shared.optional')}
                    </span>
                </Label>
                <Textarea
                    id="pbta-def-npc-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={npc.description}
                    onChange={(event) =>
                        setNpc({ description: event.target.value })
                    }
                    placeholder={text('pbta:forms.shared.supportsMarkdown')}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={clearNpc}
                disabled={importedDoc}
                title={
                    importedDoc
                        ? text('pbta:forms.gameDefinition.sectionBlocked', {
                              section: text(
                                  'pbta:forms.gameDefinition.sectionNames.npc'
                              ),
                          })
                        : undefined
                }
            >
                {text('pbta:forms.gameDefinition.npc.remove')}
            </Button>
            {importedDoc && (
                <p className="text-xs text-muted-foreground">
                    {text('pbta:forms.gameDefinition.importedNote')}
                </p>
            )}
        </div>
    )
}
