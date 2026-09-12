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
    useLegendInTheMistJourneyStore,
    type JourneyVignette,
} from '../../hooks'

/* A vignette is one moment of the journey: a name, what sets it off, and what
   it can cost. The schema refuses a vignette with no consequence, so a new one
   is seeded with a placeholder rather than created empty and exported broken. */
const PLACEHOLDERS: JourneyVignette[] = [
    {
        name: 'The drowned mile',
        trigger:
            'The road disappears under standing water for as far as anyone can see.',
        consequences: ['Someone loses their footing and takes {soaked-2}.'],
    },
    {
        name: 'A toll at the crossing',
        trigger: 'Someone has decided this bridge is theirs.',
        consequences: [
            'New Challenge: the toll keeper and whoever stands behind him.',
        ],
    },
    {
        name: 'Something keeping pace',
        trigger: '',
        consequences: ['The party arrives at the next stop {watched-3}.'],
    },
]

const CONSEQUENCE_PLACEHOLDER = 'What this moment costs when it goes badly.'

export default function VignettesForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        legendInTheMistJourney,
        addVignette,
        removeVignetteAt,
        replaceVignetteAt,
        moveVignette,
        addVignetteConsequence,
        removeVignetteConsequenceAt,
        replaceVignetteConsequenceAt,
        moveVignetteConsequence,
    } = useLegendInTheMistJourneyStore()

    const vignettes = legendInTheMistJourney.vignettes

    // One vignette open at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [trigger, setTrigger] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Open the editor when the preview deep-links to one vignette
    useEffect(() => {
        const vignette =
            typeof focusIndex === 'number' ? vignettes[focusIndex] : null
        if (vignette) {
            setEditingIndex(focusIndex as number)
            setName(vignette.name)
            setTrigger(vignette.trigger)
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    // Reaching this form from an empty list opens straight into a new entry
    useEffect(() => {
        if (autoCreate && !vignettes.length) addPlaceholder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // IDs must stay unique even when two vignettes read the same.
    const itemIds = useMemo(
        () => vignettes.map((vignette, index) => `${index}::${vignette.name}`),
        [vignettes]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] ?? -1)
        const to = Number(String(over.id).split('::')[0] ?? -1)
        if (from >= 0 && to >= 0 && from !== to) moveVignette(from, to)
    }

    const dragDisabled = editingIndex !== null

    function addPlaceholder() {
        const sample =
            PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
        const newIndex = vignettes.length

        addVignette({
            name: sample.name,
            trigger: sample.trigger,
            consequences: [...sample.consequences],
        })
        setEditingIndex(newIndex)
        setName(sample.name)
        setTrigger(sample.trigger)
        setError(null)
    }

    function startEdit(index: number) {
        const vignette = vignettes[index]
        if (!vignette) return

        setEditingIndex(index)
        setName(vignette.name)
        setTrigger(vignette.trigger)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setName('')
        setTrigger('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return

        const nextName = name.trim()
        if (!nextName) {
            setError('A vignette needs a name.')
            return
        }

        /* Consequences are read back from the store rather than from local
           state: the nested list below writes straight through, so anything
           held here would already be stale. */
        const current = vignettes[editingIndex]
        if (!current) return

        replaceVignetteAt(editingIndex, {
            name: nextName,
            trigger: trigger.trim(),
            consequences: current.consequences,
        })
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Vignettes
                </p>
                <p className="text-xs text-muted-foreground">
                    The moments this journey breaks down into.
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
                        {vignettes.map((vignette, index) => (
                            <SortableVignetteItem
                                key={itemIds[index]}
                                id={itemIds[index]}
                                vignette={vignette}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(index)}
                                onRemove={() => {
                                    removeVignetteAt(index)
                                    if (editingIndex === index) cancelEdit()
                                }}
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
                                                htmlFor={`journey-vignette-name-${index}`}
                                                className="text-xs"
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id={`journey-vignette-name-${index}`}
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
                                                placeholder="The drowned mile"
                                            />
                                        </div>

                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`journey-vignette-trigger-${index}`}
                                                className="text-xs"
                                            >
                                                Trigger{' '}
                                                <span className="text-muted-foreground">
                                                    (optional)
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={`journey-vignette-trigger-${index}`}
                                                className="min-h-20 text-sm"
                                                value={trigger}
                                                onChange={(event) =>
                                                    setTrigger(
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
                                                placeholder="What sets this moment off."
                                            />
                                        </div>

                                        <VignetteConsequences
                                            vignetteIndex={index}
                                            consequences={vignette.consequences}
                                            onAdd={addVignetteConsequence}
                                            onReplace={
                                                replaceVignetteConsequenceAt
                                            }
                                            onRemove={
                                                removeVignetteConsequenceAt
                                            }
                                            onMove={moveVignetteConsequence}
                                        />

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
                            </SortableVignetteItem>
                        ))}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" /> Add vignette
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- One vignette's consequences ----------
   Nested inside the open vignette, and addressed by that vignette's index, so
   editing here never reaches the journey-wide list or a neighbouring vignette.
   Writes go straight through rather than being staged: the name and trigger
   above are the only staged fields. */
function VignetteConsequences({
    vignetteIndex,
    consequences,
    onAdd,
    onReplace,
    onRemove,
    onMove,
}: {
    vignetteIndex: number
    consequences: string[]
    onAdd: (vignetteIndex: number, consequence: string) => void
    onReplace: (
        vignetteIndex: number,
        index: number,
        consequence: string
    ) => void
    onRemove: (vignetteIndex: number, index: number) => void
    onMove: (vignetteIndex: number, from: number, to: number) => void
}) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [raw, setRaw] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const itemIds = useMemo(
        () =>
            consequences.map(
                (value, index) => `${vignetteIndex}:${index}::${value}`
            ),
        [consequences, vignetteIndex]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0].split(':')[1])
        const to = Number(String(over.id).split('::')[0].split(':')[1])
        if (from >= 0 && to >= 0 && from !== to) {
            onMove(vignetteIndex, from, to)
        }
    }

    function confirmEdit() {
        if (editingIndex == null) return

        const next = raw.trim()
        if (!next) return

        onReplace(vignetteIndex, editingIndex, next)
        setEditingIndex(null)
        setRaw('')
    }

    return (
        <div className="space-y-1.5 rounded-md border bg-background p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Consequences
            </p>

            {!consequences.length && (
                <p className="text-xs text-destructive">
                    A vignette needs at least one consequence to export.
                </p>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={itemIds}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-1">
                        {consequences.map((value, index) => (
                            <SortableVignetteConsequenceItem
                                key={itemIds[index]}
                                id={itemIds[index]}
                                value={value}
                                dragDisabled={editingIndex !== null}
                                onEdit={() => {
                                    setEditingIndex(index)
                                    setRaw(value)
                                }}
                                onRemove={() => onRemove(vignetteIndex, index)}
                            >
                                {editingIndex === index && (
                                    <div className="mt-1.5 space-y-1.5">
                                        <Textarea
                                            id={`journey-vignette-${vignetteIndex}-consequence-${index}`}
                                            className="min-h-16 text-sm"
                                            value={raw}
                                            onChange={(event) =>
                                                setRaw(event.target.value)
                                            }
                                            onKeyDown={(event) => {
                                                if (event.key === 'Escape') {
                                                    event.preventDefault()
                                                    setEditingIndex(null)
                                                    setRaw('')
                                                }
                                            }}
                                            placeholder={
                                                CONSEQUENCE_PLACEHOLDER
                                            }
                                        />
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
                                                onClick={() => {
                                                    setEditingIndex(null)
                                                    setRaw('')
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </SortableVignetteConsequenceItem>
                        ))}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-7 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={() => {
                                    const index = consequences.length
                                    onAdd(
                                        vignetteIndex,
                                        CONSEQUENCE_PLACEHOLDER
                                    )
                                    setEditingIndex(index)
                                    setRaw(CONSEQUENCE_PLACEHOLDER)
                                }}
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

/* ---------- Sortable items ---------- */
function SortableVignetteItem({
    id,
    vignette,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    vignette: JourneyVignette
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

    const count = vignette.consequences.length

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
                        <span className="font-medium">{vignette.name}</span>
                        <span className="block text-xs text-muted-foreground">
                            {count === 1
                                ? '1 consequence'
                                : `${count} consequences`}
                            {vignette.trigger.trim() ? '' : ' · no trigger'}
                        </span>
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

function SortableVignetteConsequenceItem({
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
            className={`max-w-full rounded border bg-white px-2 py-1 ${
                isDragging ? 'shadow-md ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-1.5">
                    <button
                        type="button"
                        className={`inline-flex h-6 w-6 items-center justify-center rounded hover:bg-slate-50
              ${
                  dragDisabled
                      ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                      : 'cursor-grab active:cursor-grabbing'
              }`}
                        aria-label="Drag to reorder"
                        disabled={dragDisabled}
                        {...(!dragDisabled ? attributes : {})}
                        {...(!dragDisabled ? listeners : {})}
                    >
                        <GripVertical className="h-3 w-3 text-slate-500" />
                    </button>

                    <span
                        className="min-w-0 text-xs leading-5 text-wrap"
                        title={value}
                    >
                        {value}
                    </span>
                </div>

                <div className="flex items-center gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onEdit}
                        title="Edit"
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={onRemove}
                        title="Remove"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {children}
        </li>
    )
}
