import { useUiText, type TranslationKey } from '@/i18n/text'
import type { CSSProperties, ReactNode } from 'react'
import appearance from 'schema-pbta/packs/masks/appearance-contract.json'
import {
    useMasksPlaybookStore,
    useMasksSheetStore,
    useMasksViewStore,
} from '../hooks'
import {
    presentation,
    regionById,
    type Move,
    type MasksPlaybook,
    type RegionId,
} from '../model'
import './masksPlaybookTheme.css'

/* The tokens of the published base variant, set on the sheet. */
const tokens = (appearance.variants.find((variant) => variant.id === 'base')
    ?.tokens ?? {}) as CSSProperties

type Text = (key: TranslationKey) => string
type Context = { playbook: MasksPlaybook; text: Text }
type Renderer = (context: Context, id: RegionId) => ReactNode

const signed = (value: number) => (value > 0 ? `+${value}` : String(value))
const label = (id: RegionId) => regionById(id)?.label ?? id

const Box = ({ checked = false }: { checked?: boolean }) => (
    <input type="checkbox" checked={checked} disabled readOnly />
)
const Checks = ({
    entries,
}: {
    entries: { label: string; checked?: boolean; note?: string }[]
}) => (
    <ul className="handbook-masks-checks">
        {entries.map((entry, index) => (
            <li key={index}>
                <Box checked={entry.checked === true} />
                <span>{entry.label}</span>
                {entry.note ? <em>{entry.note}</em> : null}
            </li>
        ))}
    </ul>
)
const Plain = ({ values }: { values: readonly string[] }) => (
    <ul>
        {values.map((value, index) => (
            <li key={index}>{value}</li>
        ))}
    </ul>
)

const moveEntry = (move: Move) =>
    'ref' in move
        ? { label: move.ref, checked: move.checked }
        : { label: move.name, checked: move.checked, note: move.description }

/** One notch per value of the range of a Label; the value of the document is marked. */
function LabelTrack({
    name,
    value,
    range,
}: {
    name: string
    value: number
    range?: { min: number; max: number }
}) {
    if (!range)
        return (
            <div className="handbook-masks-label">
                <span>{name}</span>
                <strong>{signed(value)}</strong>
            </div>
        )
    const notches: number[] = []
    for (let notch = range.min; notch <= range.max; notch += 1)
        notches.push(notch)
    return (
        <div className="handbook-masks-label">
            <span>{name}</span>
            <ol className="handbook-masks-track">
                {notches.map((notch) => (
                    <li
                        key={notch}
                        data-value={notch}
                        data-marked={String(notch === value)}
                    >
                        {signed(notch)}
                    </li>
                ))}
            </ol>
        </div>
    )
}

