import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useId } from 'react'
import { cleanList, filled } from './clean'
import { useDescribedBy } from './draft'
import { CommittedNumberInput, StringRows, useLimits } from './FieldPrimitives'

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
    const describedBy = useDescribedBy()
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Input
                aria-describedby={describedBy}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => onChange(filled(event.target.value))}
            />
        </label>
    )
}

/**
 * A number the document may leave out, validated on leaving the field: a number outside the
 * bounds the schema publishes at `at` is brought back and the field says so, and an emptied
 * field removes the key. Nothing is written that was not typed.
 */
export function OptionalNumberField({
    label,
    value,
    onChange,
    at,
}: {
    label: string
    value: unknown
    onChange: (value: number | undefined) => void
    /** The pointer of the number in the published document, for its bounds. */
    at?: string
}) {
    const limits = useLimits()
    const id = useId()
    return (
        <div className="grid gap-1 text-sm">
            <Label htmlFor={id} className="font-normal">
                {label}
            </Label>
            <CommittedNumberInput
                id={id}
                name={label}
                value={typeof value === 'number' ? value : undefined}
                limit={at === undefined ? undefined : limits(at)}
                onCommit={onChange}
                onClear={() => onChange(undefined)}
            />
        </div>
    )
}

/** A list of non-empty strings: a list left with no string leaves the document. */
export function CleanStringRows({
    label,
    values,
    onChange,
}: {
    label: string
    values: string[]
    onChange: (values: string[] | undefined) => void
}) {
    return (
        <StringRows
            label={label}
            values={values}
            onChange={(next) => onChange(cleanList(next, filled))}
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
    const describedBy = useDescribedBy()
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
                <SelectTrigger
                    className="w-full"
                    aria-describedby={describedBy}
                >
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
