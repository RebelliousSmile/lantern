import { SystemMarkdownScope } from '@/components/markdown/SystemMarkdownScope'
import { renderLitmMarkdown } from '@/utils/markdown'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useOtherscapeChallengeStore } from '../../hooks'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Check, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react'

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
   General Consequences
   The outcomes the Challenge hands out whatever Threat is running, kept apart
   from the list a single Threat carries so editing one never touches the other.
---------------------------------------------------------------------------- */

const DEFAULT_CONSEQUENCE = 'Describe a consequence.'

export default function ConsequencesForm({
    focusIndex,
}: {
    focusIndex?: number
}) {
    const {
        otherscapeChallenge,
        addGeneralConsequence,
        updateGeneralConsequence,
        removeGeneralConsequence,
        moveGeneralConsequence,
    } = useOtherscapeChallengeStore()

    const consequences = otherscapeChallenge.general_consequences

    const [editing, setEditing] = useState<number | null>(null)
    const [draft, setDraft] = useState('')

    // Deep-link from the card to the consequence that was clicked.
    useEffect(() => {
        if (typeof focusIndex === 'number' && consequences[focusIndex]) {
            setEditing(focusIndex)
            setDraft(consequences[focusIndex])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const dragDisabled = editing !== null

    const ids = useMemo(
        () => consequences.map((_, index) => `gc:${index}`),
        [consequences]
    )

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split(':')[1] ?? -1)
        const to = Number(String(over.id).split(':')[1] ?? -1)
        if (from >= 0 && to >= 0 && from !== to)
            moveGeneralConsequence(from, to)
    }

    function addPlaceholder() {
        addGeneralConsequence(DEFAULT_CONSEQUENCE)
        setEditing(consequences.length) // the row the new entry lands on
        setDraft(DEFAULT_CONSEQUENCE)
    }

    function startEdit(index: number, text: string) {
        setEditing(index)
        setDraft(text)
    }

    function cancelEdit() {
        setEditing(null)
        setDraft('')
    }

    function save() {
        if (editing == null) return
        const next = draft.trim()
        if (!next) {
            toast.error('Consequence cannot be empty.')
            return
        }

        updateGeneralConsequence(editing, next)
        cancelEdit()
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    What the Challenge costs the Crew whatever Threat is
                    running. A Threat with consequences of its own keeps them in
                    the Threats form.
                </p>

                <SortableContext
                    items={ids}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-1.5">
                        {consequences.map((text, index) => {
                            const isEditing = editing === index
                            return (
                                <ConsequenceRow
                                    key={ids[index]}
                                    id={ids[index]}
                                    text={text}
                                    dragDisabled={dragDisabled}
                                    isEditing={isEditing}
                                    onEdit={() => startEdit(index, text)}
                                    onRemove={() =>
                                        removeGeneralConsequence(index)
                                    }
                                >
                                    {isEditing && (
                                        <InlineConsequenceEditor
                                            value={draft}
                                            onChange={setDraft}
                                            onSave={save}
                                            onCancel={cancelEdit}
                                        />
                                    )}
                                </ConsequenceRow>
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
                                <Plus className="h-3.5 w-3.5" /> Add general
                                consequence
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </div>
        </DndContext>
    )
}

function ConsequenceRow({
    id,
    text,
    dragDisabled,
    isEditing,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    text: string
    dragDisabled: boolean
    isEditing: boolean
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
            className={`flex items-center justify-between gap-1.5 rounded-md border bg-white px-2.5 py-1.5 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <button
                    className={`inline-flex h-7 w-7 items-center justify-center rounded hover:bg-slate-50
            ${dragDisabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : 'cursor-grab active:cursor-grabbing'}`}
                    aria-label="Drag to reorder consequence"
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

                {isEditing ? (
                    <div className="min-w-0 flex-1">{children}</div>
                ) : (
                    <SystemMarkdownScope
                        className="min-w-0 flex-1 prose-sm max-w-none text-foreground/90"
                        as="div"
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(text),
                            }}
                        />
                    </SystemMarkdownScope>
                )}
            </div>

            {!isEditing ? (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7"
                    title="Edit"
                    onClick={onEdit}
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
            ) : null}
            <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 text-destructive"
                title="Remove"
                onClick={onRemove}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </li>
    )
}

function InlineConsequenceEditor({
    value,
    onChange,
    onSave,
    onCancel,
}: {
    value: string
    onChange: (next: string) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="flex items-center gap-1.5">
            <Input
                className="h-8 flex-1 px-2 text-sm"
                autoFocus
                value={value}
                onChange={(event) =>
                    onChange((event.target as HTMLInputElement).value)
                }
                onKeyDown={(event) => {
                    if (event.key === 'Enter') onSave()
                    if (event.key === 'Escape') onCancel()
                }}
            />
            <Button
                size="icon-xs"
                className="h-5 w-5 shrink-0"
                title="Save"
                onClick={onSave}
            >
                <Check className="h-3 w-3" />
            </Button>
            <Button
                size="icon-xs"
                variant="secondary"
                className="h-5 w-5 shrink-0"
                title="Cancel"
                onClick={onCancel}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    )
}
