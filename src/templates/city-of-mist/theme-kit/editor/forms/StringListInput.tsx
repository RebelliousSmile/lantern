import { X } from 'lucide-react'
import { useState } from 'react'

/* Keywords, extra tags, question examples and motivation examples are all the
   same shape on the page — a short list of short strings — so they share one
   chip control rather than three near-identical blocks. */
export default function StringListInput({
    value,
    onChange,
    placeholder,
}: {
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
}) {
    const [draft, setDraft] = useState('')

    function commit() {
        const entry = draft.trim()
        if (entry && !value.includes(entry)) onChange([...value, entry])
        setDraft('')
    }

    return (
        <div className="rounded-md border px-2 py-1">
            <div className="flex flex-wrap gap-1">
                {value.map((entry) => (
                    <span
                        key={entry}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                    >
                        {entry}
                        <button
                            type="button"
                            aria-label={`Remove ${entry}`}
                            onClick={() =>
                                onChange(value.filter((item) => item !== entry))
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
                    onBlur={commit}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault()
                            commit()
                        }
                        if (
                            event.key === 'Backspace' &&
                            !draft &&
                            value.length
                        ) {
                            onChange(value.slice(0, -1))
                        }
                    }}
                    placeholder={value.length ? '' : (placeholder ?? 'Add...')}
                />
            </div>
        </div>
    )
}
