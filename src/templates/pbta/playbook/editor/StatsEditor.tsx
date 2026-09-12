import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useState } from 'react'

export type StatsEditorProps = {
    value: Record<string, number>
    onChange: (next: Record<string, number>) => void
}

/* Same index-keyed row shape as game-definition's RecordListEditor, adapted
   for a numeric value: a playbook's stats are `Record<string, number>`,
   not `Record<string, string>`. */
export function StatsEditor({ value, onChange }: StatsEditorProps) {
    const [draftKey, setDraftKey] = useState('')
    const [draftValue, setDraftValue] = useState('0')
    const entries = Object.entries(value)

    function renameEntry(index: number, nextKey: string) {
        const next = entries.map(
            ([key, entryValue], entryIndex) =>
                [entryIndex === index ? nextKey : key, entryValue] as const
        )
        onChange(Object.fromEntries(next))
    }

    function updateEntry(key: string, nextValue: number) {
        onChange({ ...value, [key]: nextValue })
    }

    function removeEntry(key: string) {
        const next = { ...value }
        delete next[key]
        onChange(next)
    }

    function commitDraft() {
        const key = draftKey.trim()
        if (!key || key in value) return
        onChange({ ...value, [key]: Math.floor(Number(draftValue) || 0) })
        setDraftKey('')
        setDraftValue('0')
    }

    return (
        <div className="space-y-1.5">
            {entries.map(([key, entryValue], index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <Input
                        className="h-8 w-28 text-xs"
                        value={key}
                        onChange={(event) =>
                            renameEntry(index, event.target.value)
                        }
                        placeholder="key"
                    />
                    <Input
                        className="h-8 w-20 text-xs"
                        type="number"
                        value={entryValue}
                        onChange={(event) =>
                            updateEntry(
                                key,
                                Math.floor(Number(event.target.value) || 0)
                            )
                        }
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        aria-label={`Remove ${key || 'stat'}`}
                        onClick={() => removeEntry(key)}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Input
                    className="h-8 w-28 text-xs"
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
                    type="number"
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            commitDraft()
                        }
                    }}
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
