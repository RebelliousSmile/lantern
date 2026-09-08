import { SystemMarkdownScope } from '@/components/markdown/SystemMarkdownScope'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { renderLitmInline } from '@/utils/markdown'
import { formatPower, formatWeakness } from '@/utils/tags'
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
import { useOtherscapeLoadoutItemStore, type TagField } from '../../hooks'
import { NAME_TAG_INDEX, featureTagsAfterName } from '../../model'

const FEATURE_PLACEHOLDERS = [
    'subvocal, so nobody hears you talk',
    'paints a target for a friend',
    'reads as medical hardware on a scan',
]

const WEAKNESS_PLACEHOLDER = 'still answers to the factory handshake'

/* The two fields are not two instances of one list: features are an ordered run
   whose first entry is the item's name, and the weakness is a single slot. They
   are dispatched here rather than reconciled, so neither has to carry the
   other's shape. */
export default function TagsForm({
    field,
    focusIndex,
    autoCreate,
}: {
    field: TagField
    focusIndex?: number
    autoCreate?: boolean
}) {
    if (field === 'weakness') return <WeaknessTagForm />

    return <FeatureTagsForm focusIndex={focusIndex} autoCreate={autoCreate} />
}

/* ---------- Weakness: one slot ---------- */
function WeaknessTagForm() {
    const { otherscapeLoadoutItem, setWeaknessTag } =
        useOtherscapeLoadoutItemStore()

    return (
        <div className="space-y-2.5">
            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-weakness-tag">
                    Weakness tag{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="os-loadout-item-weakness-tag"
                    className="h-8 px-2 text-sm"
                    value={otherscapeLoadoutItem.weakness_tag}
                    onChange={(event) => setWeaknessTag(event.target.value)}
                    placeholder={WEAKNESS_PLACEHOLDER}
                />
                <p className="text-xs text-muted-foreground">
                    The one tag this item turns against its bearer. Write it
                    bare: the card adds the braces and the marker. Emptying the
                    field leaves the item with no weakness, which a few catalog
                    entries do.
                </p>
            </div>

            {otherscapeLoadoutItem.weakness_tag.trim() && (
                <SystemMarkdownScope className="text-sm leading-6" as="div">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: renderLitmInline(
                                formatWeakness(
                                    otherscapeLoadoutItem.weakness_tag
                                )
                            ),
                        }}
                    />
                </SystemMarkdownScope>
            )}
        </div>
    )
}

/* ---------- Features: the ordered run ---------- */
function FeatureTagsForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        otherscapeLoadoutItem,
        addTag,
        removeTagAt,
        replaceTagAt,
        moveTag,
    } = useOtherscapeLoadoutItemStore()

    /* The name holds the first slot and is edited in the basic form, so the
       list starts after it. Every index handed to the store is the document's
       own, which is why the offset is added back rather than the list being
       renumbered. */
    const tags = featureTagsAfterName(otherscapeLoadoutItem)
    const absolute = (offset: number) => NAME_TAG_INDEX + 1 + offset

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [raw, setRaw] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Open the editor when the preview deep-links to one tag
    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            otherscapeLoadoutItem.feature_tags[focusIndex] != null
        ) {
            setEditingIndex(focusIndex)
            setRaw(otherscapeLoadoutItem.feature_tags[focusIndex])
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    // Reaching this form from an empty run opens straight into a new entry
    useEffect(() => {
        if (autoCreate && !tags.length) addPlaceholder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // IDs must stay unique even when two tags read the same.
    const itemIds = useMemo(
        () => tags.map((value, offset) => `${absolute(offset)}::${value}`),
        [tags]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) moveTag(from, to)
    }

    const dragDisabled = editingIndex !== null

    function addPlaceholder() {
        const sample =
            FEATURE_PLACEHOLDERS[
                Math.floor(Math.random() * FEATURE_PLACEHOLDERS.length)
            ]

        addTag(sample)
        setEditingIndex(otherscapeLoadoutItem.feature_tags.length)
        setRaw(sample)
        setError(null)
    }

    function startEdit(index: number) {
        const value = otherscapeLoadoutItem.feature_tags[index]
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
            setError('Please enter a value.')
            return
        }

        replaceTagAt(editingIndex, next)
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Feature tags
                </p>
                <p className="text-xs text-muted-foreground">
                    Write tags bare, without braces.
                </p>
            </div>

            <p className="text-xs text-muted-foreground">
                The catalog opens the list with the item's name, so{' '}
                <span className="font-medium">
                    {otherscapeLoadoutItem.name || 'the name'}
                </span>{' '}
                holds the first slot and is edited with the name itself. What
                follows is listed here.
            </p>

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
                        {tags.map((value, offset) => {
                            const index = absolute(offset)

                            return (
                                <SortableTagItem
                                    key={itemIds[offset]}
                                    id={itemIds[offset]}
                                    value={value}
                                    dragDisabled={dragDisabled}
                                    onEdit={() => startEdit(index)}
                                    onRemove={() => removeTagAt(index)}
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
                                                    htmlFor={`os-loadout-item-tag-feature-${index}`}
                                                    className="text-xs"
                                                >
                                                    Tag
                                                </Label>
                                                <Input
                                                    id={`os-loadout-item-tag-feature-${index}`}
                                                    className="h-8 px-2 text-sm"
                                                    value={raw}
                                                    onChange={(event) =>
                                                        setRaw(
                                                            event.target.value
                                                        )
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key ===
                                                            'Enter'
                                                        ) {
                                                            event.preventDefault()
                                                            confirmEdit()
                                                        }
                                                        if (
                                                            event.key ===
                                                            'Escape'
                                                        ) {
                                                            event.preventDefault()
                                                            cancelEdit()
                                                        }
                                                    }}
                                                    placeholder="subvocal, so nobody hears you talk"
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
                                </SortableTagItem>
                            )
                        })}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" /> Add tag
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableTagItem({
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

                    <SystemMarkdownScope
                        className="min-w-0 text-sm leading-6"
                        as="div"
                    >
                        <span
                            className="block max-w-none text-wrap"
                            dangerouslySetInnerHTML={{
                                __html: renderLitmInline(formatPower(value)),
                            }}
                            title={value}
                        />
                    </SystemMarkdownScope>
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
