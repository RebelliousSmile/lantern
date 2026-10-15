import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import {
    createContext,
    useContext,
    useEffect,
    useId,
    useState,
    type ComponentProps,
    type ReactNode,
} from 'react'
import { canonical, filled } from './clean'
import {
    DraftScope,
    useDescribedBy,
    useMissingCaptions,
    useSchemaName,
} from './draft'
import { limitAt } from './pjLimits'

/** The inclusive bounds of a number; a side left out is not bounded. */
export type Limit = { min?: number; max?: number }

/**
 * The bounds a document's schema publishes, by pointer. A sheet whose schema bounds its numbers
 * provides it; without a provider no field is bounded.
 */
const LimitsContext = createContext<
    ((pointer: string) => Limit | undefined) | undefined
>(undefined)
export const LimitsProvider = LimitsContext.Provider
export const useLimits = (): ((pointer: string) => Limit | undefined) => {
    const given = useContext(LimitsContext)
    const schema = useSchemaName()
    if (given) return given
    /* A panel that names its published document reads the bounds of that document. */
    return schema
        ? (pointer: string) => limitAt(schema, pointer)
        : () => undefined
}

/** `value` brought back into `limit`. */
export const clampTo = (value: number, limit?: Limit): number =>
    Math.min(
        limit?.max ?? Number.POSITIVE_INFINITY,
        Math.max(limit?.min ?? Number.NEGATIVE_INFINITY, value)
    )

/** Two bounds at once: the narrowest of each side. */
export const narrow = (a?: Limit, b?: Limit): Limit => ({
    min:
        a?.min === undefined
            ? b?.min
            : b?.min === undefined
              ? a.min
              : Math.max(a.min, b.min),
    max:
        a?.max === undefined
            ? b?.max
            : b?.max === undefined
              ? a.max
              : Math.min(a.max, b.max),
})

/** A label above its input, or beside it when `inline` keeps a dense grid to one line per field. */
const fieldLayout = (inline: boolean) =>
    inline
        ? 'grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-2 text-sm'
        : 'grid gap-1 text-sm'

