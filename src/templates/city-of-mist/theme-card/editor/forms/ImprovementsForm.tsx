import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useCityOfMistThemeCardStore, type Improvement } from '../../hooks'

const NEW_IMPROVEMENT: Improvement = {
    name: 'New improvement',
    effect: '',
    is_taken: false,
}

export default function ImprovementsForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        cityOfMistThemeCard,
        addImprovement,
        updateImprovementAt,
        removeImprovementAt,
        moveImprovement,
    } = useCityOfMistThemeCardStore()
    const improvements = cityOfMistThemeCard.improvements
    const ids = useMemo(
        () => improvements.map((item, index) => `${index}::${item.name}`),
        [improvements]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    )

    useEffect(() => {
        if (autoCreate && improvements.length === 0)
            addImprovement(NEW_IMPROVEMENT)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    function handleDragEnd(event: DragEndEvent) {
        if (!event.over || event.active.id === event.over.id) return
        const from = Number(String(event.active.id).split('::')[0])
        const to = Number(String(event.over.id).split('::')[0])
        if (Number.isInteger(from) && Number.isInteger(to))
            moveImprovement(from, to)
    }

    return (
        <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Improvements
            </p>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={ids}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-2">
                        {improvements.map((improvement, index) => (
                            <ImprovementRow
                                key={ids[index]}
                                id={ids[index]}
                                improvement={improvement}
                                highlighted={index === focusIndex}
                                onUpdate={(update) =>
                                    updateImprovementAt(index, update)
                                }
                                onRemove={() => removeImprovementAt(index)}
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
                onClick={() => addImprovement(NEW_IMPROVEMENT)}
            >
                <Plus className="h-3.5 w-3.5" /> Add improvement
            </Button>
        </div>
    )
}

function ImprovementRow({
    id,
    improvement,
    highlighted,
    onUpdate,
    onRemove,
}: {
    id: string
    improvement: Improvement
    highlighted: boolean
    onUpdate: (update: Partial<Improvement>) => void
    onRemove: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })
    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`rounded-md border p-2 ${highlighted ? 'ring-1 ring-primary' : ''} ${isDragging ? 'shadow-lg' : ''}`}
        >
            <div className="flex items-end gap-2">
                <button
                    type="button"
                    className="inline-flex h-8 w-7 cursor-grab items-center justify-center rounded hover:bg-muted"
                    aria-label="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <div className="grid min-w-0 flex-1 gap-1">
                    <Label htmlFor={`${id}-name`} className="text-xs">
                        Name
                    </Label>
                    <Input
                        id={`${id}-name`}
                        className="h-8 px-2 text-sm"
                        value={improvement.name}
                        onChange={(event) =>
                            onUpdate({ name: event.target.value })
                        }
                    />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    title="Remove"
                    onClick={onRemove}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
            <div className="mt-2 grid gap-1">
                <Label htmlFor={`${id}-effect`} className="text-xs">
                    Effect{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id={`${id}-effect`}
                    className="min-h-16 text-sm"
                    value={improvement.effect ?? ''}
                    onChange={(event) =>
                        onUpdate({ effect: event.target.value || undefined })
                    }
                />
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
                <Label htmlFor={`${id}-taken`} className="text-xs">
                    Taken
                </Label>
                <Switch
                    id={`${id}-taken`}
                    checked={improvement.is_taken}
                    onCheckedChange={(value) => onUpdate({ is_taken: !!value })}
                />
            </div>
        </li>
    )
}
