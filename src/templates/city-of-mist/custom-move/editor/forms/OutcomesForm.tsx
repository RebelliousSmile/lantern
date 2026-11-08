import { SystemMarkdownScope } from '@/components/markdown/SystemMarkdownScope'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { renderSystemMarkdownInline } from '@/utils/markdown'
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
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useCityOfMistCustomMoveStore, type OutcomeTier } from '../../hooks'

const TIERS: { value: OutcomeTier; label: TranslationKey }[] = [
    { value: 'miss', label: 'city:forms.customMove.outcomes.tierMiss' },
    { value: '7-9', label: 'city:forms.customMove.outcomes.tier7to9' },
    { value: '10+', label: 'city:forms.customMove.outcomes.tier10plus' },
    { value: '12+', label: 'city:forms.customMove.outcomes.tier12plus' },
    { value: 'hit', label: 'city:forms.customMove.outcomes.tierHit' },
]

const DEFAULT_OUTCOME = {
    tier: 'hit' as OutcomeTier,
    text: 'Describe what happens.',
}

export default function OutcomesForm({ focusIndex }: { focusIndex?: number }) {
    const ui = useUiText()
    const {
        cityOfMistCustomMove,
        addOutcome,
        updateOutcomeAt,
        removeOutcomeAt,
        moveOutcome,
    } = useCityOfMistCustomMoveStore()

    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [tier, setTier] = useState<OutcomeTier>(DEFAULT_OUTCOME.tier)
    const [text, setText] = useState(DEFAULT_OUTCOME.text)
    const [options, setOptions] = useState('')
    const [pickCount, setPickCount] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            cityOfMistCustomMove.outcomes[focusIndex]
        ) {
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

    const itemIds = useMemo(
        () =>
            cityOfMistCustomMove.outcomes.map(
                (outcome, index) => `${index}:${outcome.tier}`
            ),
        [cityOfMistCustomMove.outcomes]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split(':')[0] || -1)
        const to = Number(String(over.id).split(':')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) {
            moveOutcome(from, to)
        }
    }

    function addPlaceholder() {
        const index = cityOfMistCustomMove.outcomes.length
        addOutcome(DEFAULT_OUTCOME)
        setEditingIndex(index)
        setTier(DEFAULT_OUTCOME.tier)
        setText(DEFAULT_OUTCOME.text)
        setOptions('')
        setPickCount('')
        setError(null)
    }

    function startEdit(index: number) {
        const outcome = cityOfMistCustomMove.outcomes[index]
        if (!outcome) return
        setEditingIndex(index)
        setTier(outcome.tier)
        setText(outcome.text)
        setOptions((outcome.options ?? []).join('\n'))
        setPickCount(outcome.pick_count ? String(outcome.pick_count) : '')
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setTier(DEFAULT_OUTCOME.tier)
        setText(DEFAULT_OUTCOME.text)
        setOptions('')
        setPickCount('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const trimmedText = text.trim()
        if (!trimmedText) {
            setError(ui('city:forms.customMove.outcomes.errorTextRequired'))
            return
        }

        // One option per line: the list is short and written in prose, so a
        // textarea reads better here than a row of inputs.
        const parsedOptions = options
            .split('\n')
            .map((option) => option.trim())
            .filter(Boolean)
        const parsedPickCount = Math.max(0, Math.floor(Number(pickCount) || 0))

        updateOutcomeAt(editingIndex, {
            tier,
            text: trimmedText,
            options: parsedOptions.length ? parsedOptions : undefined,
            pick_count: parsedPickCount > 0 ? parsedPickCount : undefined,
        })
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
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
                        {cityOfMistCustomMove.outcomes.map((outcome, index) => (
                            <SortableOutcomeRow
                                key={itemIds[index]}
                                id={itemIds[index]}
                                tier={outcome.tier}
                                text={outcome.text}
                                optionCount={outcome.options?.length ?? 0}
                                dragDisabled={editingIndex !== null}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeOutcomeAt(index)}
                            >
                                {editingIndex === index ? (
                                    <div className="mt-2 space-y-2.5 rounded-md border bg-muted/30 p-2.5">
                                        {error ? (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        ) : null}
                                        <div className="grid gap-1">
                                            <Label className="text-xs">
                                                {ui(
                                                    'city:forms.customMove.outcomes.tierLabel'
                                                )}
                                            </Label>
                                            <div className="grid grid-cols-5 overflow-hidden rounded-md border">
                                                {TIERS.map((entry) => (
                                                    <Button
                                                        key={entry.value}
                                                        type="button"
                                                        variant={
                                                            tier === entry.value
                                                                ? 'default'
                                                                : 'ghost'
                                                        }
                                                        className={cn(
                                                            'h-8 rounded-none border-none px-2 text-xs',
                                                            tier === entry.value
                                                                ? ''
                                                                : 'bg-background'
                                                        )}
                                                        onClick={() =>
                                                            setTier(entry.value)
                                                        }
                                                    >
                                                        {ui(entry.label)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`outcome-text-${index}`}
                                                className="text-xs"
                                            >
                                                {ui(
                                                    'city:forms.customMove.outcomes.textLabel'
                                                )}
                                            </Label>
                                            <Textarea
                                                id={`outcome-text-${index}`}
                                                rows={4}
                                                className="min-h-20 px-2 py-1 text-sm"
                                                value={text}
                                                onChange={(event) =>
                                                    setText(event.target.value)
                                                }
                                                placeholder={ui(
                                                    'city:forms.customMove.outcomes.textPlaceholder'
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`outcome-options-${index}`}
                                                className="text-xs"
                                            >
                                                {ui(
                                                    'city:forms.customMove.outcomes.optionsLabel'
                                                )}{' '}
                                                <span className="text-muted-foreground">
                                                    {ui(
                                                        'city:forms.shared.meta.optional'
                                                    )}
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={`outcome-options-${index}`}
                                                rows={4}
                                                className="min-h-20 px-2 py-1 text-sm"
                                                value={options}
                                                onChange={(event) =>
                                                    setOptions(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={ui(
                                                    'city:forms.customMove.outcomes.optionsPlaceholder'
                                                )}
                                            />
                                        </div>
                                        <div className="grid w-[120px] gap-1">
                                            <Label
                                                htmlFor={`outcome-pick-${index}`}
                                                className="text-xs"
                                            >
                                                {ui(
                                                    'city:forms.customMove.outcomes.pickCountLabel'
                                                )}
                                            </Label>
                                            <Input
                                                id={`outcome-pick-${index}`}
                                                className="h-8 px-2 text-sm"
                                                type="number"
                                                min={0}
                                                value={pickCount}
                                                onChange={(event) =>
                                                    setPickCount(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="h-7 px-2.5 text-xs"
                                                onClick={confirmEdit}
                                            >
                                                {ui('actions.save')}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="h-7 px-0 text-xs"
                                                onClick={cancelEdit}
                                            >
                                                {ui('actions.cancel')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </SortableOutcomeRow>
                        ))}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                {ui('city:forms.customMove.outcomes.add')}
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableOutcomeRow({
    id,
    tier,
    text,
    optionCount,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    tier: OutcomeTier
    text: string
    optionCount: number
    dragDisabled: boolean
    onEdit: () => void
    onRemove: () => void
    children?: React.ReactNode
}) {
    const ui = useUiText()
    const tierEntry = TIERS.find((entry) => entry.value === tier)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: dragDisabled })

    return (
        <li
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`max-w-full rounded-md border bg-white px-3 py-3 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-slate-50 ${
                            dragDisabled
                                ? 'cursor-not-allowed opacity-40 hover:bg-transparent'
                                : 'cursor-grab active:cursor-grabbing'
                        }`}
                        aria-label={ui('actions.dragToReorder')}
                        title={
                            dragDisabled
                                ? ui(
                                      'city:forms.shared.list.finishEditingToReorder'
                                  )
                                : ui('actions.dragToReorder')
                        }
                        disabled={dragDisabled}
                        {...(!dragDisabled ? attributes : {})}
                        {...(!dragDisabled ? listeners : {})}
                    >
                        <GripVertical className="h-4 w-4 text-slate-500" />
                    </button>
                    <div className="truncate font-bold font-[PT_Serif]">
                        {tierEntry ? ui(tierEntry.label) : tier}
                        {optionCount > 0 ? (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                                {ui(
                                    'city:forms.customMove.outcomes.optionCount',
                                    {
                                        count: optionCount,
                                    }
                                )}
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={onEdit}
                        title={ui('actions.edit')}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={onRemove}
                        title={ui('actions.remove')}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <SystemMarkdownScope className="min-w-0" as="div">
                <div
                    className="text-sm leading-6 text-foreground/80 font-[PT_Serif]"
                    dangerouslySetInnerHTML={{
                        __html: renderSystemMarkdownInline(text),
                    }}
                />
            </SystemMarkdownScope>
            {children}
        </li>
    )
}