export function TextField({
    label,
    value,
    onChange,
    inline = false,
    invalid = false,
    describedBy: explained,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    inline?: boolean
    /** The typed text is not what the document holds: the field is flagged and `describedBy` says why. */
    invalid?: boolean
    describedBy?: string
}) {
    const describedBy = useDescribedBy()
    return (
        <label className={fieldLayout(inline)}>
            <span>{label}</span>
            <Input
                value={value}
                aria-invalid={invalid ? true : undefined}
                aria-describedby={invalid && explained ? explained : describedBy}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}

/**
 * A text the contract requires (the name of a sheet). Emptying it never empties the document: the
 * last name stays, the field shows what is typed, and a status says that the last name is the one
 * exported until another is typed.
 */
export function RequiredTextField({
    label,
    value,
    onChange,
    inline = false,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    inline?: boolean
}) {
    const text = useUiText()
    const statusId = useId()
    const describedBy = useDescribedBy()
    const [typed, setTyped] = useState<string | undefined>(undefined)
    const blank = typed !== undefined && typed.trim() === ''
    return (
        <div className="grid gap-1">
            <label className={fieldLayout(inline)}>
                <span>{label}</span>
                <Input
                    value={typed ?? value}
                    aria-invalid={blank ? true : undefined}
                    aria-describedby={blank ? statusId : describedBy}
                    onChange={(event) => {
                        const next = event.target.value
                        if (next.trim() === '') {
                            setTyped(next)
                            return
                        }
                        setTyped(undefined)
                        onChange(next)
                    }}
                />
            </label>
            {blank && (
                <p
                    id={statusId}
                    role="status"
                    className="text-xs text-muted-foreground"
                >
                    {value.trim() === ''
                        ? text('adrenaline:shared.draft.nameMissing')
                        : text('adrenaline:shared.draft.nameKept', {
                              name: value,
                          })}
                </p>
            )}
        </div>
    )
}

export function NumberField({
    label,
    value,
    onChange,
    onClear,
    inline = false,
    limit,
}: {
    label: string
    /** A number the document does not hold yet is `undefined`: the field is blank, not a typed 0. */
    value: number | undefined
    onChange: (value: number) => void
    /** A key the document may leave out: emptying the field removes it instead of typing a 0. */
    onClear?: () => void
    inline?: boolean
    /** A bounded number is validated on leaving the field and the bound is signalled. */
    limit?: Limit
}) {
    /* Every number is validated on leaving the field: a blank one writes no 0 of its own. */
    return (
        <CommittedNumberField
            label={label}
            value={value}
            onCommit={onChange}
            onClear={onClear}
            inline={inline}
            limit={limit}
        />
    )
}

const NUMBER_CELL =
    'px-1.5 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'

/** Sent on the document when a number is validated: a bound alert of another field is then stale. */
const VALIDATED = 'adrenaline:number-validated'

/**
 * A whole-number input that takes free typing: what is typed stays as typed, and the number goes to
 * the document when the field is validated (leaving it, or Enter), never on a keystroke. A bound
 * applied to each keystroke rewrites the number being typed.
 */
export function CommittedNumberInput({
    value,
    onCommit,
    onClear,
    limit,
    name,
    className = '',
    ...rest
}: {
    /** `undefined` when the document holds no number: the field is blank until one is typed. */
    value: number | undefined
    onCommit: (value: number) => void
    /** Given for a key the document may leave out: a blank field then removes it. */
    onClear?: () => void
    /** The bounds of the number: a value outside is brought back and the field says so. */
    limit?: Limit
    /** The field's name in its message; the accessible name by default. */
    name?: string
} & Omit<
    ComponentProps<typeof Input>,
    'value' | 'onChange' | 'onBlur' | 'onKeyDown' | 'type'
>) {
    const text = useUiText()
    const alertId = useId()
    const describedBy = useDescribedBy()
    const [draft, setDraft] = useState<string | undefined>(undefined)
    const [blank, setBlank] = useState(false)
    const [issue, setIssue] = useState<
        { typed: number; bound: number } | undefined
    >(undefined)
    /* A bound alert says what the last input did: a number validated elsewhere ends it. */
    useEffect(() => {
        const clear = (event: Event) => {
            if ((event as CustomEvent<string>).detail !== alertId)
                setIssue(undefined)
        }
        document.addEventListener(VALIDATED, clear)
        return () => document.removeEventListener(VALIDATED, clear)
    }, [alertId])
    const validate = () => {
        if (draft === undefined) return
        /* A blank field left blank types nothing. */
        if (draft.trim() === '' && value === undefined) {
            setDraft(undefined)
            return
        }
        /* Blank over a number the key cannot lose: the draft stays, flagged, nothing is written. */
        if (draft.trim() === '' && !onClear) {
            setBlank(true)
            return
        }
        setBlank(false)
        setDraft(undefined)
        if (draft.trim() === '' && onClear) {
            setIssue(undefined)
            document.dispatchEvent(
                new CustomEvent(VALIDATED, { detail: alertId })
            )
            onClear()
            return
        }
        const typed = Math.trunc(Number(draft)) || 0
        const next = clampTo(typed, limit)
        setIssue(next === typed ? undefined : { typed, bound: next })
        document.dispatchEvent(new CustomEvent(VALIDATED, { detail: alertId }))
        if (next !== value) onCommit(next)
    }
    return (
        <>
            <Input
                {...rest}
                type="number"
                min={limit?.min}
                max={limit?.max}
                className={`${NUMBER_CELL} ${className}`}
                value={draft ?? (value === undefined ? '' : String(value))}
                aria-invalid={issue || blank ? true : undefined}
                aria-describedby={
                    issue || blank
                        ? alertId
                        : (rest['aria-describedby'] ?? describedBy)
                }
                onChange={(event) => {
                    setIssue(undefined)
                    setBlank(false)
                    setDraft(event.target.value)
                }}
                onBlur={validate}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') validate()
                }}
            />
            {blank && !issue && (
                <p
                    id={alertId}
                    role="status"
                    className="order-last col-span-full text-xs text-muted-foreground"
                >
                    {text('adrenaline:shared.draft.numberMissing', {
                        name: name ?? rest['aria-label'] ?? '',
                    })}
                </p>
            )}
            {issue && (
                <p
                    id={alertId}
                    role="alert"
                    className="order-last col-span-full text-xs text-destructive"
                >
                    {text(
                        issue.typed < issue.bound
                            ? 'adrenaline:shared.bounds.below'
                            : 'adrenaline:shared.bounds.above',
                        {
                            name: name ?? rest['aria-label'] ?? '',
                            value: String(issue.typed),
                            bound: String(issue.bound),
                        }
                    )}
                </p>
            )}
        </>
    )
}

