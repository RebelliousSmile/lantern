import { useEffect, useMemo, useState } from 'react'
import { useOtherscapeCharacterTropeStore } from '../../hooks'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'

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

/* ----------------------------------------------------------------------------
   Theme kits granted
   The kits the trope hands over. Same entry shape as the choices form, and a
   separate list: editing one never touches the other.
---------------------------------------------------------------------------- */

export default function ThemeKitsForm({ focusIndex }: { focusIndex?: number }) {
    const {
        otherscapeCharacterTrope,
        addThemeKit,
        updateThemeKitAt,
        removeThemeKitAt,
        moveThemeKit,
    } = useOtherscapeCharacterTropeStore()

    const themeKits = otherscapeCharacterTrope.theme_kits

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [eTitleTag, setETitleTag] = useState('')
    const [eCategory, setECategory] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Deep-link open from preview/sheet
    useEffect(() => {
        if (typeof focusIndex === 'number' && themeKits[focusIndex]) {
            startEdit(focusIndex)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Stable IDs for current render (index::title tag)
    const itemIds = useMemo(
        () =>
            themeKits.map(
                (kit, index) => `${index}::${kit.title_tag || 'theme-kit'}`
            ),
        [themeKits]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) moveThemeKit(from, to)
    }

    const dragDisabled = editingIndex !== null

    function uniquePlaceholderTitle(): string {
        const base = 'New Theme Kit'
        const used = new Set(
            themeKits.map((kit) => (kit.title_tag || '').toLowerCase())
        )
        if (!used.has(base.toLowerCase())) return base

        let n = 2
        while (used.has(`${base} ${n}`.toLowerCase())) n++
        return `${base} ${n}`
    }

    function addPlaceholder() {
        const placeholder = {
            title_tag: uniquePlaceholderTitle(),
            category: 'UNFILED',
        }
        const newIndex = themeKits.length
        addThemeKit(placeholder)
        // open inline editor for the new item
        setEditingIndex(newIndex)
        setETitleTag(placeholder.title_tag)
        setECategory(placeholder.category)
        setError(null)
    }

    function startEdit(index: number) {
        const kit = themeKits[index]
        if (!kit) return

        setEditingIndex(index)
        setETitleTag(kit.title_tag || '')
        setECategory(kit.category || '')
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setETitleTag('')
        setECategory('')
        setError(null)
    }

    function saveEdit() {
        if (editingIndex == null) return
        if (!eTitleTag.trim()) return setError('Title tag is required.')
        if (!eCategory.trim()) return setError('Category is required.')

        updateThemeKitAt(editingIndex, {
            title_tag: eTitleTag.trim(),
            category: eCategory.trim(),
        })
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground">
                The theme kits this trope grants outright. Spell the title tag
                and the category the way the kit itself spells them: that pair
                is what points at the kit.
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
                        {themeKits.map((kit, index) => (
                            <SortableThemeKitItem
                                key={itemIds[index]}
                                id={itemIds[index]}
                                titleTag={kit.title_tag}
                                category={kit.category}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeThemeKitAt(index)}
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
                                                htmlFor={`tk-title-${index}`}
                                                className="text-xs"
                                            >
                                                Title tag
                                            </Label>
                                            <Input
                                                id={`tk-title-${index}`}
                                                className="h-8 px-2 text-sm"
                                                value={eTitleTag}
                                                onChange={(event) =>
                                                    setETitleTag(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`tk-category-${index}`}
                                                className="text-xs"
                                            >
                                                Category
                                            </Label>
                                            <Input
                                                id={`tk-category-${index}`}
                                                className="h-8 px-2 text-sm"
                                                value={eCategory}
                                                onChange={(event) =>
                                                    setECategory(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="e.g., RITUAL"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="h-7 px-2.5 text-xs"
                                                onClick={saveEdit}
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
                            </SortableThemeKitItem>
                        ))}

                        {/* Add button row */}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" /> Add theme kit
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableThemeKitItem({
    id,
    titleTag,
    category,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    titleTag: string
    category: string
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
                <div className="flex min-w-0 items-center gap-2">
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

                    <div className="min-w-0">
                        <div className="truncate text-sm font-bold uppercase tracking-wider">
                            {titleTag}
                        </div>
                        <div className="truncate text-[11px] uppercase tracking-widest text-muted-foreground">
                            {category || 'No category'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Edit"
                        onClick={onEdit}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        title="Remove"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {children}
        </li>
    )
}
