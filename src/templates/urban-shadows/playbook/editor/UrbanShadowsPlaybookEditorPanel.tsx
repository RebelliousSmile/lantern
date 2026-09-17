import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGameDefinitionForGame } from '@/templates/pbta/shared/gameDefinition'
import { StructuredJsonEditor } from '@/templates/shared/StructuredJsonEditor'
import {
    useUrbanShadowsPlaybookStore,
    useUrbanShadowsSheetStore,
} from '../hooks'
export function UrbanShadowsPlaybookEditorPanel() {
    const { open, target } = useUrbanShadowsSheetStore()
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    const game = useGameDefinitionForGame(playbook.game)
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                Click a sheet section to edit it.
            </p>
        )
    if (!game)
        return (
            <Alert>
                <AlertTitle>Game definition required</AlertTitle>
                <AlertDescription>
                    Open the matching Urban Shadows game definition tab before
                    editing this playbook.
                </AlertDescription>
            </Alert>
        )
    if (target.kind === 'basic')
        return (
            <div className="space-y-3">
                <Label>
                    Name
                    <Input
                        value={playbook.name}
                        onChange={(event) =>
                            setPlaybook({ name: event.target.value })
                        }
                    />
                </Label>
                <Label>
                    Description
                    <Textarea
                        value={playbook.description}
                        onChange={(event) =>
                            setPlaybook({ description: event.target.value })
                        }
                    />
                </Label>
            </div>
        )
    const key =
        target.kind === 'relationships' ? 'mortalRelationships' : target.kind
    return (
        <StructuredJsonEditor
            id={`urban-shadows-${key}`}
            label={key}
            value={(playbook as Record<string, unknown>)[key]}
            onValidValue={(value) =>
                setPlaybook({ [key]: value } as Partial<typeof playbook>)
            }
        />
    )
}