/** A labelled number whose value is validated on leaving the field (see `CommittedNumberInput`). */
export function CommittedNumberField({
    label,
    value,
    onCommit,
    onClear,
    limit,
    inline = false,
}: {
    label: string
    value: number | undefined
    onCommit: (value: number) => void
    onClear?: () => void
    limit?: Limit
    inline?: boolean
}) {
    const id = useId()
    return (
        <div className={fieldLayout(inline)}>
            <Label htmlFor={id} className="font-normal">
                {label}
            </Label>
            <CommittedNumberInput
                id={id}
                value={value}
                onCommit={onCommit}
                onClear={onClear}
                limit={limit}
                name={label}
            />
        </div>
    )
}

export type RangedValue = {
    minimum: number
    current: number
    maximum: number
}

/** Whether the document holds a number or a triplet there: an unset one is shown blank, not as a typed 0. */
export const isRangeSet = (value: unknown): boolean =>
    typeof value === 'number' ||
    (!!value && typeof value === 'object' && !Array.isArray(value))

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

/** The triplet once one of its bounds is set: the others follow so that minimum <= current <= maximum. */
export function withRangedBound(
    range: RangedValue,
    bound: keyof RangedValue,
    next: number
): RangedValue {
    if (bound === 'minimum')
        return {
            minimum: next,
            current: Math.max(next, range.current),
            maximum: Math.max(next, range.maximum),
        }
    if (bound === 'current')
        return {
            ...range,
            current: Math.min(range.maximum, Math.max(range.minimum, next)),
        }
    return { ...range, maximum: Math.max(range.current, next) }
}

/**
 * The bounds each of the three numbers of a triplet is typed within: the schema's `limit`, and the
 * order minimum <= current <= maximum that `withRangedBound` keeps.
 */
export function tripletLimit(
    range: RangedValue,
    bound: keyof RangedValue,
    limit?: Limit
): Limit {
    /* The minimum is bounded by the current value: raising it never moves the current one. */
    if (bound === 'minimum') return narrow(limit, { max: range.current })
    if (bound === 'current')
        return narrow(limit, { min: range.minimum, max: range.maximum })
    return narrow(limit, { min: range.current })
}

/**
 * The bounds the number of a triplet is typed within. One behaviour for every triplet of the
 * sheets: the maximum that equalled the current value follows it (and says so, see `enterBound`),
 * so a first value is typed in one field; otherwise the order minimum <= current <= maximum bounds
 * the field.
 */
export function boundLimit(
    range: RangedValue,
    bound: keyof RangedValue,
    limit?: Limit
): Limit {
    return bound === 'current' && range.current === range.maximum
        ? narrow(limit, { min: range.minimum })
        : tripletLimit(range, bound, limit)
}

/** A number another one dragged along when it was typed: the value it took, and the bound that moved it. */
export type Followed = { value: number; by: 'current' | 'minimum' }

/** The triplet once `bound` is typed, and what it dragged along when it did. */
export function enterBound(
    range: RangedValue,
    bound: keyof RangedValue,
    next: number
): { value: RangedValue; followed?: Followed } {
    const together =
        bound === 'current' &&
        range.current === range.maximum &&
        next !== range.maximum
    if (together)
        return {
            value: { ...range, current: next, maximum: next },
            followed: { value: next, by: 'current' },
        }
    /* A minimum raised above the current value takes it along: said, not silent. */
    const raised = bound === 'minimum' && next > range.current
    return {
        value: withRangedBound(range, bound, next),
        ...(raised ? { followed: { value: next, by: 'minimum' as const } } : {}),
    }
}

