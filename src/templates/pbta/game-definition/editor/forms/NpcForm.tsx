import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useGameDefinitionStore } from '../../hooks'
import { AttributeListEditor } from '../AttributeListEditor'
import { RecordListEditor } from '../RecordListEditor'

export default function NpcForm() {
    const { gameDefinition, setNpc, clearNpc } = useGameDefinitionStore()
    const npc = gameDefinition.npc
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!npc) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    This definition has no NPC-facing content. Add one to give
                    NPCs their own attributes and move types.
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setNpc({})}
                >
                    Add an NPC section
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Attributes</Label>
                <AttributeListEditor
                    value={npc.attributes}
                    onChange={(attributes) => setNpc({ attributes })}
                />
            </div>

            <div className="grid gap-1">
                <Label>Move types</Label>
                <RecordListEditor
                    value={npc.moveTypes}
                    onChange={(moveTypes) => setNpc({ moveTypes })}
                    keyPlaceholder="key"
                    valuePlaceholder="Move type label"
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    Equipment types{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <RecordListEditor
                    value={npc.equipmentTypes}
                    onChange={(equipmentTypes) => setNpc({ equipmentTypes })}
                    keyPlaceholder="key"
                    valuePlaceholder="Equipment type label"
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-npc-description">
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="pbta-def-npc-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={npc.description}
                    onChange={(event) =>
                        setNpc({ description: event.target.value })
                    }
                    placeholder="Supports Markdown."
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
                        ? 'This document was imported from TOML: export re-applies the original file over any field this form leaves blank, so the NPC section would come back. Blank each field above instead.'
                        : undefined
                }
            >
                Remove the NPC section
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
