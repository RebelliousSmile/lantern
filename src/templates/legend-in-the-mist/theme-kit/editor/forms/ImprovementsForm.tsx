import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
    useLegendInTheMistThemeKitStore,
    type ThemeKitImprovement,
} from '../../hooks'

const PLACEHOLDERS: ThemeKitImprovement[] = [
    {
        name: 'Second Sight',
        effect: 'Add a power tag describing what the spirits let you see.',
    },
    {
        name: 'Old Debts',
        effect: 'Someone in every village owes you a kindness, and remembers it.',
    },
    {
        name: 'Steady Under Fire',
        effect: 'Once per session, treat a failure to hold your nerve as a partial success.',
    },
]

export default function ImprovementsForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        legendInTheMistThemeKit,
        addImprovement,
        removeImprovementAt,
        replaceImprovementAt,
        moveImprovement,
    } = useLegendInTheMistThemeKitStore()

    const improvements = legendInTheMistThemeKit.improvements

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [effect, setEffect] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Open the editor when the preview deep-links to one improvement
    useEffect(() => {
        const improvement =
            typeof focusIndex === 'number' ? improvements[focusIndex] : null
        if (improvement) {
            setEditingIndex(focusIndex as number)
            setName(improvement.name)
            setEffect(improvement.effect ?? '')
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    // Reaching this form from an empty list opens straight into a new entry
    useEffect(() => {
        if (autoCreate && !improvements.length) addPlaceholder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // IDs must stay unique even when two improvements read the same.
    const itemIds = useMemo(
        () =>
            improvements.map(
                (improvement, index) => `${index}::${improvement.name}`
            ),
        [improvements]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] ?? -1)
        const to = Number(String(over.id).split('::')[0] ?? -1)
        if (from >= 0 && to >= 0 && from !== to) moveImprovement(from, to)
    }

    const dragDisabled = editingIndex !== null

    function addPlaceholder() {
        const sample =
            PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
        const newIndex = improvements.length

        addImprovement(sample)
        setEditingIndex(newIndex)
        setName(sample.name)
        setEffect(sample.effect ?? '')
        setError(null)
    }

    function startEdit(index: number) {
        const improvement = improvements[index]
        if (!improvement) return

        setEditingIndex(index)
        setName(improvement.name)
        setEffect(improvement.effect ?? '')
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setName('')
        setEffect('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return

        const nextName = name.trim()
        if (!nextName) {
            setError('An improvement needs a name.')
            return
        }

        // An effect left empty is dropped rather than stored as an empty
        // string: some themebooks print the label alone.
        replaceImprovementAt(editingIndex, {
            name: nextName,
            effect: effect.trim() || undefined,
        })
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Improvements
                </p>
                <p className="text-xs text-muted-foreground">
                    The options this kit offers.
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
                        {improvements.map((improvement, index) => (
                            <SortableImprovementItem
                                key={itemIds[index]}
                                id={itemIds[index]}
                                improvement={improvement}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeImprovementAt(index)}
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
                                                htmlFor={`theme-kit-improvement-name-${index}`}
                                                className="text-xs"
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id={`theme-kit-improvement-name-${index}`}
                                                className="h-8 px-2 text-sm"
                                                value={name}
                                                onChange={(event) =>
                                                    setName(event.target.value)
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault()
                                                        confirmEdit()
                                                    }
                                                    if (
                                                        event.key === 'Escape'
                                                    ) {
                                                        event.preventDefault()
                                                        cancelEdit()
                                                    }
                                                }}
                                                placeholder="Second Sight"
                                            />
                                        </div>

                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`theme-kit-improvement-effect-${index}`}
                                                className="text-xs"
                                            >
                                                Effect{' '}
                                                <span className="text-muted-foreground">
                                                    (optional)
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={`theme-kit-improvement-effect-${index}`}
                                                className="min-h-20 text-sm"
                                                value={effect}
                                                onChange={(event) =>
                                                    setEffect(
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === 'Escape'
                                                    ) {
                                                        event.preventDefault()
                                                        cancelEdit()
                                                    }
                                                }}
                                                placeholder="What the improvement lets the hero do."
                                            />
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
                            </SortableImprovementItem>
                        ))}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" /> Add improvement
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableImprovementItem({
    id,
    improvement,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    improvement: ThemeKitImprovement
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

                    <div className="min-w-0 text-sm leading-6">
                        <span className="font-medium">{improvement.name}</span>
                        {improvement.effect && improvement.effect.trim() ? (
                            <span className="block text-xs text-muted-foreground">
                                {improvement.effect}
                            </span>
                        ) : (
                            <span className="block text-xs italic text-muted-foreground">
                                no effect written
                            </span>
                        )}
                    </div>
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