/** Each region of the contract has one renderer; a region without data draws nothing. */
const RENDERERS: Record<RegionId, Renderer> = {
    'masks-header': ({ playbook }) => (
        <>
            <h2>{playbook.heroName ?? playbook.name}</h2>
            {playbook.heroName ? <span>{playbook.name}</span> : null}
            <p>{playbook.description}</p>
        </>
    ),
    'masks-identity': ({ playbook, text }, id) => {
        const lines = [
            [playbook.realName, 'realName'],
            [playbook.abilities, 'abilities'],
            [playbook.demeanor, 'demeanor'],
        ] as const
        if (!lines.some(([value]) => value)) return null
        return (
            <>
                <h3>{label(id)}</h3>
                <dl>
                    {lines
                        .filter(([value]) => value)
                        .map(([value, key]) => (
                            <div key={key} className="handbook-masks-row">
                                <dt>{text(`pbta:masks.fields.${key}` as TranslationKey)}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                </dl>
            </>
        )
    },
    'masks-backstory': ({ playbook }, id) =>
        playbook.backstory?.length ? (
            <>
                <h3>{label(id)}</h3>
                {playbook.backstory.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </>
        ) : null,
    'masks-relationships': ({ playbook }, id) =>
        playbook.relationships?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.relationships} />
            </>
        ) : null,
    'masks-influence': ({ playbook }, id) =>
        playbook.influence?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.influence} />
            </>
        ) : null,
    /* The frame is always drawn: an https link fills it, otherwise it stays a blank frame. */
    'masks-illustration': ({ playbook }) => {
        const source = playbook.playbookImage?.trim() ?? ''
        return (
            <figure data-empty={String(!/^https:\/\//i.test(source))}>
                {/^https:\/\//i.test(source) ? (
                    <img
                        src={source}
                        alt={playbook.heroName ?? playbook.name}
                    />
                ) : null}
            </figure>
        )
    },
    'masks-labels': ({ playbook }, id) => {
        const keys = Object.keys(playbook.stats)
        if (!keys.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                {keys.map((key) => (
                    <LabelTrack
                        key={key}
                        name={key}
                        value={playbook.stats[key]}
                        range={playbook.statRanges?.[key]}
                    />
                ))}
            </>
        )
    },
    'masks-conditions': ({ playbook }, id) =>
        playbook.conditions?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks
                    entries={playbook.conditions.map((entry) => ({
                        label: entry.name,
                        checked: entry.checked,
                        note: entry.description,
                    }))}
                />
            </>
        ) : null,
    'masks-moment-of-truth': ({ playbook }, id) => (
        <>
            <h3>{label(id)}</h3>
            <p>{playbook.momentOfTruth}</p>
            <label className="handbook-masks-unlock">
                <Box checked={playbook.momentUnlocked === true} />
                <span>{label(id)}</span>
            </label>
        </>
    ),
    'masks-influence-options': ({ playbook }, id) =>
        playbook.influenceOptions?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.influenceOptions} />
            </>
        ) : null,
    'masks-advances': ({ playbook }, id) => {
        const advances = playbook.advancement ?? []
        const max = playbook.potentialMax
        if (!advances.length && max === undefined) return null
        return (
            <>
                <h3>{label(id)}</h3>
                {advances.length ? <Checks entries={advances} /> : null}
                {max !== undefined ? (
                    <div className="handbook-masks-potential">
                        {Array.from({ length: max }, (_, index) => (
                            <Box
                                key={index}
                                checked={index < (playbook.potential ?? 0)}
                            />
                        ))}
                    </div>
                ) : null}
            </>
        )
    },
    'masks-moves': ({ playbook }, id) =>
        playbook.moves.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks entries={playbook.moves.map(moveEntry)} />
            </>
        ) : null,
    'masks-drives': ({ playbook }, id) => {
        const drives = playbook.drives
        if (!drives) return null
        return (
            <>
                <h3>{label(id)}</h3>
                {(drives.intro ?? []).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <Checks entries={drives.options} />
            </>
        )
    },
}

export function MasksPlaybookPreview() {
    const { playbook } = useMasksPlaybookStore()
    const { openSheet } = useMasksSheetStore()
    const view = useMasksViewStore()
    const text = useUiText() as Text

    /* A region draws when the contract names it, it is shown and it has data. */
    const region = (id: RegionId) => {
        if (view.hidden[id]) return null
        const content = RENDERERS[id]?.({ playbook, text }, id)
        if (!content) return null
        const open = () => openSheet({ kind: id })
        return (
            <section
                key={id}
                className="handbook-masks-region"
                data-region={id}
                data-primitive={regionById(id)?.primitive}
                style={
                    {
                        '--pbta-region-order':
                            presentation.canonicalOrder.indexOf(id),
                    } as CSSProperties
                }
                role="button"
                tabIndex={0}
                onClick={open}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') open()
                }}
            >
                {content}
            </section>
        )
    }
    const placed = new Set<RegionId>()
    for (const face of presentation.faces) {
        placed.add(face.header as RegionId)
        for (const ids of face.columns) for (const id of ids) placed.add(id as RegionId)
    }

    return (
        <div className="masks-doc">
            <article
                className="handbook-masks-playbook"
                style={{
                    ...tokens,
                    transform: `scale(${view.zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                {/* Each face is laid out by the columns the presentation contract publishes (rows of the sheet). */}
                {presentation.faces.map((face) => (
                    <div
                        key={face.id}
                        className="handbook-masks-face"
                        data-face={face.id}
                    >
                        {region(face.header as RegionId)}
                        {face.columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="handbook-masks-column"
                                data-column={columnIndex + 1}
                            >
                                {ids.map((id) => region(id as RegionId))}
                            </div>
                        ))}
                    </div>
                ))}
                {/* Regions the contract leaves out of every face follow in canonical order. */}
                {presentation.canonicalOrder
                    .filter((id) => !placed.has(id))
                    .map(region)}
            </article>
        </div>
    )
}
