import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useState } from 'react'
import { StringListEditor } from '../../shared/StringListEditor'
import type { MoveInline, MoveResult } from '../model'

const AUDIENCES = [
    ['none', 'Any', null],
    ['character', 'Character', 'character'],
    ['npc', 'NPC', 'npc'],
    ['mc', 'MC', 'mc'],
] as const

function AudienceField({
    value,
    onChange,
}: {
    value: MoveInline['audience']
    onChange: (next: MoveInline['audience']) => void
}) {
    return (
        <div className="grid grid-cols-4 overflow-hidden rounded-md border">
            {AUDIENCES.map(([key, label, audience]) => (
                <button
                    key={key}
                    type="button"
                    className={cn(
                        'h-7 border-none px-2 text-xs',
                        value === audience ? '' : 'bg-background'
                    )}
                    onClick={() => onChange(audience)}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}

function MoveResultsEditor({
    value,
    onChange,
}: {
    value: Record<string, MoveResult>
    onChange: (next: Record<string, MoveResult>) => void
}) {
    const [draftKey, setDraftKey] = useState('')
    const entries = Object.entries(value)

    function updateEntry(key: string, next: MoveResult) {
        onChange({ ...value, [key]: next })
    }

    function removeEntry(key: string) {
        const next = { ...value }
        delete next[key]
        onChange(next)
    }

    function addEntry() {
        const key = draftKey.trim()
        if (!key || key in value) return
        onChange({ ...value, [key]: { label: key, text: 'New result.' } })
        setDraftKey('')
    }

    return (
        <div className="space-y-1.5">
            {entries.map(([key, result]) => (
                <div key={key} className="space-y-1 rounded-md border p-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className="w-16 shrink-0 text-xs text-muted-foreground">
                            {key}
                        </span>
                        <Input
                            className="h-7 flex-1 text-xs"
                            value={result.label}
                            onChange={(event) =>
                                updateEntry(key, {
                                    ...result,
                                    label: event.target.value,
                                })
                            }
                            placeholder="Label, e.g. 10+"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Remove ${key} result`}
                            onClick={() => removeEntry(key)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <Textarea
                        rows={2}
                        className="px-2 py-1 text-xs"
                        value={result.text}
                        onChange={(event) =>
                            updateEntry(key, {
                                ...result,
                                text: event.target.value,
                            })
                        }
                        placeholder="Supports Markdown."
                    />
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Input
                    className="h-7 flex-1 text-xs"
                    value={draftKey}
                    onChange={(event) => setDraftKey(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            addEntry()
                        }
                    }}
                    placeholder="Result key, e.g. strong"
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={addEntry}
                >
                    Add result
                </Button>
            </div>
        </div>
    )
}

export type MoveInlineFieldsProps = {
    value: MoveInline
    onChange: (next: MoveInline) => void
}

/* Shared between MovesEditor's own move entries and ChoiceSetsEditor's
   inline choices - both embed a MoveInline. */
export function MoveInlineFields({ value, onChange }: MoveInlineFieldsProps) {
    return (
        <div className="space-y-2">
            <div className="grid gap-1.5 sm:grid-cols-2">
                <Input
                    className="h-8 text-xs"
                    value={value.name}
                    onChange={(event) =>
                        onChange({ ...value, name: event.target.value })
                    }
                    placeholder="Move name"
                />
                <Input
                    className="h-8 text-xs"
                    value={value.moveType}
                    onChange={(event) =>
                        onChange({ ...value, moveType: event.target.value })
                    }
                    placeholder="Move type key"
                />
            </div>

            <Textarea
                rows={2}
                className="px-2 py-1 text-xs"
                value={value.description}
                onChange={(event) =>
                    onChange({ ...value, description: event.target.value })
                }
                placeholder="Supports Markdown."
            />

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    Audience
                </Label>
                <AudienceField
                    value={value.audience}
                    onChange={(audience) => onChange({ ...value, audience })}
                />
            </div>

            <Input
                className="h-8 text-xs"
                value={value.trigger}
                onChange={(event) =>
                    onChange({ ...value, trigger: event.target.value })
                }
                placeholder="Trigger, e.g. you act despite danger"
            />

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Roll</Label>
                {value.roll ? (
                    <div className="flex items-center gap-1.5">
                        <Input
                            className="h-8 w-24 text-xs"
                            value={value.roll.rollType}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    roll: {
                                        ...value.roll!,
                                        rollType: event.target.value,
                                    },
                                })
                            }
                            placeholder="type"
                        />
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={value.roll.rollFormula}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    roll: {
                                        ...value.roll!,
                                        rollFormula: event.target.value,
                                    },
                                })
                            }
                            placeholder="formula, e.g. 2d6+Nerve"
                        />
                        <Input
                            className="h-8 w-16 text-xs"
                            type="number"
                            value={value.roll.rollMod ?? ''}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    roll: {
                                        ...value.roll!,
                                        rollMod: event.target.value
                                            ? Math.floor(
                                                  Number(event.target.value)
                                              )
                                            : null,
                                    },
                                })
                            }
                            placeholder="mod"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Remove roll"
                            onClick={() => onChange({ ...value, roll: null })}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 w-fit text-xs"
                        onClick={() =>
                            onChange({
                                ...value,
                                roll: {
                                    rollType: 'stat',
                                    rollFormula: '',
                                    rollMod: null,
                                },
                            })
                        }
                    >
                        Add roll
                    </Button>
                )}
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Results</Label>
                <MoveResultsEditor
                    value={value.results}
                    onChange={(results) => onChange({ ...value, results })}
                />
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2">
                <Input
                    className="h-8 text-xs"
                    type="number"
                    value={value.uses ?? ''}
                    onChange={(event) =>
                        onChange({
                            ...value,
                            uses: event.target.value
                                ? Math.floor(Number(event.target.value))
                                : null,
                        })
                    }
                    placeholder="Uses (optional)"
                />
                <Input
                    className="h-8 text-xs"
                    value={value.choices}
                    onChange={(event) =>
                        onChange({ ...value, choices: event.target.value })
                    }
                    placeholder="Choices note (optional)"
                />
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <StringListEditor
                    value={value.tags}
                    onChange={(tags) => onChange({ ...value, tags })}
                    placeholder="Add tag and press Enter"
                />
            </div>
        </div>
    )
}
