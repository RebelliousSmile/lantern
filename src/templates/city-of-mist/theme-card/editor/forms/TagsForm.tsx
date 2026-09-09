import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useCityOfMistThemeCardStore } from '../../hooks'

type TagField = 'power' | 'weakness'

export default function TagsForm({ field, focusIndex, autoCreate }: { field: TagField; focusIndex?: number; autoCreate?: boolean }) {
    const { cityOfMistThemeCard, addTag, updateTagAt, removeTagAt, moveTag } =
        useCityOfMistThemeCardStore()
    const tags = field === 'power' ? cityOfMistThemeCard.power_tags : cityOfMistThemeCard.weakness_tags
    const ids = useMemo(() => tags.map((tag, index) => `${index}::${tag.text}`), [tags])
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        if (autoCreate && tags.length === 0) {
            addTag(field, field === 'power'
                ? { text: 'New power tag', is_burnt: false }
                : { text: 'New weakness tag', is_invoked: false })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate, field])

    function handleDragEnd(event: DragEndEvent) {
        if (!event.over || event.active.id === event.over.id) return
        const from = Number(String(event.active.id).split('::')[0])
        const to = Number(String(event.over.id).split('::')[0])
        if (Number.isInteger(from) && Number.isInteger(to)) moveTag(field, from, to)
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {field === 'power' ? 'Power tags' : 'Weakness tags'}
                </p>
                <p className="text-xs text-muted-foreground">Letters are optional for homebrew tags.</p>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                        {tags.map((tag, index) => (
                            <TagRow
                                key={ids[index]}
                                id={ids[index]}
                                field={field}
                                tag={tag}
                                highlighted={index === focusIndex}
                                onUpdate={(update) => updateTagAt(field, index, update)}
                                onRemove={() => removeTagAt(field, index)}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-full gap-1.5 border-dashed text-xs"
                onClick={() => addTag(field, field === 'power' ? { text: 'New power tag', is_burnt: false } : { text: 'New weakness tag', is_invoked: false })}
            >
                <Plus className="h-3.5 w-3.5" /> Add tag
            </Button>
            <p className="text-xs text-muted-foreground">
                During play, an extra power tag may temporarily exist before its matching weakness is added.
            </p>
        </div>
    )
}

function TagRow({ id, field, tag, highlighted, onUpdate, onRemove }: {
    id: string
    field: TagField
    tag: { text: string; letter?: string; is_burnt?: boolean; is_invoked?: boolean }
    highlighted: boolean
    onUpdate: (update: Record<string, unknown>) => void
    onRemove: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`rounded-md border p-2 ${highlighted ? 'ring-1 ring-primary' : ''} ${isDragging ? 'shadow-lg' : ''}`}
        >
            <div className="grid grid-cols-[auto_3.5rem_minmax(0,1fr)_auto] items-end gap-2">
                <button type="button" className="mb-0.5 inline-flex h-7 w-7 cursor-grab items-center justify-center rounded hover:bg-muted" aria-label="Drag to reorder" {...attributes} {...listeners}>
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <div className="grid gap-1">
                    <Label htmlFor={`${id}-letter`} className="text-xs">Letter</Label>
                    <Input
                        id={`${id}-letter`}
                        className="h-8 px-2 text-center text-sm uppercase"
                        maxLength={1}
                        value={tag.letter ?? ''}
                        onChange={(event) => {
                            const letter = event.target.value.toUpperCase().replace(/[^A-J]/g, '').slice(0, 1)
                            onUpdate({ letter: letter || undefined })
                        }}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor={`${id}-text`} className="text-xs">Tag</Label>
                    <Input id={`${id}-text`} className="h-8 px-2 text-sm" value={tag.text} onChange={(event) => onUpdate({ text: event.target.value })} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Remove" onClick={onRemove}>
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
                <Label htmlFor={`${id}-state`} className="text-xs">
                    {field === 'power' ? 'Burnt' : 'Invoked'}
                </Label>
                <Switch
                    id={`${id}-state`}
                    checked={field === 'power' ? !!tag.is_burnt : !!tag.is_invoked}
                    onCheckedChange={(value) => onUpdate(field === 'power' ? { is_burnt: !!value } : { is_invoked: !!value })}
                />
            </div>
        </li>
    )
}
