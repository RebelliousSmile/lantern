import { useUiText } from '@/i18n/text'
import { createContext, useContext, useId, type ReactNode } from 'react'
import { filled, type Entry } from './clean'
import { requiredAt, type SchemaName } from './schemaShapes'

/*
 * A line or a group enters the exported document whole, or not at all. The editor keeps what is
 * typed of an incomplete one as a draft: it stays in the panel and on the sheet, and a status says
 * what it lacks. The fields of the draft point at that status (`aria-describedby`), so that the
 * signal belongs to them and not to the page.
 */

/** The id of the status the fields below describe themselves with, when a draft is open. */
const DescribedBy = createContext<string | undefined>(undefined)
export const useDescribedBy = (): string | undefined => useContext(DescribedBy)

/** Which published document the fields below belong to, so that rows can read their required keys. */
const SchemaContext = createContext<SchemaName | undefined>(undefined)
export const SchemaProvider = SchemaContext.Provider
export const useSchemaName = (): SchemaName | undefined =>
    useContext(SchemaContext)

/** The caption of each required key, as the panels word it; a key not listed is shown as published. */
export const REQUIRED_LABELS: Record<string, string> = {
    nom: 'fields.name',
    type: 'adrenaline:shared.type',
    versant: 'adrenaline:pj.form.stateSide',
    pourcentage: 'adrenaline:shared.percentage',
    des: 'adrenaline:shared.protection.dice',
    solidite: 'adrenaline:shared.protection.toughness',
    profils: 'adrenaline:monstre.form.damageProfiles',
}

/** Whether a value is a value of the document: a blank string and an empty list are not. */
const isGiven = (value: unknown): boolean => {
    if (value === undefined || value === null) return false
    if (typeof value === 'string') return filled(value) !== undefined
    if (Array.isArray(value)) return value.length > 0
    return true
}

/** The keys `entry` lacks of those the published schema requires at `pointer`. */
export function missingKeys(
    schema: SchemaName,
    pointer: string,
    entry: Entry
): string[] {
    return requiredAt(schema, pointer).filter((key) => !isGiven(entry[key]))
}

/**
 * The status of a draft and the scope of the fields it describes. Nothing is rendered around a
 * complete line.
 */
export function DraftScope({
    missing,
    children,
    className,
}: {
    /** The captions of what is missing; none when the line is whole. */
    missing: readonly string[]
    children: ReactNode
    className?: string
}) {
    const text = useUiText()
    const id = useId()
    /* Without a status of its own, the scope leaves the fields to the status above it. */
    const inherited = useDescribedBy()
    const described = missing.length > 0
    return (
        <DescribedBy.Provider value={described ? id : inherited}>
            <div
                className={described ? (className ?? 'grid gap-2') : 'contents'}
            >
                {children}
                {described && (
                    <p
                        id={id}
                        role="status"
                        className="text-xs text-muted-foreground"
                    >
                        {text('adrenaline:shared.draft.incomplete', {
                            missing: missing.join(', '),
                        })}
                    </p>
                )}
            </div>
        </DescribedBy.Provider>
    )
}

/** The captions of the missing keys of a row, from the schema its panel belongs to. */
export function useMissingCaptions(
    pointer: string | undefined,
    entry: unknown
): string[] {
    const text = useUiText()
    const schema = useSchemaName()
    if (!schema || !pointer) return []
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return []
    return missingKeys(schema, pointer, entry as Entry).map((key) =>
        key in REQUIRED_LABELS ? text(REQUIRED_LABELS[key] as never) : key
    )
}

/**
 * Like `useMissingCaptions`, for an optional group (a test, a damage): nothing is said while the
 * group holds nothing, since it is then not a draft but not there.
 */
export function useGroupCaptions(
    pointer: string | undefined,
    entry: unknown
): string[] {
    const captions = useMissingCaptions(pointer, entry)
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return []
    const held = Object.values(entry as Entry).some(isGiven)
    return held ? captions : []
}

/**
 * One status and the fields it describes, for a draft that is not a row of a list (a half-typed
 * reduction, a shield without a name). The wrapper stays without a message (`display: contents`), so that the fields typed into are
 * not remounted when the status appears or goes.
 */
export function StatusScope({
    message,
    children,
    className,
}: {
    /** What the draft lacks, worded; none when nothing is waiting. */
    message: string | undefined
    children: ReactNode
    className?: string
}) {
    const id = useId()
    /* Without a status of its own, the scope leaves the fields to the status above it. */
    const inherited = useDescribedBy()
    const described = message !== undefined
    return (
        <DescribedBy.Provider value={described ? id : inherited}>
            <div
                className={described ? (className ?? 'grid gap-2') : 'contents'}
            >
                {children}
                {described && (
                    <p
                        id={id}
                        role="status"
                        className="text-xs text-muted-foreground"
                    >
                        {message}
                    </p>
                )}
            </div>
        </DescribedBy.Provider>
    )
}

/** Points the fields below at a status rendered elsewhere (`undefined`: none to point at). */
export function DescribedByScope({
    id,
    children,
}: {
    id: string | undefined
    children: ReactNode
}) {
    return <DescribedBy.Provider value={id}>{children}</DescribedBy.Provider>
}
