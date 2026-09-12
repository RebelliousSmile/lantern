import { X } from 'lucide-react'
import { useState } from 'react'

export type StringListEditorProps = {
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
}

/* Chip-list editor shared by game-definition (ListOne/ListMany attribute
   options, clock preset segments) and playbook (creation options, gear tags,
   move tags). */
export function StringListEditor({
    value,
    onChange,
    placeholder = 'Add option and press Enter',
}: StringListEditorProps) {
    const [draft, setDraft] = useState('')

    function commitDraft() {
        const entry = draft.trim()
        if (!entry) return
        onChange([...value, entry])
        setDraft('')
    }

    return (
        <div className="rounded-md border px-2 py-1">
            <div className="flex flex-wrap gap-1">
                {value.map((entry, index) => (
                    <span
                        key={`${entry}-${index}`}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                    >
                        {entry}
                        <button
                            type="button"
                            className="opacity-70 hover:opacity-100"
                            aria-label={`Remove ${entry}`}
                            onClick={() =>
                                onChange(value.filter((_, i) => i !== index))
                            }
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    className="min-w-[10ch] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault()
                            commitDraft()
                        }
                        if (
                            event.key === 'Backspace' &&
                            !draft &&
                            value.length
                        ) {
                            onChange(value.slice(0, -1))
                        }
                    }}
                    placeholder={value.length ? '' : placeholder}
                />
            </div>
        </div>
    )
}
