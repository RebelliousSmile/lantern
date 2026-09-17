import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Check, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Threat } from '../../model'
import { ThreatRow } from './threatEditorPrimitives'

const DESCRIPTION_LIMIT = 100

export function ThreatListPanel({
    threats,
    threatIds,
    editingThreat,
    dragDisabled,
    onAdd,
    onSave,
    onCancel,
    onEdit,
    onRemove,
    onOpenConsequences,
    onOpenGeneral,
}: {
    threats: Threat[]
    threatIds: string[]
    editingThreat: number | null
    dragDisabled: boolean
    onAdd: () => void
    onSave: (
        index: number,
        threat: Pick<Threat, 'name' | 'description'>
    ) => void
    onCancel: () => void
    onEdit: (index: number) => void
    onRemove: (index: number) => void
    onOpenConsequences: (index: number) => void
    onOpenGeneral: () => void
}) {
    const editing = editingThreat === null ? null : threats[editingThreat]
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        setName(editing?.name ?? '')
        setDescription(editing?.description ?? '')
        setError(null)
    }, [editing])
    function save() {
        if (editingThreat === null) return
        const nextName = name.trim()
        const nextDescription = description.trim()
        if (!nextName) return setError('Threat name is required.')
        if (!nextDescription) return setError('Threat description is required.')
        onSave(editingThreat, { name: nextName, description: nextDescription })
    }
    return (
        <div className="min-w-0 w-full pr-2">
            <SortableContext
                items={threatIds}
                strategy={verticalListSortingStrategy}
            >
                <ul className="space-y-2">
                    {threats.map((threat, index) => (
                        <ThreatRow
                            key={threatIds[index]}
                            id={threatIds[index]}
                            name={threat.name}
                            description={threat.description}
                            count={threat.consequences.length}
                            dragDisabled={dragDisabled}
                            onEdit={() => onEdit(index)}
                            onRemove={() => onRemove(index)}
                            onOpenConsequences={() => onOpenConsequences(index)}
                        >
                            {editingThreat === index ? (
                                <ThreatEditor
                                    index={index}
                                    name={name}
                                    description={description}
                                    error={error}
                                    onNameChange={setName}
                                    onDescriptionChange={setDescription}
                                    onSave={save}
                                    onCancel={onCancel}
                                />
                            ) : null}
                        </ThreatRow>
                    ))}
                    <li className="flex">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                            onClick={onAdd}
                        >
                            <Plus className="h-3.5 w-3.5" /> Add threat
                        </Button>
                    </li>
                </ul>
            </SortableContext>
            <div className="mt-4 flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={onOpenGeneral}
                >
                    Edit general consequences
                </Button>
            </div>
        </div>
    )
}

function ThreatEditor({
    index,
    name,
    description,
    error,
    onNameChange,
    onDescriptionChange,
    onSave,
    onCancel,
}: {
    index: number
    name: string
    description: string
    error: string | null
    onNameChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="mt-2 space-y-2.5 rounded-md border bg-muted/30 p-2.5">
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="grid gap-1">
                <Label htmlFor={`t-name-${index}`} className="text-xs">
                    Name
                </Label>
                <Input
                    id={`t-name-${index}`}
                    className="h-8 px-2 text-sm"
                    value={name}
                    onChange={(event) => onNameChange(event.target.value)}
                    autoFocus
                />
            </div>
            <div className="grid gap-1">
                <Label htmlFor={`t-desc-${index}`} className="text-xs">
                    Short description{' '}
                    <span className="text-muted-foreground">
                        (Markdown + tokens)
                    </span>
                </Label>
                <Textarea
                    id={`t-desc-${index}`}
                    rows={2}
                    className="min-h-16 px-2 py-1 text-sm"
                    value={description}
                    onChange={(event) =>
                        onDescriptionChange(event.target.value)
                    }
                    placeholder="What the challenge starts to do…"
                    maxLength={DESCRIPTION_LIMIT}
                />
                <div className="text-[11px] text-muted-foreground">
                    {description.trim().length}/{DESCRIPTION_LIMIT} characters
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    className="h-7 px-2.5 text-xs"
                    onClick={onSave}
                >
                    <Check className="mr-1 h-3.5 w-3.5" /> Save
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2.5 text-xs"
                    onClick={onCancel}
                >
                    <X className="mr-1 h-3.5 w-3.5" /> Cancel
                </Button>
            </div>
        </div>
    )
}