/** The status of a maximum that followed a typed current value; nothing while none did. */
export function FollowedStatus({
    id,
    name,
    value,
}: {
    id: string
    name: string
    value: Followed | undefined
}) {
    const text = useUiText()
    if (value === undefined) return null
    return (
        <p
            id={id}
            role="status"
            className="col-span-full text-xs text-muted-foreground"
        >
            {text(
                value.by === 'minimum'
                    ? 'adrenaline:shared.range.followedMinimum'
                    : 'adrenaline:shared.range.followed',
                {
                    name,
                    value: String(value.value),
                }
            )}
        </p>
    )
}

/** A document value, not view state: all three editable bounds are exported. */
export function RangedNumberField({
    label,
    value,
    onChange,
    limit,
}: {
    label: string
    value: unknown
    onChange: (value: RangedValue) => void
    /** The schema's bounds of each of the three numbers. */
    limit?: Limit
}) {
    const range = rangedValue(value)
    const [followed, setFollowed] = useState<Followed | undefined>(undefined)
    const followedId = useId()
    const enter = (bound: keyof RangedValue) => (next: number) => {
        const entered = enterBound(range, bound, next)
        setFollowed(entered.followed)
        onChange(entered.value)
    }
    const setMinimum = enter('minimum')
    const setCurrent = enter('current')
    const setMaximum = enter('maximum')
    const text = useUiText()
    const set = isRangeSet(value)

    return (
        <fieldset className="grid gap-1 rounded border p-2 text-sm">
            <legend className="px-1">{label}</legend>
            <div className="grid grid-cols-3 gap-1">
                {(
                    [
                        ['minimum', 'adrenaline:shared.range.min', setMinimum],
                        [
                            'current',
                            'adrenaline:shared.range.current',
                            setCurrent,
                        ],
                        ['maximum', 'adrenaline:shared.range.max', setMaximum],
                    ] as const
                ).map(([bound, key, commit]) => (
                    <BoundField
                        key={bound}
                        label={text(key)}
                        name={`${label} — ${text(key)}`}
                        describedBy={
                            followed !== undefined ? followedId : undefined
                        }
                        value={set ? range[bound] : undefined}
                        /* An unset triplet bounds nothing by its absent numbers: the first one typed is kept as typed. */
                        limit={set ? boundLimit(range, bound, limit) : limit}
                        onCommit={commit}
                    />
                ))}
            </div>
            <FollowedStatus id={followedId} name={label} value={followed} />
        </fieldset>
    )
}

/**
 * How a sheet writes a numeric value: the player sheet keeps the `{minimum, current, maximum}` triplet
 * (its scores evolve), a creature or a PNJ writes one plain number (its scores do not). A triplet already
 * in a creature or PNJ document is read by its current value and rewritten as a plain number on edit.
 */
export type ValueForm = 'triplet' | 'number'

/** The value a new row starts with, in the sheet's form. */
export const zeroValue = (form: ValueForm): number | RangedValue =>
    form === 'number' ? 0 : { minimum: 0, current: 0, maximum: 0 }

/** One field per value in the sheet's form: three bounds for a triplet, one number otherwise. */
export function ValueField({
    form,
    label,
    value,
    onChange,
    limit,
}: {
    form: ValueForm
    label: string
    value: unknown
    onChange: (value: number | RangedValue) => void
    limit?: Limit
}) {
    if (form === 'triplet')
        return (
            <RangedNumberField
                label={label}
                value={value}
                onChange={onChange}
                limit={limit}
            />
        )
    return (
        <NumberField
            label={label}
            value={isRangeSet(value) ? rangedValue(value).current : undefined}
            onChange={onChange}
            limit={limit}
        />
    )
}

