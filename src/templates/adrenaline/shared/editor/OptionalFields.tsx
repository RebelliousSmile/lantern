import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useState } from 'react'
import { canonical, cleanList, filled } from './clean'
import { StringRows } from './FieldPrimitives'

/* Fields for keys the contract lets a document leave out: emptied, they remove their key. */

export function OptionalTextField({
    label,
    value,
    onChange,
}: {
    label: string
    value: unknown
    onChange: (value: string | undefined) => void
}) {
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Input
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => onChange(filled(event.target.value))}
            />
        </label>
    )
}

/* The entry stays as typed while the field has the focus, so a half-typed number is not rounded. */
export function OptionalNumberField({
    label,
    value,
    onChange,
}: {
    label: string
    value: unknown
    onChange: (value: number | undefined) => void
}) {
    const [draft, setDraft] = useState<string | null>(null)
    const shown = typeof value === 'number' ? String(value) : ''
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Input
                type="number"
                className="px-1.5 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={draft ?? shown}
                onFocus={() => setDraft(shown)}
                onBlur={() => setDraft(null)}
                onChange={(event) => {
                    setDraft(event.target.value)
                    const number = Number.parseInt(event.target.value, 10)
                    onChange(Number.isNaN(number) ? undefined : number)
                }}
            />
        </label>
    )
}

/**
 * A list of non-empty strings: a blank row stays on screen while it is typed and is never
 * written, and a list left with no string leaves the document.
 */
export function CleanStringRows({
    label,
    values,
    onChange,
}: {
    label: string
    values: string[]
    onChange: (values: string[] | undefined) => void
}) {
    const [draft, setDraft] = useState(values)
    if (
        canonical(cleanList(draft, filled)) !==
        canonical(cleanList(values, filled))
    )
        setDraft(values)
    return (
        <StringRows
            label={label}
            values={draft}
            onChange={(next) => {
                setDraft(next)
                onChange(cleanList(next, filled))
            }}
        />
    )
}

const UNSET = 'unset'

/** A closed set the document may leave unset: choosing the blank entry removes the key. */
export function EnumSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string
    value: unknown
    options: [string, TranslationKey | undefined][]
    onChange: (value: string | undefined) => void
}) {
    const text = useUiText()
    /* A value the list does not offer stays selectable as entered, so choosing nothing else never erases it. */
    const unknown =
        typeof value === 'string' &&
        value !== '' &&
        !options.some(([key]) => key === value)
            ? value
            : undefined
    const current =
        unknown ??
        (options.some(([key]) => key === value) ? String(value) : UNSET)
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Select
                value={current}
                onValueChange={(next) =>
                    onChange(next === UNSET ? undefined : next)
                }
            >
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={UNSET}>
                        {text('adrenaline:monstre.form.damageNone')}
                    </SelectItem>
                    {unknown !== undefined && (
                        <SelectItem value={unknown}>{unknown}</SelectItem>
                    )}
                    {options.map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                            {name === undefined ? key : text(name)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </label>
    )
}
