import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
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
    type CrewOutcome,
    type CrewRelationship,
} from '../../hooks'

const OUTCOMES: { value: CrewOutcome; label: string }[] = [
    { value: 'help', label: 'Helps' },
    { value: 'hurt', label: 'Hurts' },
    { value: 'either', label: 'Either' },
]

const NEW_RELATIONSHIP: CrewRelationship = {
    scenario: 'When one of us is arrested,',
    outcome: 'either',
}

export default function CrewRelationshipsForm({
    focusIndex,
    autoCreate,
}: {
    focusIndex?: number
    autoCreate?: boolean
}) {
    const {
        cityOfMistThemeKit,
        addCrewRelationship,
        updateCrewRelationshipAt,
        removeCrewRelationshipAt,
        moveCrewRelationship,
    } = useCityOfMistThemeKitStore()

    const relationships = cityOfMistThemeKit.crew_relationships
    const ids = useMemo(
        () => relationships.map((item, index) => `${index}::${item.scenario}`),
        [relationships]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (autoCreate && relationships.length === 0) {
            addCrewRelationship(NEW_RELATIONSHIP)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCreate])

    function handleDragEnd(event: DragEndEvent) {
        if (!event.over || event.active.id === event.over.id) return
        const from = Number(String(event.active.id).split('::')[0])
        const to = Number(String(event.over.id).split('::')[0])
        if (Number.isInteger(from) && Number.isInteger(to)) {
            moveCrewRelationship(from, to)
        }
    }

    return (
        <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Crew relationships
            </p>

            {cityOfMistThemeKit.theme_type !== 'crew' ? (
                <p className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                    Only a Crew themebook prints these, so they stay off the
                    page until you switch the theme type.
                </p>
            ) : null}

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
                        {relationships.map((relationship, index) => (
                            <RelationshipRow
                                key={ids[index]}
                                id={ids[index]}
                                relationship={relationship}
                                highlighted={index === focusIndex}
                                onUpdate={(update) =>
                                    updateCrewRelationshipAt(index, update)
                                }
                                onRemove={() => removeCrewRelationshipAt(index)}
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
                onClick={() => addCrewRelationship(NEW_RELATIONSHIP)}
            >
                <Plus className="h-3.5 w-3.5" /> Add relationship
            </Button>
        </div>
    )
}

function RelationshipRow({
    id,
    relationship,
    highlighted,
    onUpdate,
    onRemove,
}: {
    id: string
    relationship: CrewRelationship
    highlighted: boolean
    onUpdate: (update: Partial<CrewRelationship>) => void
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
                <div className="grid min-w-0 flex-1 gap-1">
                    <Label htmlFor={`${id}-scenario`} className="text-xs">
                        Scenario
                    </Label>
                    <Textarea
                        id={`${id}-scenario`}
                        className="min-h-16 text-sm"
                        value={relationship.scenario}
                        onChange={(event) =>
                            onUpdate({ scenario: event.target.value })
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
            <div className="mt-2 grid gap-1 pl-9">
                <Label className="text-xs">What it does to the crew</Label>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    {OUTCOMES.map((outcome) => (
                        <Button
                            key={outcome.value}
                            type="button"
                            variant={
                                relationship.outcome === outcome.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-1 text-xs',
                                relationship.outcome === outcome.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() => onUpdate({ outcome: outcome.value })}
                        >
                            {outcome.label}
                        </Button>
                    ))}
                </div>
            </div>
        </li>
    )
}
