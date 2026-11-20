import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useState } from 'react'
import { acceptsNotes, fitsRenderedPage, fittingPrefix } from './notesFit'

/**
 * The free text of the notes page. It says how much of the page is used and refuses what does not
 * fit: past the capacity of the schema or past the last line the page draws, the text stops there.
 */
export function NotesForm({
    label,
    value,
    capacity,
    onChange,
}: {
    label: string
    value: string
    /** What the schema publishes for the notes; the form never restates it. */
    capacity: number
    onChange: (value: string) => void
}) {
    const text = useUiText()
    const [refused, setRefused] = useState(false)
    const full = refused || value.length >= capacity
    return (
        <div className="grid gap-1">
            <Label>{label}</Label>
            <Textarea
                className="min-h-64"
                value={value}
                aria-invalid={refused || undefined}
                onChange={(event) => {
                    const next = event.target.value
                    const fits = fitsRenderedPage()
                    if (acceptsNotes(next, capacity, fits)) {
                        setRefused(false)
                        onChange(next)
                        return
                    }
                    /* Shortening is always allowed; growing beyond the page keeps what fits. */
                    const kept = fittingPrefix(next, capacity, fits)
                    setRefused(true)
                    if (kept !== value) onChange(kept)
                }}
            />
            <p
                className={
                    full
                        ? 'text-sm font-medium text-destructive'
                        : 'text-sm text-muted-foreground'
                }
                aria-live="polite"
            >
                {full
                    ? text('notes.full')
                    : text('notes.counter', {
                          used: value.length,
                          capacity,
                      })}
            </p>
        </div>
    )
}
