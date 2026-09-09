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
import { useEffect, useMemo } from 'react'
import {
    useCityOfMistThemeKitStore,
    type Question,
    type QuestionField,
    type SelectionRule,
} from '../../hooks'
import StringListInput from './StringListInput'

const COPY: Record<QuestionField, { title: string; placeholder: string }> = {
    power: {
        title: 'Power tag questions',
        placeholder: 'What is the one thing you are best at?',
    },
    weakness: {
        title: 'Weakness tag questions',
        placeholder: 'What does that same strength cost you?',
    },
}

export default function QuestionsForm({
    field,
    focusIndex,
    autoCreate,
}: {
    field: QuestionField
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        cityOfMistThemeKit,
        addQuestion,
        updateQuestionAt,
        removeQuestionAt,
        moveQuestion,
        setRule,
    } = useCityOfMistThemeKitStore()

    const questions =
        field === 'power'
            ? cityOfMistThemeKit.power_tag_questions
            : cityOfMistThemeKit.weakness_tag_questions
    const rule =
        field === 'power'
            ? cityOfMistThemeKit.power_tag_rule
            : cityOfMistThemeKit.weakness_tag_rule

    /* The letter is not part of a row's identity: it is recomputed from the
       row's position on every mutation, so keying on it would make two rows
       collide mid-reorder. */
    const ids = useMemo(
        () => questions.map((question, index) => `${index}::${question.text}`),
        [questions]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (autoCreate && questions.length === 0) addQuestion(field)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    function handleDragEnd(event: DragEndEvent) {
        if (!event.over || event.active.id === event.over.id) return
        const from = Number(String(event.active.id).split('::')[0])
        const to = Number(String(event.over.id).split('::')[0])
        if (Number.isInteger(from) && Number.isInteger(to)) {
            moveQuestion(field, from, to)
        }
    }

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {COPY[field].title}
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
                        {questions.map((question, index) => (
                            <QuestionRow
                                key={ids[index]}
                                id={ids[index]}
                                question={question}
                                placeholder={COPY[field].placeholder}
                                highlighted={index === focusIndex}
                                onUpdate={(update) =>
                                    updateQuestionAt(field, index, update)
                                }
                                onRemove={() => removeQuestionAt(field, index)}
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
                onClick={() => addQuestion(field)}
            >
                <Plus className="h-3.5 w-3.5" /> Add question
            </Button>

            <RuleFields
                field={field}
                rule={rule}
                onChange={(update) => setRule(field, update)}
            />
        </div>
    )
}

function QuestionRow({
    id,
    question,
    placeholder,
    highlighted,
    onUpdate,
    onRemove,
}: {
    id: string
    question: Question
    placeholder: string
    highlighted: boolean
    onUpdate: (update: Partial<Question>) => void
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
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`rounded-md border p-2 ${highlighted ? 'ring-1 ring-primary' : ''} ${isDragging ? 'shadow-lg' : ''}`}
        >
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    className="inline-flex h-8 w-7 cursor-grab items-center justify-center rounded hover:bg-muted"
                    aria-label="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <span className="mt-1.5 w-4 shrink-0 text-sm font-semibold">
                    {question.letter}
                </span>
                <Textarea
                    id={`${id}-text`}
                    className="min-h-16 flex-1 text-sm"
                    value={question.text}
                    onChange={(event) => onUpdate({ text: event.target.value })}
                    placeholder={placeholder}
                />
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
            <div className="mt-2 grid gap-1 pl-9">
                <Label className="text-xs">
                    Examples{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <StringListInput
                    value={question.examples ?? []}
                    onChange={(examples) =>
                        onUpdate({
                            examples: examples.length ? examples : undefined,
                        })
                    }
                    placeholder="Add example..."
                />
            </div>
        </li>
    )
}

function RuleFields({
    field,
    rule,
    onChange,
}: {
    field: QuestionField
    rule: SelectionRule | null
    onChange: (update: Partial<SelectionRule>) => void
}) {
    return (
        <div className="grid gap-3 rounded-md border p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                How many are answered
            </p>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                    <Label
                        htmlFor={`theme-kit-${field}-required`}
                        className="text-xs"
                    >
                        Required
                    </Label>
                    <Input
                        id={`theme-kit-${field}-required`}
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={0}
                        value={rule?.required_count ?? 0}
                        onChange={(event) =>
                            onChange({
                                required_count: Math.max(
                                    0,
                                    Math.floor(Number(event.target.value) || 0)
                                ),
                            })
                        }
                    />
                </div>
                <div className="grid gap-1">
                    <Label
                        htmlFor={`theme-kit-${field}-chosen`}
                        className="text-xs"
                    >
                        Free choice
                    </Label>
                    <Input
                        id={`theme-kit-${field}-chosen`}
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={0}
                        value={rule?.chosen_count ?? 0}
                        onChange={(event) =>
                            onChange({
                                chosen_count: Math.max(
                                    0,
                                    Math.floor(Number(event.target.value) || 0)
                                ),
                            })
                        }
                    />
                </div>
            </div>
            <div className="grid gap-1">
                <Label htmlFor={`theme-kit-${field}-note`} className="text-xs">
                    Note{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id={`theme-kit-${field}-note`}
                    className="min-h-16 text-sm"
                    value={rule?.note ?? ''}
                    onChange={(event) => onChange({ note: event.target.value })}
                    placeholder="Answer the first question, then two more of your choice."
                />
            </div>
        </div>
    )
}
