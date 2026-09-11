import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttributeField } from '../../../shared/attributeField'
import { useGameDefinitionForGame } from '../../../shared/gameDefinition'
import { usePlaybookStore } from '../../hooks'
import { StatsEditor } from '../StatsEditor'

/* Stats/attributes are bound values (playbook.stats, playbook.attributes);
   the attribute *definitions* live on the matching game definition tab,
   found by game id via useGameDefinitionForGame - see shared/gameDefinition.ts.
   With no such tab open there is nothing to bind against, so the section
   falls back to a hint instead of silently rendering no fields. */
export default function StatsForm() {
    const { playbook, setPlaybook, setStats, setAttributes } =
        usePlaybookStore()
    const gameDefinition = useGameDefinitionForGame(playbook.game)
    const attributeDefinitions = gameDefinition?.character.attributes ?? {}
    const attributeKeys = Object.keys(attributeDefinitions)

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Stats</Label>
                <StatsEditor value={playbook.stats} onChange={setStats} />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-pb-stats-detail">Stats detail</Label>
                <Textarea
                    id="pbta-pb-stats-detail"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={playbook.statsDetail}
                    onChange={(event) =>
                        setPlaybook({ statsDetail: event.target.value })
                    }
                    placeholder="Supports Markdown."
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">
                    Attributes
                </Label>
                {attributeKeys.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        Open this playbook&apos;s game definition tab (same game
                        id) to edit its attributes here.
                    </p>
                ) : (
                    attributeKeys.map((key) => (
                        <AttributeField
                            key={key}
                            id={`pbta-pb-attribute-${key}`}
                            attribute={attributeDefinitions[key]}
                            value={playbook.attributes[key]}
                            onChange={(value) =>
                                setAttributes({
                                    ...playbook.attributes,
                                    [key]: value ?? '',
                                })
                            }
                        />
                    ))
                )}
            </div>
        </div>
    )
}
