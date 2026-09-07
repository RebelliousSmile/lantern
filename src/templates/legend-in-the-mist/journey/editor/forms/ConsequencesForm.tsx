import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLegendInTheMistJourneyStore } from '../../hooks'

/* The journey's own list: what the road can cost anywhere along it. A vignette
   keeps its own list, edited from VignettesForm, so this form never reaches
   into one. */
const PLACEHOLDERS = [
    'Someone in the party takes {tired-2}.',
    'The party loses a day and the weather turns.',
    'New Challenge: the ford has washed out and something waits at the crossing.',
]

export default function ConsequencesForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        legendInTheMistJourney,
        addConsequence,
        removeConsequenceAt,
        replaceConsequenceAt,
        moveConsequence,
    } = useLegendInTheMistJourneyStore()

    const consequences = legendInTheMistJourney.consequences

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [raw, setRaw] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Open the editor when the preview deep-links to one consequence
    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            consequences[focusIndex] != null
        ) {
            setEditingIndex(focusIndex)
            setRaw(consequences[focusIndex])
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    // Reaching this form from an empty list opens straight into a new entry
    useEffect(() => {
        if (autoCreate && !consequences.length) addPlaceholder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // IDs must stay unique even when two consequences read the same.
    const itemIds = useMemo(
        () => consequences.map((value, index) => `${index}::${value}`),
        [consequences]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] ?? -1)
        const to = Number(String(over.id).split('::')[0] ?? -1)
        if (from >= 0 && to >= 0 && from !== to) moveConsequence(from, to)
    }

    const dragDisabled = editingIndex !== null

    function addPlaceholder() {
        const sample =
            PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
        const newIndex = consequences.length

        addConsequence(sample)
        setEditingIndex(newIndex)
        setRaw(sample)
        setError(null)
    }

    function startEdit(index: number) {
        const value = consequences[index]
        if (value == null) return

        setEditingIndex(index)
        setRaw(value)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setRaw('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return

        const next = raw.trim()
        if (!next) {
            setError('A consequence needs some text.')
            return
        }

        replaceConsequenceAt(editingIndex, next)
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    General consequences
                </p>
                <p className="text-xs text-muted-foreground">
                    What the road can cost anywhere.
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={itemIds}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-1.5">
                        {consequences.map((value, index) => (
                            <SortableConsequenceItem
                                key={itemIds[index]}
                                id={itemIds[index]}
                                value={value}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeConsequenceAt(index)}
                            >
                                {editingIndex === index && (
                                    <div className="mt-2 space-y-2.5 rounded-md border bg-muted/30 p-2.5">
                                        {error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )}
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`journey-consequence-${index}`}
                                                className="text-xs"
                                            >
                                                Consequence
                                            </Label>
                                            <Textarea
                                                id={`journey-consequence-${index}`}
                                                className="min-h-20 text-sm"
                                                value={raw}
                                                onChange={(event) =>
                                                    setRaw(event.target.value)
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === 'Escape'
                                                    ) {
                                                        event.preventDefault()
                                                        cancelEdit()
                                                    }
                                                }}
                                                placeholder="Someone in the party takes {tired-2}."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Opening with{' '}
                                                <em>New Challenge:</em> prints
                                                that prefix in bold.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="h-7 px-2.5 text-xs"
                                                onClick={confirmEdit}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="h-7 px-0 text-xs"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </SortableConsequenceItem>
                        ))}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" /> Add consequence
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableConsequenceItem({
    id,
    value,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    value: string
    dragDisabled: boolean
    onEdit: () => void
    onRemove: () => void
    children?: React.ReactNode
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: dragDisabled })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`max-w-full rounded-md border bg-white px-2.5 py-1.5 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                    <button
                        type="button"
                        className={`inline-flex h-7 w-7 items-center justify-center rounded hover:bg-slate-50
              ${
                  dragDisabled
                      ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                      : 'cursor-grab active:cursor-grabbing'
              }`}
                        aria-label="Drag to reorder"
                        title={
                            dragDisabled
                                ? 'Finish editing to reorder'
                                : 'Drag to reorder'
                        }
                        disabled={dragDisabled}
                        {...(!dragDisabled ? attributes : {})}
                        {...(!dragDisabled ? listeners : {})}
                    >
                        <GripVertical className="h-3.5 w-3.5 text-slate-500" />
                    </button>

                    <span
                        className="min-w-0 text-sm leading-6 text-wrap"
                        title={value}
                    >
                        {value}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onEdit}
                        title="Edit"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={onRemove}
                        title="Remove"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {children}
        </li>
    )
}
