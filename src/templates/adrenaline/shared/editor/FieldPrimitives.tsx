import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
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

export type RangedValue = {
    minimum: number
    current: number
    maximum: number
}

export function rangedValue(value: unknown, fallback = 0): RangedValue {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { minimum: 0, current: value, maximum: value }
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { minimum: 0, current: fallback, maximum: fallback }
    }
    const source = value as Partial<RangedValue>
    const minimum = Number.isFinite(source.minimum) ? source.minimum! : 0
    const current = Math.max(
        minimum,
        Number.isFinite(source.current) ? source.current! : fallback
    )
    const maximum = Math.max(
        current,
        Number.isFinite(source.maximum) ? source.maximum! : current
    )
    return { minimum, current, maximum }
}

/** A document value, not view state: all three editable bounds are exported. */
export function RangedNumberField({
    label,
    value,
    onChange,
}: {
    label: string
    value: unknown
    onChange: (value: RangedValue) => void
}) {
    const range = rangedValue(value)
    const setMinimum = (minimum: number) =>
        onChange({
            minimum,
            current: Math.max(minimum, range.current),
            maximum: Math.max(minimum, range.maximum),
        })
    const setCurrent = (current: number) =>
        onChange({
            ...range,
            current: Math.min(range.maximum, Math.max(range.minimum, current)),
        })
    const setMaximum = (maximum: number) =>
        onChange({ ...range, maximum: Math.max(range.current, maximum) })
    const text = useUiText()

    return (
        <fieldset className="grid gap-1 rounded border p-2 text-sm">
            <legend className="px-1">{label}</legend>
            <div className="grid grid-cols-3 gap-1">
                <NumberField
                    label={text('adrenaline:shared.range.min')}
                    value={range.minimum}
                    onChange={setMinimum}
                />
                <NumberField
                    label={text('adrenaline:shared.range.current')}
                    value={range.current}
                    onChange={setCurrent}
                />
                <NumberField
                    label={text('adrenaline:shared.range.max')}
                    value={range.maximum}
                    onChange={setMaximum}
                />
            </div>
        </fieldset>
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
    const text = useUiText()
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
                        {text('actions.remove')}
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => onChange([...values, ''])}
            >
                {text('actions.add')}
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
    children: (
        value: T,
        index: number,
        replace: (value: T) => void
    ) => ReactNode
}) {
    const text = useUiText()
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {values.map((value, index) => (
                <div className="grid gap-2 rounded border p-2" key={index}>
                    {children(value, index, (replacement) =>
                        onChange(
                            values.map((entry, at) =>
                                at === index ? replacement : entry
                            )
                        )
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onChange(values.filter((_, at) => at !== index))
                        }
                    >
                        {text('actions.remove')}
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => onChange([...values, create()])}
            >
                {text('actions.add')}
            </Button>
        </div>
    )
}
