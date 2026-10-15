import type { CSSProperties, ReactNode } from 'react'
import { getAtPath } from '@/core/editor-schema/path'
import { translateEnglish } from '@/i18n/text'
import './layoutCard.css'
import type {
    SpecializedPlaybookConfig as Config,
    SpecializedPlaybookDocument as Document,
    SpecializedPlaybookLayout as Layout,
} from './staticDefinitionFactory'

/* One printed hour track has six segments (the rule of the published block). */
const HOUR_SEGMENTS = 6
/* A hold track prints at least this many boxes, as the Obsidian block does. */
const MINIMUM_BOXES: Record<string, number> = { holds: 3 }

const leafOf = (path: string) => path.split('.').pop() ?? path
const humanize = (label: string) => {
    const spaced = label.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
const read = (doc: Document, path: string) => getAtPath(doc, path.split('.'))
const isEmpty = (value: unknown) =>
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)

type Entry = { label?: string; checked?: boolean; note?: string }
const asEntries = (value: unknown): Entry[] =>
    Array.isArray(value)
        ? value.map((item) => {
              if (item && typeof item === 'object') {
                  const record = item as Record<string, unknown>
                  return {
                      label: String(record.label ?? record.name ?? ''),
                      checked: record.checked === true,
                      note:
                          typeof record.note === 'string'
                              ? record.note
                              : typeof record.description === 'string'
                                ? record.description
                                : undefined,
                  }
              }
              return { label: String(item) }
          })
        : []
const asText = (value: unknown): string =>
    Array.isArray(value)
        ? value.map(String).join(', ')
        : value && typeof value === 'object'
          ? ''
          : String(value ?? '')

/** The empty marker a region keeps so that it stays reachable in the editor. */
const Empty = () => <p className="pbta-layout-empty">None yet.</p>

function Boxes({ count, marked }: { count: number; marked: number }) {
    return (
        <span className="pbta-layout-boxes" aria-hidden>
            {Array.from({ length: count }, (_, index) => (
                <span key={index} data-marked={index < marked || undefined} />
            ))}
        </span>
    )
}

type PrimitiveProps = { fields: string[]; doc: Document; header: boolean }

