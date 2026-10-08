import { useUiText, type TranslationKey } from '@/i18n/text'
import type { CSSProperties, ReactNode } from 'react'
import appearance from 'schema-pbta/packs/monster-of-the-week/appearance-contract.json'
import {
    useMotwPlaybookStore,
    useMotwSheetStore,
    useMotwViewStore,
} from '../hooks'
import {
    presentation,
    regionById,
    type MonsterOfTheWeekPlaybook,
    type Move,
    type RegionId,
} from '../model'
import './motwPlaybookTheme.css'

/* The tokens of the published base variant, set on the sheet. */
const tokens = (appearance.variants.find((variant) => variant.id === 'base')
    ?.tokens ?? {}) as CSSProperties

type Text = (key: TranslationKey) => string
type Context = { playbook: MonsterOfTheWeekPlaybook; text: Text }
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
    <ul className="handbook-motw-checks">
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

const moveEntry = (move: Move, starting: readonly string[]) =>
    'ref' in move
        ? {
              label: move.ref,
              checked: move.checked === true || starting.includes(move.ref),
          }
        : { label: move.name, checked: move.checked, note: move.description }

const Value = ({ name, value }: { name: string; value: number }) => (
    <div className="handbook-motw-value">
        <span>{name}</span>
        <strong>{signed(value)}</strong>
    </div>
)

/** A track of boxes: `max` printed, the first `marked` ticked. */
const Track = ({
    name,
    max,
    marked,
}: {
    name: string
    max: number
    marked: number
}) => (
    <div className="handbook-motw-boxes">
        <span>{name}</span>
        {Array.from({ length: max }, (_, index) => (
            <Box key={index} checked={index < marked} />
        ))}
    </div>
)

/** Each region of the contract has one renderer; a region without data draws nothing. */
const RENDERERS: Record<RegionId, Renderer> = {
    'motw-header': ({ playbook }) => (
        <>
            <h2>{playbook.heroName ?? playbook.name}</h2>
            {playbook.heroName ? <span>{playbook.name}</span> : null}
            <p>{playbook.description}</p>
        </>
    ),
    'motw-ratings': ({ playbook }, id) => {
        const stats = Object.keys(playbook.stats)
        const ratings = Object.keys(playbook.ratings ?? {})
        const choices = playbook.statChoices ?? []
        if (!stats.length && !ratings.length && !choices.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                {stats.map((key) => (
                    <Value key={key} name={key} value={playbook.stats[key]} />
                ))}
                {ratings.map((key) => (
                    <Value
                        key={key}
                        name={key}
                        value={(playbook.ratings ?? {})[key]}
                    />
                ))}
                {choices.length ? <Checks entries={choices} /> : null}
            </>
        )
    },
    'motw-tracks': ({ playbook, text }, id) => {
        const luckMax = playbook.luckMax
        const harmMax = playbook.harmMax
        const experienceMax = playbook.experienceMax
        if (
            luckMax === undefined &&
            harmMax === undefined &&
            experienceMax === undefined &&
            playbook.unstable === undefined
        )
            return null
        const name = (key: string) =>
            text(`pbta:motw.tracks.${key}` as TranslationKey)
        return (
            <>
                <h3>{label(id)}</h3>
                {luckMax !== undefined ? (
                    <Track
                        name={name('luck')}
                        max={luckMax}
                        marked={playbook.luckMarked ?? playbook.luck ?? 0}
                    />
                ) : null}
                {harmMax !== undefined ? (
                    <Track
                        name={name('harm')}
                        max={harmMax}
                        marked={playbook.harmMarked ?? 0}
                    />
                ) : null}
                {playbook.unstable !== undefined ? (
                    <div className="handbook-motw-boxes">
                        <Box checked={playbook.unstable} />
                        <span>{name('unstable')}</span>
                    </div>
                ) : null}
                {experienceMax !== undefined ? (
                    <Track
                        name={name('experience')}
                        max={experienceMax}
                        marked={playbook.experienceMarked ?? 0}
                    />
                ) : null}
            </>
        )
    },
    'motw-weapon': ({ playbook }, id) =>
        playbook.specialWeapon ? (
            <>
                <h3>{label(id)}</h3>
                <p>{playbook.specialWeapon}</p>
            </>
        ) : null,
    'motw-moves': ({ playbook }, id) =>
        playbook.moves.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks
                    entries={playbook.moves.map((move) =>
                        moveEntry(move, playbook.startingMoves ?? [])
                    )}
                />
            </>
        ) : null,
    'motw-look': ({ playbook }, id) =>
        playbook.look?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.look} />
            </>
        ) : null,
    'motw-introductions': ({ playbook }, id) => {
        const lines = [
            ...(playbook.introductions ?? []),
            ...(playbook.history ?? []),
        ]
        return lines.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={lines} />
            </>
        ) : null
    },
    'motw-improvements': ({ playbook }, id) => {
        const entries = [
            ...playbook.improvements,
            ...(playbook.advancements ?? []),
        ]
        return entries.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks entries={entries} />
            </>
        ) : null
    },
    'motw-notes': ({ playbook }, id) =>
        playbook.notes?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.notes} />
            </>
        ) : null,
}

export function MotwPlaybookPreview() {
    const { playbook } = useMotwPlaybookStore()
    const { openSheet } = useMotwSheetStore()
    const view = useMotwViewStore()
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
                className="handbook-motw-region"
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
        for (const ids of face.columns)
            for (const id of ids) placed.add(id as RegionId)
    }

    return (
        <div className="motw-doc">
            <article
                className="handbook-motw-playbook"
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
                        className="handbook-motw-face"
                        data-face={face.id}
                    >
                        {region(face.header as RegionId)}
                        {face.columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="handbook-motw-column"
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