/** One of the three numbers of a triplet: its caption above, its accessible name whole. */
function BoundField({
    label,
    name,
    value,
    limit,
    onCommit,
    describedBy,
}: {
    label: string
    name: string
    value: number | undefined
    limit?: Limit
    onCommit: (value: number) => void
    /** The status that says something about this number (see `DraftScope`). */
    describedBy?: string
}) {
    const id = useId()
    return (
        <div className="grid min-w-0 gap-0.5 text-sm">
            {label !== '' && (
                <Label
                    htmlFor={id}
                    className="text-xs font-normal text-muted-foreground"
                >
                    {label}
                </Label>
            )}
            <CommittedNumberInput
                id={id}
                aria-label={name}
                aria-describedby={describedBy}
                name={name}
                value={value}
                limit={limit}
                onCommit={onCommit}
            />
        </div>
    )
}

/**
 * The percentage of a skill or a weapon: its three numbers on one line, each typed as it is. The
 * ceiling follows the current value for as long as they were equal, so that a new percentage is
 * typed in one field.
 */
export function PercentageField({
    label,
    value,
    onChange,
    limit,
    single = false,
}: {
    label: string
    value: unknown
    onChange: (value: RangedValue) => void
    limit?: Limit
    /** Only the current value is typed: a printed sheet shows one percentage, no bounds. */
    single?: boolean
}) {
    const text = useUiText()
    const range = rangedValue(value)
    const allBounds = [
        ['minimum', 'adrenaline:shared.range.min'],
        ['current', 'adrenaline:shared.range.current'],
        ['maximum', 'adrenaline:shared.range.max'],
    ] as const
    const bounds = single
        ? allBounds.filter(([bound]) => bound === 'current')
        : allBounds
    const set = isRangeSet(value)
    /* The maximum that followed the current value is said, never silent. */
    const [followed, setFollowed] = useState<Followed | undefined>(undefined)
    const followedId = useId()
    /* An unset triplet bounds nothing by its absent numbers: the first one typed is kept as typed. */
    const limitOf = (bound: keyof RangedValue) =>
        set ? boundLimit(range, bound, limit) : limit
    return (
        <div className="grid gap-1 text-sm" role="group" aria-label={label}>
            <span>{label}</span>
            <div
                className={
                    single ? 'grid grid-cols-1 gap-1' : 'grid grid-cols-3 gap-1'
                }
            >
                {bounds.map(([bound, key]) => (
                    <BoundField
                        key={bound}
                        label={single ? '' : text(key)}
                        name={single ? label : `${label} — ${text(key)}`}
                        describedBy={
                            followed !== undefined ? followedId : undefined
                        }
                        value={set ? range[bound] : undefined}
                        limit={limitOf(bound)}
                        onCommit={(next) => {
                            const entered = enterBound(range, bound, next)
                            setFollowed(entered.followed)
                            onChange(entered.value)
                        }}
                    />
                ))}
            </div>
            <FollowedStatus id={followedId} name={label} value={followed} />
        </div>
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
    const describedBy = useDescribedBy()
    return (
        <div className="grid gap-1">
            <Label>{label}</Label>
            <Textarea
                value={value}
                aria-describedby={describedBy}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

/**
 * A list of strings. A blank row stays on screen while it is typed and is never handed to the
 * document: the handler receives the non-blank strings only, so a row being typed is a draft of the
 * panel and not a value the sheet shows and the export loses.
 */
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
    const describedBy = useDescribedBy()
    const [draft, setDraft] = useState(values)
    const given = (list: string[]) => list.filter((entry) => filled(entry))
    /* The document changed under the panel (another field, an undo): its list replaces the draft. */
    const rows =
        canonical(given(draft)) === canonical(given(values)) ? draft : values
    const write = (next: string[]) => {
        setDraft(next)
        onChange(given(next))
    }
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {rows.map((value, index) => (
                <div className="flex gap-2" key={index}>
                    <Input
                        value={value}
                        aria-describedby={describedBy}
                        onChange={(event) =>
                            write(
                                rows.map((entry, at) =>
                                    at === index ? event.target.value : entry
                                )
                            )
                        }
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            write(rows.filter((_, at) => at !== index))
                        }
                    >
                        {text('actions.remove')}
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => write([...rows, ''])}
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
    fold,
    at,
}: {
    label: string
    values: T[]
    create: () => T
    onChange: (values: T[]) => void
    /**
     * Where the schema of the document describes one row (`/formations[]`): a row that lacks a key
     * it requires is a draft, signalled and left out of the export.
     */
    at?: string
    /** One entry open at a time, the others a line each: keeps a long list to a short panel. */
    fold?: { summary: (value: T) => string; open?: number; only?: boolean }
    children: (
        value: T,
        index: number,
        replace: (value: T) => void
    ) => ReactNode
}) {
    const text = useUiText()
    const [opened, setOpened] = useState<number | undefined>(fold?.open)
    /* Opened from one zone of the sheet: that row alone, the others one click away. */
    const [all, setAll] = useState(false)
    const onlyOpened = Boolean(fold?.only) && opened !== undefined && !all
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {onlyOpened ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAll(true)}
                >
                    {text('adrenaline:shared.skills.showAll')}
                </Button>
            ) : null}
            {values.map((value, index) =>
                onlyOpened && opened !== index ? null : fold &&
                  opened !== index ? (
                    <Button
                        className="justify-start"
                        key={index}
                        type="button"
                        variant="outline"
                        onClick={() => setOpened(index)}
                    >
                        {fold.summary(value) || `#${index + 1}`}
                    </Button>
                ) : (
                    <div className="grid gap-2 rounded border p-2" key={index}>
                        <RowDraft pointer={at} entry={value}>
                            {children(value, index, (replacement) =>
                                onChange(
                                    values.map((entry, position) =>
                                        position === index ? replacement : entry
                                    )
                                )
                            )}
                        </RowDraft>
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
                )
            )}
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    if (fold) setOpened(values.length)
                    onChange([...values, create()])
                }}
            >
                {text('actions.add')}
            </Button>
        </div>
    )
}

