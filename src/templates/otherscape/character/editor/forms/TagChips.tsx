import { Input } from '@/components/ui/input'
import { useUiText } from '@/i18n/text'
import { X } from 'lucide-react'
import { useState } from 'react'

/* Tags are stored bare: braces only exist on the printed sheet. The input
   takes a tag on Enter or on a comma, and drops any brace the author types. */
function bare(raw: string) {
    return raw
        .replace(/[{}]/g, '')
        .replace(/^!/, '')
        .replace(/\s+/g, ' ')
        .trim()
}

export default function TagChips({
    id,
    tags,
    onChange,
    placeholder,
}: {
    id: string
    tags: string[]
    onChange: (next: string[]) => void
    placeholder: string
}) {
    const text = useUiText()
    const [draft, setDraft] = useState('')

    function commit(raw: string) {
        const tag = bare(raw)
        if (tag) onChange([...tags, tag])
        setDraft('')
    }

    return (
        <div className="grid gap-2">
            {tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                    {tags.map((tag, index) => (
                        <li
                            key={`${index}::${tag}`}
                            className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-xs"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                className="cursor-pointer text-muted-foreground hover:text-foreground"
                                aria-label={text(
                                    'otherscape:forms.character.combos.removeTagAriaLabel',
                                    { tag }
                                )}
                                onClick={() =>
                                    onChange(tags.filter((_, i) => i !== index))
                                }
                            >
                                <X className="size-3" aria-hidden />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <Input
                id={id}
                className="h-8 px-2 text-sm"
                value={draft}
                placeholder={placeholder}
                onChange={(event) => {
                    const value = event.target.value
                    const parts = value.split(',')
                    const rest = parts.pop() ?? ''
                    const added = parts.map(bare).filter(Boolean)
                    if (added.length) onChange([...tags, ...added])
                    setDraft(rest)
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        commit(draft)
                    }
                }}
                onBlur={() => {
                    if (draft.trim()) commit(draft)
                }}
            />
        </div>
    )
}
