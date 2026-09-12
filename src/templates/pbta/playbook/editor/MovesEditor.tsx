import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import type { MoveEntry } from '../model'
import { MoveInlineFields } from './MoveInlineFields'

export type MovesEditorProps = {
    value: MoveEntry[]
    onChange: (next: MoveEntry[]) => void
}

function blankInlineMove(): MoveEntry {
    return {
        kind: 'inline',
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

/* Move-up/down instead of @dnd-kit, following ClockPresetsEditor's own
   reasoning: the list is short-lived and a full drag wiring is not worth it.
   Each row toggles between the 'ref' and 'inline' MoveEntry branches - they
   share no fields, so switching kind resets to that branch's defaults. */
export function MovesEditor({ value, onChange }: MovesEditorProps) {
    function updateAt(index: number, entry: MoveEntry) {
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
            {value.map((entry, index) => (
                <div key={index} className="space-y-1.5 rounded-md border p-2">
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
                                    updateAt(index, blankInlineMove())
                                }
                            >
                                Inline
                            </button>
                        </div>
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
                            aria-label="Remove move"
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
                                    kind: 'ref',
                                    ref: event.target.value,
                                })
                            }
                            placeholder="move.slug"
                        />
                    ) : (
                        <MoveInlineFields
                            value={entry}
                            onChange={(next) =>
                                updateAt(index, { kind: 'inline', ...next })
                            }
                        />
                    )}
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                        onChange([...value, { kind: 'ref', ref: 'new-move' }])
                    }
                >
                    Add ref move
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => onChange([...value, blankInlineMove()])}
                >
                    Add inline move
                </Button>
            </div>
        </div>
    )
}
