import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { RollResult } from '../model'

export type RollResultsEditorProps = {
    value: Record<string, RollResult>
    onChange: (next: Record<string, RollResult>) => void
}

/* Same index-keyed rename pattern as RecordListEditor, three fields per row
   instead of two: key (TOML table key), `range` and `label`. */
export function RollResultsEditor({ value, onChange }: RollResultsEditorProps) {
    const [draftKey, setDraftKey] = useState('')
    const [draftRange, setDraftRange] = useState('')
    const [draftLabel, setDraftLabel] = useState('')
    const entries = Object.entries(value)

    function renameEntry(index: number, nextKey: string) {
        const next = entries.map(
            ([key, result], entryIndex) =>
                [entryIndex === index ? nextKey : key, result] as const
        )
        onChange(Object.fromEntries(next))
    }

    function updateEntry(key: string, result: RollResult) {
        onChange({ ...value, [key]: result })
    }

    function removeEntry(key: string) {
        const next = { ...value }
        delete next[key]
        onChange(next)
    }

    function commitDraft() {
        const key = draftKey.trim()
        if (!key || key in value) return
        onChange({
            ...value,
            [key]: { range: draftRange.trim(), label: draftLabel.trim() },
        })
        setDraftKey('')
        setDraftRange('')
        setDraftLabel('')
    }

    return (
        <div className="space-y-1.5">
            {entries.map(([key, result], index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <Input
                        className="h-8 w-24 text-xs"
                        value={key}
                        onChange={(event) =>
                            renameEntry(index, event.target.value)
                        }
                        placeholder="key"
                    />
                    <Input
                        className="h-8 w-20 text-xs"
                        value={result.range}
                        onChange={(event) =>
                            updateEntry(key, {
                                ...result,
                                range: event.target.value,
                            })
                        }
                        placeholder="Range"
                    />
                    <Input
                        className="h-8 flex-1 text-xs"
                        value={result.label}
                        onChange={(event) =>
                            updateEntry(key, {
                                ...result,
                                label: event.target.value,
                            })
                        }
                        placeholder="Label"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        aria-label={`Remove ${key || 'result'}`}
                        onClick={() => removeEntry(key)}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Input
                    className="h-8 w-24 text-xs"
                    value={draftKey}
                    onChange={(event) => setDraftKey(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            commitDraft()
                        }
                    }}
                    placeholder="key"
                />
                <Input
                    className="h-8 w-20 text-xs"
                    value={draftRange}
                    onChange={(event) => setDraftRange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            commitDraft()
                        }
                    }}
                    placeholder="Range"
                />
                <Input
                    className="h-8 flex-1 text-xs"
                    value={draftLabel}
                    onChange={(event) => setDraftLabel(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            commitDraft()
                        }
                    }}
                    placeholder="Label"
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={commitDraft}
                >
                    Add
                </Button>
            </div>
        </div>
    )
}
