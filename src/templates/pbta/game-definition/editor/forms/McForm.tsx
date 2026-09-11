import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasCanonicalSource } from '@/contracts/canonicalSource'
import { useGameDefinitionStore } from '../../hooks'
import { RecordListEditor } from '../RecordListEditor'

export default function McForm() {
    const { gameDefinition, setMc, clearMc } = useGameDefinitionStore()
    const mc = gameDefinition.mc
    const importedDoc = hasCanonicalSource(gameDefinition)

    if (!mc) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    This definition has no MC-facing content. Add one to give
                    the MC their own move types.
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setMc({})}
                >
                    Add an MC section
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Move types</Label>
                <RecordListEditor
                    value={mc.moveTypes}
                    onChange={(moveTypes) => setMc({ moveTypes })}
                    keyPlaceholder="key"
                    valuePlaceholder="Move type label"
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-mc-description">
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="pbta-def-mc-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={mc.description}
                    onChange={(event) =>
                        setMc({ description: event.target.value })
                    }
                    placeholder="Supports Markdown."
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
                        ? 'This document was imported from TOML: export re-applies the original file over any field this form leaves blank, so the MC section would come back. Blank each field above instead.'
                        : undefined
                }
            >
                Remove the MC section
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
