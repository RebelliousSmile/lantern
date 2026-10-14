import { useUiText } from '@/i18n/text'
import {
    CommittedNumberInput,
    useLimits,
} from '../../shared/editor/FieldPrimitives'

/*
 * The player sheet prints one number per value: its panels set them out as one grid, a line per
 * value and the column heads written once. Every input keeps a full accessible name.
 */
const record = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}

const NUMBER_INPUT = 'h-8 px-1'

/**
 * One number, as the sheet prints it: no minimum, no maximum. A document that still holds the old
 * triplet shows its current value and is written back as a plain number.
 */
export function PlainNumberInput({
    name,
    pointer,
    value,
    onChange,
}: {
    name: string
    pointer: string
    value: unknown
    onChange: (value: number) => void
}) {
    const limit = useLimits()(pointer)
    const shown =
        typeof value === 'number'
            ? value
            : typeof record(value).current === 'number'
              ? (record(value).current as number)
              : undefined
    return (
        <CommittedNumberInput
            className={NUMBER_INPUT}
            aria-label={name}
            limit={limit}
            value={shown}
            onCommit={onChange}
        />
    )
}

/**
 * The thresholds of a side of the player sheet: a line per level, the base and the armour (or
 * character) triplets side by side. `levels` are the lines as the sheet words them.
 */
export function PjThresholds({
    kind,
    levels,
    value,
    onChange,
}: {
    kind: 'physique' | 'mental'
    levels: readonly { key: string; label: string }[]
    value: unknown
    onChange: (value: Record<string, unknown>) => void
}) {
    const text = useUiText()
    const current = record(value)
    const block = record(current[kind])
    const groups = [
        {
            field: 'base',
            label: text('adrenaline:shared.health.base'),
        },
        {
            field: 'couvert',
            label: text(
                kind === 'mental'
                    ? 'adrenaline:shared.health.plusTrait'
                    : 'adrenaline:shared.health.plusArmour'
            ),
        },
    ]
    const heading = text(
        kind === 'mental'
            ? 'adrenaline:shared.health.mentalHeading'
            : 'adrenaline:shared.health.physicalHeading'
    )
    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium capitalize">{heading}</h4>
            </div>
            <div
                className="grid grid-cols-[minmax(4.5rem,auto)_repeat(2,minmax(0,1fr))] items-center gap-x-1 gap-y-1.5 text-sm"
                role="group"
                aria-label={heading}
            >
                <span aria-hidden />
                {groups.map(({ label }) => (
                    <span
                        key={label}
                        className="border-b text-center text-xs font-medium"
                    >
                        {label}
                    </span>
                ))}
                {levels.map(({ key, label }) => {
                    const threshold = record(block[key])
                    return (
                        <div
                            className="contents"
                            key={key}
                            role="group"
                            aria-label={label}
                        >
                            <span className="pr-1 font-medium">{label}</span>
                            {groups.map(({ field, label: groupLabel }) => (
                                <PlainNumberInput
                                    key={field}
                                    name={`${heading} — ${label} — ${groupLabel}`}
                                    pointer={`/sante/${kind}/${key}/${field}`}
                                    value={threshold[field]}
                                    onChange={(next) =>
                                        onChange({
                                            ...current,
                                            [kind]: {
                                                ...block,
                                                [key]: {
                                                    ...threshold,
                                                    [field]: next,
                                                },
                                            },
                                        })
                                    }
                                />
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
