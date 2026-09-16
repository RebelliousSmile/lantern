import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ReactNode } from 'react'

export function TextField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}

export function NumberField({
    label,
    value,
    onChange,
}: {
    label: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Input
                type="number"
                value={value}
                onChange={(event) => onChange(Number(event.target.value) || 0)}
            />
        </label>
    )
}

export function LongTextField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="grid gap-1">
            <Label>{label}</Label>
            <Textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

export function StringRows({
    label,
    values,
    onChange,
}: {
    label: string
    values: string[]
    onChange: (values: string[]) => void
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {values.map((value, index) => (
                <div className="flex gap-2" key={`${index}-${value}`}>
                    <Input
                        value={value}
                        onChange={(event) =>
                            onChange(
                                values.map((entry, at) =>
                                    at === index ? event.target.value : entry
                                )
                            )
                        }
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onChange(values.filter((_, at) => at !== index))
                        }
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => onChange([...values, ''])}
            >
                Add
            </Button>
        </div>
    )
}

/** A schema-shaped ordered list. The parent owns the record defaults and mutation. */
export function RecordRows<T>({
    label,
    values,
    create,
    onChange,
    children,
}: {
    label: string
    values: T[]
    create: () => T
    onChange: (values: T[]) => void
    children: (value: T, index: number, replace: (value: T) => void) => ReactNode
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {values.map((value, index) => (
                <div className="grid gap-2 rounded border p-2" key={index}>
                    {children(value, index, (replacement) =>
                        onChange(values.map((entry, at) => at === index ? replacement : entry))
                    )}
                    <Button type="button" variant="outline" onClick={() => onChange(values.filter((_, at) => at !== index))}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => onChange([...values, create()])}>
                Add
            </Button>
        </div>
    )
}
