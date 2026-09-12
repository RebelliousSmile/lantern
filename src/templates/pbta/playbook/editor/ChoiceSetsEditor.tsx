import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import type { ChoiceEntry, ChoiceSet } from '../model'
import { MoveInlineFields } from './MoveInlineFields'

function blankInlineChoice(): ChoiceEntry {
    return {
        kind: 'inline',
        granted: 1,
        advancement: 0,
        description: 'Describe this move.',
        name: 'New Move',
        moveType: 'move',
        audience: null,
        playbook: '',
        trigger: '',
        roll: null,
        results: {},
        uses: null,
        choices: '',
        tags: [],
    }
}

function blankChoiceSet(): ChoiceSet {
    return {
        title: 'New Choice Set',
        description: '',
        type: 'single',
        repeatable: false,
        grantOn: '',
        choices: [],
    }
}

function ChoiceEntriesEditor({
    value,
    onChange,
}: {
    value: ChoiceEntry[]
    onChange: (next: ChoiceEntry[]) => void
}) {
    function updateAt(index: number, entry: ChoiceEntry) {
        onChange(value.map((current, i) => (i === index ? entry : current)))
    }

    function removeAt(index: number) {
        onChange(value.filter((_, i) => i !== index))
    }

    function moveAt(index: number, offset: number) {
        const target = index + offset
        if (target < 0 || target >= value.length) return
        const next = [...value]
        const [entry] = next.splice(index, 1)
        next.splice(target, 0, entry)
        onChange(next)
    }

    return (
        <div className="space-y-1.5">
            {value.map((entry, index) => (
                <div
                    key={index}
                    className="space-y-1.5 rounded-md border p-1.5"
                >
                    <div className="flex items-center gap-1.5">
                        <div className="flex overflow-hidden rounded-md border">
                            <button
                                type="button"
                                className={cn(
                                    'h-7 border-none px-2 text-xs',
                                    entry.kind === 'ref' ? '' : 'bg-background'
                                )}
                                onClick={() =>
                                    entry.kind !== 'ref' &&
                                    updateAt(index, {
                                        kind: 'ref',
                                        ref: 'new-move',
                                        granted: entry.granted,
                                        advancement: entry.advancement,
                                    })
                                }
                            >
                                Ref
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    'h-7 border-none px-2 text-xs',
                                    entry.kind === 'inline'
                                        ? ''
                                        : 'bg-background'
                                )}
                                onClick={() =>
                                    entry.kind !== 'inline' &&
                                    updateAt(index, {
                                        ...blankInlineChoice(),
                                        granted: entry.granted,
                                        advancement: entry.advancement,
                                    })
                                }
                            >
                                Inline
                            </button>
                        </div>
                        <Input
                            className="h-7 w-20 text-xs"
                            type="number"
                            value={entry.granted}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    granted: Math.floor(
                                        Number(event.target.value) || 0
                                    ),
                                })
                            }
                            placeholder="granted"
                        />
                        <Input
                            className="h-7 w-24 text-xs"
                            type="number"
                            value={entry.advancement}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    advancement: Math.floor(
                                        Number(event.target.value) || 0
                                    ),
                                })
                            }
                            placeholder="advancement"
                        />
                        <div className="flex-1" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Move up"
                            onClick={() => moveAt(index, -1)}
                        >
                            <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Move down"
                            onClick={() => moveAt(index, 1)}
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Remove choice"
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {entry.kind === 'ref' ? (
                        <Input
                            className="h-8 text-xs"
                            value={entry.ref}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    ref: event.target.value,
                                })
                            }
                            placeholder="move.slug"
                        />
                    ) : (
                        <MoveInlineFields
                            value={entry}
                            onChange={(next) =>
                                updateAt(index, { ...entry, ...next })
                            }
                        />
                    )}
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() =>
                    onChange([
                        ...value,
                        {
                            kind: 'ref',
                            ref: 'new-move',
                            granted: 1,
                            advancement: 0,
                        },
                    ])
                }
            >
                Add choice
            </Button>
        </div>
    )
}

export type ChoiceSetsEditorProps = {
    value: ChoiceSet[]
    onChange: (next: ChoiceSet[]) => void
}

/* Array of structured objects, following ClockPresetsEditor's move-up/down
   pattern. Each choice set nests its own ChoiceEntry[] list, which in turn
   reuses MoveInlineFields for its inline branch - the same body as a move,
   plus granted/advancement. */
export function ChoiceSetsEditor({ value, onChange }: ChoiceSetsEditorProps) {
    function updateAt(index: number, entry: ChoiceSet) {
        onChange(value.map((current, i) => (i === index ? entry : current)))
    }

    function removeAt(index: number) {
        onChange(value.filter((_, i) => i !== index))
    }

    function moveAt(index: number, offset: number) {
        const target = index + offset
        if (target < 0 || target >= value.length) return
        const next = [...value]
        const [entry] = next.splice(index, 1)
        next.splice(target, 0, entry)
        onChange(next)
    }

    return (
        <div className="space-y-2">
            {value.map((choiceSet, index) => (
                <div key={index} className="space-y-2 rounded-md border p-2">
                    <div className="flex items-center gap-1.5">
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={choiceSet.title}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...choiceSet,
                                    title: event.target.value,
                                })
                            }
                            placeholder="Title"
                        />
                        <div className="flex overflow-hidden rounded-md border">
                            <button
                                type="button"
                                className={cn(
                                    'h-8 border-none px-2 text-xs',
                                    choiceSet.type === 'single'
                                        ? ''
                                        : 'bg-background'
                                )}
                                onClick={() =>
                                    updateAt(index, {
                                        ...choiceSet,
                                        type: 'single',
                                    })
                                }
                            >
                                Single
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    'h-8 border-none px-2 text-xs',
                                    choiceSet.type === 'multi'
                                        ? ''
                                        : 'bg-background'
                                )}
                                onClick={() =>
                                    updateAt(index, {
                                        ...choiceSet,
                                        type: 'multi',
                                    })
                                }
                            >
                                Multi
                            </button>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Move up"
                            onClick={() => moveAt(index, -1)}
                        >
                            <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Move down"
                            onClick={() => moveAt(index, 1)}
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Remove ${choiceSet.title || 'choice set'}`}
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <Textarea
                        rows={2}
                        className="px-2 py-1 text-xs"
                        value={choiceSet.description}
                        onChange={(event) =>
                            updateAt(index, {
                                ...choiceSet,
                                description: event.target.value,
                            })
                        }
                        placeholder="Description"
                    />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <Switch
                                id={`choice-set-repeatable-${index}`}
                                checked={choiceSet.repeatable}
                                onCheckedChange={(checked) =>
                                    updateAt(index, {
                                        ...choiceSet,
                                        repeatable: !!checked,
                                    })
                                }
                            />
                            <Label
                                htmlFor={`choice-set-repeatable-${index}`}
                                className="text-xs"
                            >
                                Repeatable
                            </Label>
                        </div>
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={choiceSet.grantOn}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...choiceSet,
                                    grantOn: event.target.value,
                                })
                            }
                            placeholder="Granted on, e.g. creation"
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label className="text-xs text-muted-foreground">
                            Choices
                        </Label>
                        <ChoiceEntriesEditor
                            value={choiceSet.choices}
                            onChange={(choices) =>
                                updateAt(index, { ...choiceSet, choices })
                            }
                        />
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => onChange([...value, blankChoiceSet()])}
            >
                Add choice set
            </Button>
        </div>
    )
}
