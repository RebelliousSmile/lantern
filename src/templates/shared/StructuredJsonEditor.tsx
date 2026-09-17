import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'

type Props<T> = {
    id: string
    label: string
    value: T
    onValidValue: (value: T) => void
}

export function StructuredJsonEditor<T>({
    id,
    label,
    value,
    onValidValue,
}: Props<T>) {
    const serialized = JSON.stringify(value, null, 2)
    const [draft, setDraft] = useState(serialized)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        setDraft(serialized)
        setError(null)
    }, [serialized])
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                rows={12}
                value={draft}
                onChange={(event) => {
                    const next = event.target.value
                    setDraft(next)
                    try {
                        onValidValue(JSON.parse(next) as T)
                        setError(null)
                    } catch (cause) {
                        setError(
                            cause instanceof Error
                                ? cause.message
                                : 'Invalid JSON.'
                        )
                    }
                }}
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
    )
}
