import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useState } from 'react'
import { StringListEditor } from '../../shared/StringListEditor'
import type { MoveInline, MoveResult } from '../model'

const AUDIENCES = [
    ['none', 'pbta:forms.playbook.audience.any', null],
    ['character', 'pbta:forms.playbook.audience.character', 'character'],
    ['npc', 'pbta:forms.playbook.audience.npc', 'npc'],
    ['mc', 'pbta:forms.playbook.audience.mc', 'mc'],
] as const

function AudienceField({
    value,
    onChange,
}: {
    value: MoveInline['audience']
    onChange: (next: MoveInline['audience']) => void
}) {
    const text = useUiText()
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
                    {text(label)}
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
    const text = useUiText()
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
                            placeholder={text(
                                'pbta:forms.playbook.moveFields.resultLabelPlaceholder'
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={text(
                                'pbta:forms.playbook.moveFields.removeResult',
                                { key }
                            )}
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
                        placeholder={text('pbta:forms.shared.supportsMarkdown')}
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
                    placeholder={text(
                        'pbta:forms.playbook.moveFields.resultKeyPlaceholder'
                    )}
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={addEntry}
                >
                    {text('pbta:forms.playbook.moveFields.addResult')}
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
    const text = useUiText()
    return (
        <div className="space-y-2">
            <div className="grid gap-1.5 sm:grid-cols-2">
                <Input
                    className="h-8 text-xs"
                    value={value.name}
                    onChange={(event) =>
                        onChange({ ...value, name: event.target.value })
                    }
                    placeholder={text('pbta:forms.playbook.moveFields.name')}
                />
                <Input
                    className="h-8 text-xs"
                    value={value.moveType}
                    onChange={(event) =>
                        onChange({ ...value, moveType: event.target.value })
                    }
                    placeholder={text(
                        'pbta:forms.playbook.moveFields.moveTypeKeyPlaceholder'
                    )}
                />
            </div>

            <Textarea
                rows={2}
                className="px-2 py-1 text-xs"
                value={value.description}
                onChange={(event) =>
                    onChange({ ...value, description: event.target.value })
                }
                placeholder={text('pbta:forms.shared.supportsMarkdown')}
            />

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.moveFields.audience')}
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
                placeholder={text(
                    'pbta:forms.playbook.moveFields.triggerPlaceholder'
                )}
            />

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.moveFields.roll')}
                </Label>
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
                            placeholder={text(
                                'pbta:forms.playbook.moveFields.rollTypePlaceholder'
                            )}
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
                            placeholder={text(
                                'pbta:forms.playbook.moveFields.rollFormulaPlaceholder'
                            )}
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
                            placeholder={text(
                                'pbta:forms.playbook.moveFields.rollModPlaceholder'
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={text(
                                'pbta:forms.playbook.moveFields.removeRoll'
                            )}
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
                        {text('pbta:forms.playbook.moveFields.addRoll')}
                    </Button>
                )}
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.moveFields.results')}
                </Label>
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
                    placeholder={text(
                        'pbta:forms.playbook.moveFields.usesPlaceholder'
                    )}
                />
                <Input
                    className="h-8 text-xs"
                    value={value.choices}
                    onChange={(event) =>
                        onChange({ ...value, choices: event.target.value })
                    }
                    placeholder={text(
                        'pbta:forms.playbook.moveFields.choicesPlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.labels.tags')}
                </Label>
                <StringListEditor
                    value={value.tags}
                    onChange={(tags) => onChange({ ...value, tags })}
                    placeholder={text(
                        'pbta:forms.shared.list.addTagPlaceholder'
                    )}
                />
            </div>
        </div>
    )
}
