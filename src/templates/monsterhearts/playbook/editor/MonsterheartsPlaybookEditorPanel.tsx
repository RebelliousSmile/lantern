import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
    if (sheet.target === 'moves')
        return <div className="space-y-2">{playbook.moves.map((move, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={move.checked === true} onCheckedChange={(checked) => setPlaybook({ moves: playbook.moves.map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) })} />{'ref' in move ? move.ref : move.name}</Label>
        ))}</div>
    if (sheet.target === 'advances')
        return <div className="space-y-2">{playbook.advances.map((entry, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={entry.checked === true} onCheckedChange={(checked) => setPlaybook({ advances: playbook.advances.map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) })} />{entry.label}</Label>
        ))}</div>
    if (sheet.target === 'advancement')
        return <div className="space-y-2">{(playbook.advancement ?? []).map((entry, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={entry.checked === true} onCheckedChange={(checked) => setPlaybook({ advancement: (playbook.advancement ?? []).map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) })} />{entry.label}</Label>
        ))}</div>
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
