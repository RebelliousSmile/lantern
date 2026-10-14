import { useUiText } from '@/i18n/text'
import { put, record, type Entry } from '../../shared/editor/clean'
import {
    CheckField,
    LongTextField,
    NumberField,
    TextField,
    useLimits,
} from '../../shared/editor/FieldPrimitives'
import { publishedWounds } from './zone'

const STATE = '/etatDePartie'

/** `root` with `value` at `path`; a value left undefined, and any object it empties, leaves the document. */
function setIn(root: Entry, path: readonly string[], value: unknown): Entry {
    const [head, ...rest] = path
    if (rest.length === 0) return put(root, head, value)
    const child = setIn(record(root[head]), rest, value)
    return put(root, head, Object.keys(child).length > 0 ? child : undefined)
}

const atPath = (root: Entry, path: readonly string[]): unknown =>
    path.reduce<unknown>((value, key) => record(value)[key], root)

/*
 * The state of play, as a click on the sheet reaches it: each block of the sheet that prints a
 * part of it opens that part alone. Values are typed as they are, never computed.
 */
export function StateFields({
    value,
    onChange,
    carries,
}: {
    value: unknown
    onChange: (value: Entry | undefined) => void
    /** Whether the panel carries a document pointer (see `zoneCarries`). */
    carries: (pointer: string) => boolean
}) {
    const text = useUiText()
    const limits = useLimits()
    const state = record(value)
    const limitOf = (path: readonly string[]) =>
        limits(`${STATE}/${path.join('/')}`)
    const write = (path: readonly string[], next: unknown) => {
        const written = setIn(state, path, next)
        onChange(Object.keys(written).length > 0 ? written : undefined)
    }
    const count = (path: readonly string[]) => {
        const stored = atPath(state, path)
        /* A number the document does not hold stays blank: no 0 is shown, none is written. */
        return typeof stored === 'number' ? stored : undefined
    }
    const wounds = (key: 'physiques' | 'mentales') => {
        const published = publishedWounds(
            key === 'physiques' ? 'physical' : 'mental'
        )
        if (!published) return null
        return (
            <fieldset className="grid gap-2 rounded border p-2 text-sm">
                <legend className="px-1 font-medium">
                    {text(
                        key === 'physiques'
                            ? 'adrenaline:pj.form.woundsPhysical'
                            : 'adrenaline:pj.form.woundsMental'
                    )}
                </legend>
                <div className="grid grid-cols-2 gap-3">
                    {published.columns.map((column) => (
                        <div className="grid gap-1" key={column.key}>
                            {published.durations.map((duration) => {
                                const path = [
                                    'blessures',
                                    key,
                                    column.key,
                                ] as const
                                return (
                                    <CheckField
                                        key={duration}
                                        label={durationLabel(text, duration)}
                                        checked={
                                            atPath(state, [
                                                ...path,
                                                duration,
                                            ]) === true
                                        }
                                        onChange={(checked) =>
                                            write(
                                                [...path, duration],
                                                checked ? true : undefined
                                            )
                                        }
                                    />
                                )
                            })}
                            <LongTextField
                                label={text('adrenaline:pj.form.woundNotes')}
                                value={String(
                                    atPath(state, [
                                        'blessures',
                                        key,
                                        column.key,
                                        'notes',
                                    ]) ?? ''
                                )}
                                onChange={(next) =>
                                    write(
                                        ['blessures', key, column.key, 'notes'],
                                        next.trim() ? next : undefined
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>
            </fieldset>
        )
    }
    return (
        <div className="grid gap-3">
            {carries(`${STATE}/stress`) && (
                <fieldset className="grid grid-cols-2 gap-2 rounded border p-2">
                    <legend className="px-1 text-sm font-medium">
                        {text('adrenaline:pj.form.stressHeading')}
                    </legend>
                    <NumberField
                        label={text('adrenaline:pj.sheet.adrenaline')}
                        value={count(['stress', 'adrenaline'])}
                        limit={limitOf(['stress', 'adrenaline'])}
                        onChange={(next) =>
                            write(['stress', 'adrenaline'], next)
                        }
                    />
                    <NumberField
                        label={text('adrenaline:pj.sheet.panic')}
                        value={count(['stress', 'panique'])}
                        limit={limitOf(['stress', 'panique'])}
                        onChange={(next) => write(['stress', 'panique'], next)}
                    />
                </fieldset>
            )}
            {carries(`${STATE}/malus/choc`) && (
                <div className="grid grid-cols-2 gap-2">
                    <NumberField
                        label={text('adrenaline:pj.form.shockRounds')}
                        value={count(['malus', 'choc', 'rounds'])}
                        limit={limitOf(['malus', 'choc', 'rounds'])}
                        onChange={(next) =>
                            write(['malus', 'choc', 'rounds'], next)
                        }
                    />
                    {carries(`${STATE}/malus/choc/notes`) && (
                        <div className="col-span-2">
                            <TextField
                                label={text('adrenaline:pj.form.shockNotes')}
                                value={String(
                                    atPath(state, ['malus', 'choc', 'notes']) ??
                                        ''
                                )}
                                onChange={(next) =>
                                    write(
                                        ['malus', 'choc', 'notes'],
                                        next.trim() ? next : undefined
                                    )
                                }
                            />
                        </div>
                    )}
                </div>
            )}
            {carries(`${STATE}/malus/divers`) && (
                <div className="grid gap-2">
                    <TextField
                        label={text('adrenaline:pj.form.misc')}
                        value={String(atPath(state, ['malus', 'divers']) ?? '')}
                        onChange={(next) =>
                            write(
                                ['malus', 'divers'],
                                next.trim() ? next : undefined
                            )
                        }
                    />
                    <NumberField
                        label={text('adrenaline:pj.form.miscCircles')}
                        value={count(['malus', 'diversCercles'])}
                        limit={limitOf(['malus', 'diversCercles'])}
                        onChange={(next) =>
                            write(['malus', 'diversCercles'], next)
                        }
                    />
                </div>
            )}
            {carries(`${STATE}/malus/total`) && (
                <NumberField
                    label={text('adrenaline:pj.form.totalMaluses')}
                    value={count(['malus', 'total'])}
                    limit={limitOf(['malus', 'total'])}
                    onChange={(next) => write(['malus', 'total'], next)}
                />
            )}
            {carries(`${STATE}/blessures/physiques`) && wounds('physiques')}
            {carries(`${STATE}/blessures/mentales`) && wounds('mentales')}
            {carries(`${STATE}/etats`) && (
                <LongTextField
                    label={text('adrenaline:pj.form.states')}
                    value={typeof state.etats === 'string' ? state.etats : ''}
                    onChange={(next) =>
                        write(['etats'], next.trim() ? next : undefined)
                    }
                />
            )}
        </div>
    )
}

const DURATION_LABELS = {
    heure: 'adrenaline:pj.form.durations.heure',
    jour: 'adrenaline:pj.form.durations.jour',
    semaine: 'adrenaline:pj.form.durations.semaine',
    mois: 'adrenaline:pj.form.durations.mois',
} as const

/** A duration's name; one the translations do not know is shown as published. */
function durationLabel(
    text: ReturnType<typeof useUiText>,
    duration: string
): string {
    return duration in DURATION_LABELS
        ? text(DURATION_LABELS[duration as keyof typeof DURATION_LABELS])
        : duration
}
