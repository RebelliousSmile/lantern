import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
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
import { useMemo } from 'react'
import { useCityOfMistThemeKitStore, type Improvement } from '../../hooks'

const PRINTED_COUNT = 5
const BLANK: Improvement = { name: '', effect: '' }

export default function ImprovementsForm({
    focusIndex,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        cityOfMistThemeKit,
        addImprovement,
        setImprovementAt,
        removeImprovementAt,
        moveImprovement,
    } = useCityOfMistThemeKitStore()

    const improvements = cityOfMistThemeKit.improvements

    /* The books print five, so the form opens on five rows even when the
       document holds none. The extra rows are laid out here rather than written
       into the document, so an untouched themebook still exports; the first
       keystroke on a row is what brings it into existence. */
    const rowCount = Math.max(improvements.length, PRINTED_COUNT)
    const rows = useMemo(
        () =>
            Array.from({ length: rowCount }, (_, index) => ({
                id: `${index}::${improvements[index]?.name ?? ''}`,
                improvement: improvements[index] ?? BLANK,
                stored: index < improvements.length,
            })),
        [improvements, rowCount]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        if (!event.over || event.active.id === event.over.id) return
        const from = Number(String(event.active.id).split('::')[0])
        const to = Number(String(event.over.id).split('::')[0])
        if (Number.isInteger(from) && Number.isInteger(to)) {
            moveImprovement(from, to)
        }
    }

    return (
        <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Improvements
            </p>

            {improvements.length && improvements.length !== PRINTED_COUNT ? (
                <p className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                    Every themebook the books print carries five improvements;
                    this one carries {improvements.length}.
                </p>
            ) : null}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={rows.map((row) => row.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-2">
                        {rows.map((row, index) => (
                            <ImprovementRow
                                key={row.id}
                                id={row.id}
                                index={index}
                                improvement={row.improvement}
                                stored={row.stored}
                                highlighted={index === focusIndex}
                                onUpdate={(update) =>
                                    setImprovementAt(index, update)
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
                onClick={() => addImprovement(BLANK)}
            >
                <Plus className="h-3.5 w-3.5" /> Add improvement
            </Button>
        </div>
    )
}

function ImprovementRow({
    id,
    index,
    improvement,
    stored,
    highlighted,
    onUpdate,
    onRemove,
}: {
    id: string
    index: number
    improvement: Improvement
    stored: boolean
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
    } = useSortable({ id, disabled: !stored })

    return (
        <li
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`rounded-md border p-2 ${highlighted ? 'ring-1 ring-primary' : ''} ${isDragging ? 'shadow-lg' : ''} ${stored ? '' : 'border-dashed'}`}
        >
            <div className="flex items-end gap-2">
                <button
                    type="button"
                    className="inline-flex h-8 w-7 cursor-grab items-center justify-center rounded hover:bg-muted disabled:cursor-default disabled:opacity-40"
                    aria-label="Drag to reorder"
                    disabled={!stored}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <div className="grid min-w-0 flex-1 gap-1">
                    <Label htmlFor={`${id}-name`} className="text-xs">
                        Improvement {index + 1}
                    </Label>
                    <Input
                        id={`${id}-name`}
                        className="h-8 px-2 text-sm"
                        value={improvement.name}
                        onChange={(event) =>
                            onUpdate({ name: event.target.value })
                        }
                        placeholder="Second Sight"
                    />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    title="Remove"
                    disabled={!stored}
                    onClick={onRemove}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
            <div className="mt-2 grid gap-1 pl-9">
                <Label htmlFor={`${id}-effect`} className="text-xs">
                    Effect
                </Label>
                <Textarea
                    id={`${id}-effect`}
                    className="min-h-16 text-sm"
                    value={improvement.effect}
                    onChange={(event) =>
                        onUpdate({ effect: event.target.value })
                    }
                    placeholder="Take an additional power tag for this theme."
                />
            </div>
        </li>
    )
}
