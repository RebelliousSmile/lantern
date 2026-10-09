import { useUiText, type TranslationKey } from '@/i18n/text'
import type { CSSProperties, ReactNode } from 'react'
import appearance from 'schema-pbta/packs/the-sprawl/appearance-contract.json'
import {
    useSprawlPlaybookStore,
    useSprawlSheetStore,
    useSprawlViewStore,
} from '../hooks'
import {
    presentation,
    regionById,
    type TheSprawlPlaybook,
    type Line,
    type Link,
    type Move,
    type RegionId,
} from '../model'
import './sprawlPlaybookTheme.css'

/* The tokens of the published base variant, set on the sheet. */
const tokens = (appearance.variants.find((variant) => variant.id === 'base')
    ?.tokens ?? {}) as CSSProperties

type Text = (key: TranslationKey) => string
type Context = { playbook: TheSprawlPlaybook; text: Text }
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
    <ul className="handbook-sprawl-checks">
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
    <div className="handbook-sprawl-value">
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
    name?: string
    max: number
    marked: number
}) => (
    <div className="handbook-sprawl-boxes">
        {name ? <span>{name}</span> : null}
        {Array.from({ length: max }, (_, index) => (
            <Box key={index} checked={index < marked} />
        ))}
    </div>
)

/** Each region of the contract has one renderer; a region without data draws nothing. */
const RENDERERS: Record<RegionId, Renderer> = {
    'sprawl-header': ({ playbook }) => (
        <>
            <h2>{playbook.characterName ?? playbook.name}</h2>
            {playbook.characterName ? <span>{playbook.name}</span> : null}
            <p>{playbook.description}</p>
        </>
    ),
    'sprawl-look': ({ playbook }, id) =>
        playbook.look?.length ? (
            <>
                <h3>{label(id)}</h3>
                <dl>
                    {playbook.look.map((line: Line, index) => (
                        <div className="handbook-sprawl-row" key={index}>
                            <dt>{line.label}</dt>
                            <dd>{line.value ?? ''}</dd>
                        </div>
                    ))}
                </dl>
            </>
        ) : null,
    'sprawl-gear': ({ playbook }, id) => {
        const gear = (playbook.gear ?? []).map((item) => item.name)
        const mission = playbook.missionGear ?? []
        if (!gear.length && !mission.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                <Plain values={[...gear, ...mission]} />
            </>
        )
    },
    'sprawl-cyberware': ({ playbook }, id) =>
        playbook.cyberware?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks entries={playbook.cyberware} />
            </>
        ) : null,
    'sprawl-moves': ({ playbook }, id) =>
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
    'sprawl-stats': ({ playbook }, id) => {
        const stats = Object.keys(playbook.stats)
        return stats.length ? (
            <>
                <h3>{label(id)}</h3>
                {stats.map((key) => (
                    <Value key={key} name={key} value={playbook.stats[key]} />
                ))}
            </>
        ) : null
    },
    'sprawl-cred-xp': ({ playbook, text }, id) => {
        if (playbook.cred === undefined && playbook.xpMax === undefined)
            return null
        const name = (key: string) =>
            text(`pbta:sprawl.tracks.${key}` as TranslationKey)
        return (
            <>
                <h3>{label(id)}</h3>
                {playbook.cred !== undefined ? (
                    <div className="handbook-sprawl-value">
                        <span>{name('cred')}</span>
                        <strong>{playbook.cred}</strong>
                    </div>
                ) : null}
                {playbook.xpMax !== undefined ? (
                    <Track
                        name={name('xp')}
                        max={playbook.xpMax}
                        marked={playbook.xp ?? 0}
                    />
                ) : null}
            </>
        )
    },
    'sprawl-directives': ({ playbook }, id) => {
        const entries = [
            ...playbook.directives.map((label) => ({ label })),
            ...(playbook.directiveChoices ?? []),
        ]
        return entries.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks entries={entries} />
            </>
        ) : null
    },
    'sprawl-advancement': ({ playbook }, id) =>
        playbook.advancement?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks entries={playbook.advancement} />
            </>
        ) : null,
    'sprawl-links': ({ playbook }, id) =>
        playbook.links?.length ? (
            <>
                <h3>{label(id)}</h3>
                {playbook.links.map((link: Link, index) => (
                    <Value
                        key={index}
                        name={link.name ?? ''}
                        value={link.value}
                    />
                ))}
            </>
        ) : null,
    'sprawl-contacts': ({ playbook }, id) =>
        playbook.contacts?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Plain values={playbook.contacts} />
            </>
        ) : null,
    'sprawl-harm': ({ playbook }, id) =>
        playbook.hoursMarked !== undefined ? (
            <>
                <h3>{label(id)}</h3>
                <Track max={6} marked={playbook.hoursMarked} />
            </>
        ) : null,
}

export function SprawlPlaybookPreview() {
    const { playbook } = useSprawlPlaybookStore()
    const { openSheet } = useSprawlSheetStore()
    const view = useSprawlViewStore()
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
                className="handbook-sprawl-region"
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
        <div className="sprawl-doc">
            <article
                className="handbook-sprawl-playbook"
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
                        className="handbook-sprawl-face"
                        data-face={face.id}
                    >
                        {region(face.header as RegionId)}
                        {face.columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="handbook-sprawl-column"
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