/** A row of a list: while it lacks a required key, its fields point at the status that says which. */
function RowDraft({
    pointer,
    entry,
    children,
}: {
    pointer: string | undefined
    entry: unknown
    children: ReactNode
}) {
    const missing = useMissingCaptions(pointer, entry)
    return <DraftScope missing={missing}>{children}</DraftScope>
}

const NO_OPTION = '__none__'

/** A pick among published values; with a `noneLabel` the field is optional and picking it leaves it out of the document. */
export function OptionSelect({
    label,
    value,
    options,
    noneLabel,
    onChange,
    describedBy: explicit,
}: {
    label: string
    value: unknown
    options: readonly { value: string; label: string }[]
    noneLabel?: string
    onChange: (value: string | undefined) => void
    /** The status that concerns this select, when the scope does not already point at one. */
    describedBy?: string
}) {
    const scoped = useDescribedBy()
    const describedBy = explicit ?? scoped
    const current =
        typeof value === 'string' &&
        options.some((option) => option.value === value)
            ? value
            : NO_OPTION
    return (
        <label className="grid gap-1 text-sm">
            <span>{label}</span>
            <Select
                value={current}
                onValueChange={(next) =>
                    onChange(next === NO_OPTION ? undefined : next)
                }
            >
                <SelectTrigger
                    className="w-full"
                    aria-describedby={describedBy}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {noneLabel !== undefined && (
                        <SelectItem value={NO_OPTION}>{noneLabel}</SelectItem>
                    )}
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </label>
    )
}

/** A tick box; an unticked one is a field left out of the document, never a written `false`. */
export function CheckField({
    label,
    checked,
    onChange,
}: {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    const describedBy = useDescribedBy()
    return (
        <label className="flex items-center gap-2 text-sm">
            <Checkbox
                checked={checked}
                aria-describedby={describedBy}
                onCheckedChange={(next) => onChange(next === true)}
            />
            <span>{label}</span>
        </label>
    )
}
