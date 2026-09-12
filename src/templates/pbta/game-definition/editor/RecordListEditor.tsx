import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useState } from 'react'

export type RecordListEditorProps = {
    value: Record<string, string>
    onChange: (next: Record<string, string>) => void
    keyPlaceholder?: string
    valuePlaceholder?: string
    readOnly?: boolean
}

/* Adapts custom-move's `AuthorsInput` chip pattern (editor/forms/MetaForm.tsx)
   from a flat string list to a key+value record. Rows are index-keyed and
   keep their position on rename: these keys are TOML table keys, not a
   reorderable list, so there is no drag handle here. */
export function RecordListEditor({
    value,
    onChange,
    keyPlaceholder = 'key',
    valuePlaceholder = 'Label',
    readOnly,
}: RecordListEditorProps) {
    const [draftKey, setDraftKey] = useState('')
    const [draftValue, setDraftValue] = useState('')
    const entries = Object.entries(value)

    function renameEntry(index: number, nextKey: string) {
        const next = entries.map(
            ([key, entryValue], entryIndex) =>
                [entryIndex === index ? nextKey : key, entryValue] as const
        )
        onChange(Object.fromEntries(next))
    }

    function updateEntry(key: string, nextValue: string) {
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
        onChange({ ...value, [key]: draftValue.trim() })
        setDraftKey('')
        setDraftValue('')
    }

    return (
        <div className="space-y-1.5">
            {entries.map(([key, entryValue], index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <Input
                        className="h-8 w-28 text-xs"
                        value={key}
                        disabled={readOnly}
                        onChange={(event) =>
                            renameEntry(index, event.target.value)
                        }
                        placeholder={keyPlaceholder}
                    />
                    <Input
                        className="h-8 flex-1 text-xs"
                        value={entryValue}
                        disabled={readOnly}
                        onChange={(event) =>
                            updateEntry(key, event.target.value)
                        }
                        placeholder={valuePlaceholder}
                    />
                    {!readOnly && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Remove ${key || 'entry'}`}
                            onClick={() => removeEntry(key)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            ))}
            {!readOnly && (
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
                        placeholder={keyPlaceholder}
                    />
                    <Input
                        className="h-8 flex-1 text-xs"
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                commitDraft()
                            }
                        }}
                        placeholder={valuePlaceholder}
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
            )}
        </div>
    )
}
