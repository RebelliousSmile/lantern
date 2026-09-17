import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StructuredJsonEditor } from '@/templates/shared/StructuredJsonEditor'
import { useMonsterheartsSheet, useMonsterheartsStore } from '../hooks'

export function MonsterheartsPlaybookEditorPanel() {
    const { sheet } = useMonsterheartsSheet()
    const { playbook, setPlaybook } = useMonsterheartsStore()
    if (!sheet.open || !sheet.target)
        return (
            <p className="text-sm text-muted-foreground">
                Click a skin section to edit it.
            </p>
        )
    if (sheet.target === 'basic')
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
    const key = sheet.target
    return (
        <StructuredJsonEditor
            id={`monsterhearts-${key}`}
            label={key}
            value={(playbook as Record<string, unknown>)[key]}
            onValidValue={(value) =>
                setPlaybook({ [key]: value } as Partial<typeof playbook>)
            }
        />
    )
}