function KeyValue({ fields, doc, header }: PrimitiveProps) {
    const rows = fields.filter((path) => !(header && path === 'name'))
    const name = header ? asText(read(doc, 'name')) : ''
    const shown = rows.filter((path) => !isEmpty(read(doc, path)))
    return (
        <>
            {header && <h2>{name || 'Untitled'}</h2>}
            {shown.length > 0 && (
                <dl className="pbta-layout-pairs">
                    {shown.map((path) => (
                        <div key={path}>
                            <dt>{humanize(leafOf(path))}</dt>
                            <dd>{asText(read(doc, path))}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {!header && shown.length === 0 && <Empty />}
        </>
    )
}

function Prose({ fields, doc, header }: PrimitiveProps) {
    const paragraphs = fields
        .filter((path) => !(header && path === 'name'))
        .map((path) => asText(read(doc, path)))
        .filter(Boolean)
    return (
        <>
            {header && <h2>{asText(read(doc, 'name')) || 'Untitled'}</h2>}
            {paragraphs.map((text, index) => (
                <p key={index}>{text}</p>
            ))}
            {!header && paragraphs.length === 0 && <Empty />}
        </>
    )
}

function List({ fields, doc }: PrimitiveProps) {
    const entries = fields.flatMap((path) => {
        const value = read(doc, path)
        return typeof value === 'string' && value
            ? [{ label: value } as Entry]
            : asEntries(value)
    })
    if (!entries.length) return <Empty />
    return (
        <ul className="pbta-layout-list">
            {entries.map((entry, index) => (
                <li key={index}>
                    {entry.label}
                    {entry.note && <em>{entry.note}</em>}
                </li>
            ))}
        </ul>
    )
}

/*
 * Boxes: a checked-or-not list, a counted row (`xMax`/`xCapacity` with
 * `xMarked`), or a lone number kept as a value.
 */
function BoxesRegion({ fields, doc }: PrimitiveProps) {
    const names = new Set(fields.map(leafOf))
    const counted = (leaf: string) =>
        /(Max|Capacity)$/.test(leaf) &&
        names.has(`${leaf.replace(/(Max|Capacity)$/, '')}Marked`)
    const lines: ReactNode[] = []
    for (const path of fields) {
        const leaf = leafOf(path)
        const value = read(doc, path)
        if (/Marked$/.test(leaf)) continue
        if (counted(leaf)) {
            const base = leaf.replace(/(Max|Capacity)$/, '')
            const marked = Number(read(doc, `${base}Marked`) ?? 0)
            lines.push(
                <div className="pbta-layout-line" key={path}>
                    <span>{humanize(base)}</span>
                    <Boxes count={Number(value) || 0} marked={marked} />
                </div>
            )
        } else if (Array.isArray(value)) {
            const entries = asEntries(value)
            if (!entries.length) continue
            lines.push(
                <ul className="pbta-layout-checks" key={path}>
                    {entries.map((entry, index) => (
                        <li key={index}>
                            <Boxes count={1} marked={entry.checked ? 1 : 0} />
                            <span>{entry.label}</span>
                            {entry.note && <em>{entry.note}</em>}
                        </li>
                    ))}
                </ul>
            )
        } else if (typeof value === 'number' && MINIMUM_BOXES[leaf]) {
            lines.push(
                <div className="pbta-layout-line" key={path}>
                    <span>{humanize(leaf)}</span>
                    <Boxes
                        count={Math.max(MINIMUM_BOXES[leaf], value)}
                        marked={value}
                    />
                </div>
            )
        } else if (!isEmpty(value)) {
            lines.push(
                <div className="pbta-layout-line" key={path}>
                    <span>{humanize(leaf)}</span>
                    <strong>{asText(value)}</strong>
                </div>
            )
        }
    }
    return lines.length ? <>{lines}</> : <Empty />
}

/** A numbered track: the lowest to the highest value, the current one filled. */
function Track({ fields, doc }: PrimitiveProps) {
    const value = read(doc, fields[0]) as
        | { min?: number; max?: number; value?: number }
        | undefined
    if (!value || typeof value !== 'object') return <Empty />
    const min = Number(value.min ?? 0)
    const max = Number(value.max ?? min)
    const current = Number(value.value ?? min)
    const cells: number[] = []
    for (let n = min; n <= max && cells.length < 40; n += 1) cells.push(n)
    return (
        <ol className="pbta-layout-track">
            {cells.map((n) => (
                <li key={n} data-marked={n === current || undefined}>
                    {n}
                </li>
            ))}
        </ol>
    )
}

/** Six printed segments, the marked ones filled, then the steps taken. */
function HourTrack({ fields, doc }: PrimitiveProps) {
    const marked = fields.find((path) => leafOf(path) === 'hoursMarked')
    const steps = fields.find((path) => leafOf(path) === 'steps')
    const count = marked ? Number(read(doc, marked) ?? 0) : 0
    const stepEntries = steps ? asEntries(read(doc, steps)) : []
    return (
        <>
            <ol className="pbta-layout-hours">
                {Array.from({ length: HOUR_SEGMENTS }, (_, index) => (
                    <li key={index} data-marked={index < count || undefined}>
                        {index + 1}
                    </li>
                ))}
            </ol>
            {stepEntries.length > 0 && (
                <ol className="pbta-layout-steps">
                    {stepEntries.map((entry, index) => (
                        <li key={index}>{entry.label}</li>
                    ))}
                </ol>
            )}
        </>
    )
}

/** Each rating in its hexagon. */
function Hexagon({ fields, doc }: PrimitiveProps) {
    const shown = fields.filter((path) => read(doc, path) != null)
    if (!shown.length) return <Empty />
    return (
        <ul className="pbta-layout-hexagons">
            {shown.map((path) => (
                <li key={path}>
                    <strong>{asText(read(doc, path))}</strong>
                    <span>{humanize(leafOf(path))}</span>
                </li>
            ))}
        </ul>
    )
}

/** A card with a cut corner: strings, lists and the image reference it holds. */
function CutCornerCard({ fields, doc, header }: PrimitiveProps) {
    const name = header ? asText(read(doc, 'name')) : ''
    const parts = fields.filter((path) => !(header && path === 'name'))
    const filled = parts.filter((path) => !isEmpty(read(doc, path)))
    return (
        <div className="pbta-layout-cut">
            {header && <h2>{name || 'Untitled'}</h2>}
            {filled.map((path) => {
                const value = read(doc, path)
                if (leafOf(path) === 'tags' && Array.isArray(value))
                    return (
                        <ul className="pbta-layout-tags" key={path}>
                            {value.map((tag, index) => (
                                <li key={index}>{String(tag)}</li>
                            ))}
                        </ul>
                    )
                if (Array.isArray(value))
                    return (
                        <ul className="pbta-layout-list" key={path}>
                            {value.map((item, index) => (
                                <li key={index}>{String(item)}</li>
                            ))}
                        </ul>
                    )
                if (/image$/i.test(leafOf(path)))
                    return (
                        <p className="pbta-layout-image" key={path}>
                            {asText(value)}
                        </p>
                    )
                return <p key={path}>{asText(value)}</p>
            })}
            {!header && filled.length === 0 && <Empty />}
        </div>
    )
}

const PRIMITIVES: Record<string, (props: PrimitiveProps) => ReactNode> = {
    'key-value': KeyValue,
    prose: Prose,
    list: List,
    boxes: BoxesRegion,
    track: Track,
    'hour-track': HourTrack,
    hexagon: Hexagon,
    'cut-corner-card': CutCornerCard,
}

/** The names a pack gives its tokens end the same way: title, heading, body, accent. */
function styleOf(tokens: Record<string, string>): CSSProperties {
    const named = (suffix: string) =>
        Object.entries(tokens).find(([name]) => name.endsWith(suffix))?.[1]
    const accents = Object.entries(tokens).filter(([name]) =>
        /(accent|gold)/.test(name)
    )
    return {
        ...tokens,
        '--layout-title-font': named('-title-font'),
        '--layout-heading-font': named('-heading-font'),
        '--layout-body-font': named('-body-font'),
        '--layout-accent': accents[0]?.[1],
        '--layout-accent-alt': accents[1]?.[1],
    } as CSSProperties
}

type Props = {
    config: Config
    layout: Layout
    doc: Document
    hidden: Record<string, boolean>
    open: (id: string) => void
}

/*
 * Draws a block from its published rows: each row is a line of columns, the
 * regions outside the card follow it, then any region no row names, in the
 * canonical order. Narrow or printed, the rows fold to one column in that order.
 */
export function LayoutCard({ config, layout, doc, hidden, open }: Props) {
    const labels = new Map(
        config.sections.map((section) => [section.id, section] as const)
    )
    const fieldsOf = (id: string) => labels.get(id)?.fields ?? []
    const placed = new Set([...layout.rows.flat(2), ...layout.outsideCard])
    const unplaced = config.sections
        .map((section) => section.id)
        .filter((id) => !placed.has(id))
    const firstRegion = layout.rows[0]?.[0]?.[0]

    const region = (id: string) => {
        const section = labels.get(id)
        if (!section || hidden[id]) return null
        const primitive = layout.regions[id]?.primitive ?? 'prose'
        const header = id === firstRegion
        const Primitive = PRIMITIVES[primitive] ?? Prose
        return (
            <section
                key={id}
                className="pbta-layout-region"
                data-region={id}
                data-primitive={primitive}
                data-group={layout.regions[id]?.group}
                role="button"
                tabIndex={0}
                onClick={() => open(id)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') open(id)
                }}
            >
                {!header && <h3>{translateEnglish(section.label)}</h3>}
                <Primitive
                    fields={fieldsOf(id)}
                    doc={doc}
                    header={header}
                />
            </section>
        )
    }

    return (
        <div
            className="pbta-layout-sheet"
            data-block={config.id}
            style={styleOf(layout.tokens)}
        >
            <article className="pbta-layout-card">
                {layout.rows.map((columns, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="pbta-layout-row"
                        data-row={rowIndex + 1}
                        data-columns={columns.length}
                    >
                        {columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="pbta-layout-column"
                                data-column={columnIndex + 1}
                            >
                                {ids.map(region)}
                            </div>
                        ))}
                    </div>
                ))}
                {unplaced.length > 0 && (
                    <div
                        className="pbta-layout-row"
                        data-row="unplaced"
                        data-columns={1}
                    >
                        <div className="pbta-layout-column">
                            {unplaced.map(region)}
                        </div>
                    </div>
                )}
            </article>
            {layout.outsideCard.length > 0 && (
                <div className="pbta-layout-outside">
                    {layout.outsideCard.map(region)}
                </div>
            )}
        </div>
    )
}
