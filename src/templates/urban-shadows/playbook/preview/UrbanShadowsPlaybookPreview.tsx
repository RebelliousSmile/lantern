import { useUiText, type TranslationKey } from '@/i18n/text'
import type { CSSProperties, ReactNode } from 'react'
import appearance from 'schema-pbta/packs/urban-shadows/appearance-contract.json'
import brushFontUrl from 'schema-pbta/packs/urban-shadows/assets/fonts/caveat-brush-400-normal.woff2'
import displayFontUrl from 'schema-pbta/packs/urban-shadows/assets/fonts/league-gothic-latin-400-normal.woff2'
import textFontUrl from 'schema-pbta/packs/urban-shadows/assets/fonts/source-serif-4-latin-wght-normal.woff2'
import {
    useUrbanShadowsPlaybookStore,
    useUrbanShadowsSheetStore,
    useUrbanShadowsViewStore,
} from '../hooks'
import {
    presentation,
    regionById,
    type Move,
    type RegionId,
    type UrbanShadowsPlaybook,
} from '../model'
import './urbanShadowsPlaybookTheme.css'

/** Pips under a Circle: the printed sheet shows three. */
const STATUS_PIPS = 3
const DEBT_LINES = 4

/* The published fonts, under the family names the appearance contract gives them. */
const fontFaces = [
    ['Urban Shadows Display', displayFontUrl],
    ['Urban Shadows Text', textFontUrl],
    ['Urban Shadows Brush', brushFontUrl],
]
    .map(
        ([family, url]) =>
            `@font-face{font-family:"${family}";src:url("${url}") format("woff2");font-display:swap;}`
    )
    .join('')

/* The tokens of the published base variant, set on the sheet. */
const tokens = (appearance.variants.find((variant) => variant.id === 'base')
    ?.tokens ?? {}) as CSSProperties

type Text = (key: TranslationKey) => string
type Context = { playbook: UrbanShadowsPlaybook; text: Text }
type Renderer = (context: Context, id: RegionId) => ReactNode

const signed = (value: number) => (value > 0 ? `+${value}` : String(value))
const label = (id: RegionId) => regionById(id)?.label ?? id

/** Stats and Circles are keys of the document; the interface language names them. */
const KNOWN_TERMS = [
    'blood',
    'heart',
    'mind',
    'spirit',
    'mortalis',
    'night',
    'power',
    'wild',
]
const statLabel = (text: Text, key: string) =>
    KNOWN_TERMS.includes(key)
        ? text(`pbta:urbanShadows.terms.${key}` as TranslationKey)
        : key

/** Circles are the stats the document names as Circles, by status or by advancement mark. */
function circleKeys(playbook: UrbanShadowsPlaybook) {
    return [
        ...new Set([
            ...Object.keys(playbook.statuses ?? {}),
            ...(playbook.advancementCircles ?? []),
        ]),
    ]
}

const Box = ({ checked = false }: { checked?: boolean }) => (
    <input type="checkbox" checked={checked} disabled readOnly />
)
const Boxes = ({ count }: { count: number }) => (
    <div className="handbook-urban-shadows-boxes">
        {Array.from({ length: count }, (_, index) => (
            <Box key={index} />
        ))}
    </div>
)
const Fill = () => <span className="handbook-urban-shadows-fill" />
const Checks = ({
    entries,
}: {
    entries: { label: string; checked?: boolean; note?: string }[]
}) => (
    <ul className="handbook-urban-shadows-checks">
        {entries.map((entry, index) => (
            <li key={index}>
                <Box checked={entry.checked === true} />
                <span>{entry.label}</span>
                {entry.note ? <em>{entry.note}</em> : null}
            </li>
        ))}
    </ul>
)
const Paragraphs = ({ values }: { values: readonly string[] }) =>
    values.map((value, index) => <p key={index}>{value}</p>)

function Marks({
    kind,
    entries,
    text,
}: {
    kind: 'lozenge' | 'ring'
    entries: { key: string; value: number; status?: number }[]
    text: Text
}) {
    return (
        <div className="handbook-urban-shadows-marks">
            {entries.map((entry) => (
                <div
                    key={entry.key}
                    className="handbook-urban-shadows-mark"
                    data-mark={kind}
                >
                    <span className="handbook-urban-shadows-mark-value">
                        {signed(entry.value)}
                    </span>
                    <span>{statLabel(text, entry.key)}</span>
                    {entry.status !== undefined && (
                        <span className="handbook-urban-shadows-pips">
                            {Array.from({ length: STATUS_PIPS }, (_, index) => (
                                <span
                                    key={index}
                                    className="handbook-urban-shadows-pip"
                                    data-filled={String(
                                        index < (entry.status ?? 0)
                                    )}
                                />
                            ))}
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}

function MoveCard({
    move,
    startingMoves,
}: {
    move: Move
    startingMoves: readonly string[]
}) {
    const name = 'ref' in move ? move.ref : move.name
    const acquired =
        move.checked ?? ('ref' in move && startingMoves.includes(move.ref))
    return (
        <article
            className="handbook-urban-shadows-move"
            data-acquired={String(acquired)}
        >
            <h4>
                <Box checked={acquired} />
                <span>{name}</span>
            </h4>
            {'ref' in move ? null : (
                <>
                    <p>{move.description}</p>
                    {move.trigger ? <p>{move.trigger}</p> : null}
                    {move.choices ? <p>{move.choices}</p> : null}
                    {Object.entries(move.results ?? {}).map(([key, result]) => (
                        <p key={key}>
                            <strong>{result.label} : </strong>
                            <span>{result.text}</span>
                        </p>
                    ))}
                </>
            )}
        </article>
    )
}

/** Each region of the contract has one renderer; a region without data draws nothing. */
const RENDERERS: Record<string, Renderer> = {
    'game-identity': ({ playbook, text }) => (
        <>
            <h2>{playbook.name}</h2>
            <p>{playbook.description}</p>
            <div className="handbook-urban-shadows-identity-bar">
                {(['name', 'demeanor', 'look'] as const).map((key) => (
                    <p key={key}>
                        <span className="handbook-urban-shadows-label">
                            {text(`pbta:urbanShadows.identity.${key}`)} :
                        </span>
                        <Fill />
                    </p>
                ))}
            </div>
            {/^https:\/\//i.test(playbook.playbookImage?.trim() ?? '') ? (
                <img src={playbook.playbookImage?.trim()} alt={playbook.name} />
            ) : null}
        </>
    ),
    'urban-shadows-opening': ({ playbook }) => (
        <Paragraphs values={playbook.editorial.opening.paragraphs} />
    ),
    'character-identity': ({ playbook }) => {
        const lines = playbook.editorial.identity.paragraphs.map(
            (paragraph) => ({
                paragraph,
                labelled: /^([^:]{1,24}) : ([\s\S]+)$/.exec(paragraph),
            })
        )
        return (
            <>
                <h3>{playbook.editorial.identity.heading}</h3>
                {lines
                    .filter((line) => !line.labelled)
                    .map((line, index) => (
                        <p key={index}>{line.paragraph}</p>
                    ))}
                <div className="handbook-urban-shadows-identity-fields">
                    {lines
                        .filter((line) => line.labelled)
                        .map((line, index) => (
                            <p key={index}>
                                <span className="handbook-urban-shadows-label">
                                    {line.labelled?.[1]} :
                                </span>
                                <Fill />
                            </p>
                        ))}
                </div>
            </>
        )
    },
    'urban-shadows-stats': ({ playbook, text }, id) => {
        const circles = circleKeys(playbook)
        const keys = Object.keys(playbook.stats).filter(
            (key) => !circles.includes(key)
        )
        const profiles = playbook.statProfiles ?? []
        if (!keys.length && !profiles.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                {playbook.statsDetail ? <p>{playbook.statsDetail}</p> : null}
                <Marks
                    kind="lozenge"
                    text={text}
                    entries={keys.map((key) => ({
                        key,
                        value: playbook.stats[key],
                    }))}
                />
                {profiles.map((profile) => (
                    <dl key={profile.key}>
                        <dt>{profile.label}</dt>
                        {Object.entries(profile.stats).map(([key, value]) => (
                            <div
                                key={key}
                                className="handbook-urban-shadows-row"
                            >
                                <dt>{statLabel(text, key)}</dt>
                                <dd>{signed(value)}</dd>
                            </div>
                        ))}
                    </dl>
                ))}
            </>
        )
    },
    'urban-shadows-circles': ({ playbook, text }, id) => {
        const circles = circleKeys(playbook).filter(
            (key) => playbook.stats[key] !== undefined
        )
        if (!circles.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                <Marks
                    kind="ring"
                    text={text}
                    entries={circles.map((key) => ({
                        key,
                        value: playbook.stats[key],
                        status: Math.min(
                            Math.max(playbook.statuses?.[key] ?? 0, 0),
                            STATUS_PIPS
                        ),
                    }))}
                />
            </>
        )
    },
    'playbook-moves': ({ playbook }, id) =>
        playbook.moves.length ? (
            <>
                <h3>{label(id)}</h3>
                {playbook.moves.map((move, index) => (
                    <MoveCard
                        key={index}
                        move={move}
                        startingMoves={playbook.startingMoves ?? []}
                    />
                ))}
            </>
        ) : null,
    'urban-shadows-advancement': ({ playbook, text }, id) => {
        const circles = playbook.advancementCircles ?? []
        const first = playbook.advancement ?? []
        const later = playbook.laterAdvancement ?? []
        if (!circles.length && !first.length && !later.length) return null
        return (
            <>
                <h3>{label(id)}</h3>
                <div className="handbook-urban-shadows-progression-intro">
                    {playbook.editorial.progression.paragraphs.map(
                        (paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        )
                    )}
                </div>
                {circles.length ? (
                    <div className="handbook-urban-shadows-circle-marks">
                        {circles.map((key) => (
                            <label key={key}>
                                <span>{statLabel(text, key)}</span>
                                <Box />
                            </label>
                        ))}
                    </div>
                ) : null}
                {first.length ? <Checks entries={first} /> : null}
                {later.length ? (
                    <div className="handbook-urban-shadows-later">
                        <Checks entries={later} />
                    </div>
                ) : null}
            </>
        )
    },
    'harm-tracker': ({ playbook, text }, id) => {
        const harm = playbook.harm
        if (!harm) return null
        return (
            <>
                <div className="handbook-urban-shadows-harm-head">
                    <h3>{label(id)}</h3>
                    {harm.armor !== undefined && (
                        <div className="handbook-urban-shadows-armor">
                            <span>{text('pbta:urbanShadows.harm.armor')}</span>
                            <Boxes count={Math.max(harm.armor, 1)} />
                        </div>
                    )}
                </div>
                {(['faint', 'serious', 'critical'] as const).map((key) =>
                    harm[key] ? (
                        <div
                            key={key}
                            className="handbook-urban-shadows-harm-line"
                        >
                            <Boxes count={harm[key] ?? 0} />
                            <span>{text(`pbta:urbanShadows.harm.${key}`)}</span>
                        </div>
                    ) : null
                )}
            </>
        )
    },
    'urban-shadows-scars': ({ playbook, text }, id) =>
        playbook.scars?.length ? (
            <>
                <h3>{label(id)}</h3>
                <Checks
                    entries={playbook.scars.map((scar) => ({
                        label: scar.name,
                        note:
                            scar.stat && scar.modifier !== undefined
                                ? `${statLabel(text, scar.stat)} ${signed(scar.modifier)}`
                                : undefined,
                    }))}
                />
            </>
        ) : null,
    'urban-shadows-let-it-out': ({ playbook }, id) =>
        playbook.letItOut?.length ? (
            <>
                <h3>{label(id)}</h3>
                <ul className="handbook-urban-shadows-lozenges">
                    {playbook.letItOut.map((value, index) => (
                        <li key={index}>{value}</li>
                    ))}
                </ul>
            </>
        ) : null,
    'urban-shadows-end-move': ({ playbook }, id) => (
        <>
            <h3>{label(id)}</h3>
            <p>{playbook.endMove}</p>
        </>
    ),
    /* Creation is edited here, so the questions are shown; the printed sheet keeps only the answers. */
    'urban-shadows-creation': ({ playbook }, id) =>
        playbook.creation?.length ? (
            <>
                <h3>{label(id)}</h3>
                {playbook.creation.map((question, index) => (
                    <p key={index}>
                        <strong>{question.label}</strong>{' '}
                        {question.options
                            .map((option) =>
                                typeof option === 'string'
                                    ? option
                                    : option.label
                            )
                            .join(', ')}
                    </p>
                ))}
            </>
        ) : null,
    'urban-shadows-debts': ({ playbook }, id) => (
        <>
            <h3>{label(id)}</h3>
            {(playbook.debts ?? []).map((debt, index) => (
                <p key={index}>{debt}</p>
            ))}
            {Array.from({ length: DEBT_LINES }, (_, index) => (
                <Fill key={index} />
            ))}
        </>
    ),
    'urban-shadows-mortal-relationships': ({ playbook }, id) =>
        playbook.mortalRelationships?.length ? (
            <>
                <h3>{label(id)}</h3>
                <ul className="handbook-urban-shadows-relations">
                    {playbook.mortalRelationships.map((relation) => (
                        <li key={relation.key}>
                            <strong>{relation.label}</strong>
                            {relation.description ? (
                                <p>{relation.description}</p>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </>
        ) : null,
    'urban-shadows-extras': ({ playbook }) =>
        playbook.extras?.length
            ? playbook.extras.map((extra) => (
                  <div
                      key={extra.key}
                      className="handbook-urban-shadows-frame"
                      data-extra={extra.key}
                  >
                      <h4>{extra.label}</h4>
                      {extra.text ? <p>{extra.text}</p> : null}
                      {extra.items?.length ? (
                          <ul>
                              {extra.items.map((item, index) => (
                                  <li key={index}>{item}</li>
                              ))}
                          </ul>
                      ) : null}
                  </div>
              ))
            : null,
    'urban-shadows-intimacy': ({ playbook }, id) =>
        playbook.intimacy ? (
            <>
                <h3>{label(id)}</h3>
                <p>{playbook.intimacy}</p>
            </>
        ) : null,
    gear: ({ playbook }, id) =>
        playbook.gear?.length ? (
            <>
                <h3>{label(id)}</h3>
                <ul>
                    {playbook.gear.map((item, index) => (
                        <li key={index}>
                            {item.name}
                            {item.quantity ? ` × ${item.quantity}` : ''}
                            {item.description ? ` — ${item.description}` : ''}
                        </li>
                    ))}
                </ul>
            </>
        ) : null,
    'urban-shadows-corruption': ({ playbook, text }, id) => (
        <>
            <h3>{label(id)}</h3>
            {playbook.corruption.track ? (
                <Boxes count={playbook.corruption.track} />
            ) : null}
            <p>
                <strong>
                    {text('pbta:urbanShadows.corruption.trigger')} :{' '}
                </strong>
                <span>{playbook.corruption.trigger}</span>
            </p>
            <Checks entries={playbook.corruption.advances} />
            {playbook.corruption.moves?.length ? (
                <>
                    <h4>{text('pbta:urbanShadows.corruption.moves')}</h4>
                    <Checks
                        entries={playbook.corruption.moves.map((name) => ({
                            label: name,
                        }))}
                    />
                </>
            ) : null}
        </>
    ),
    'urban-shadows-play': ({ playbook }) => (
        <>
            <h3>{playbook.editorial.playAdvice.heading}</h3>
            <Paragraphs values={playbook.editorial.playAdvice.paragraphs} />
        </>
    ),
}

export function UrbanShadowsPlaybookPreview() {
    const { playbook } = useUrbanShadowsPlaybookStore()
    const { openSheet } = useUrbanShadowsSheetStore()
    const view = useUrbanShadowsViewStore()
    const text = useUiText() as Text

    /* A region draws when the contract names it, the layout knows it, it is shown and it has data. */
    const region = (id: RegionId) => {
        if (view.hidden[id]) return null
        const content = RENDERERS[id]?.({ playbook, text }, id)
        if (!content) return null
        const open = () =>
            openSheet({ kind: id === 'game-identity' ? 'basic' : id })
        return (
            <section
                key={id}
                className="handbook-urban-shadows-region"
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
    const placed = new Set<RegionId>(['game-identity'])
    for (const columns of presentation.rows)
        for (const ids of columns) for (const id of ids) placed.add(id)

    return (
        <div className="urban-shadows-doc">
            <style>{fontFaces}</style>
            <article
                className="handbook-urban-shadows-playbook"
                style={{
                    ...tokens,
                    transform: `scale(${view.zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                {region('game-identity')}
                {presentation.rows.map((columns, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="handbook-urban-shadows-layout-row"
                        data-row={rowIndex + 1}
                    >
                        {columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="handbook-urban-shadows-column"
                                data-column={columnIndex + 1}
                            >
                                {ids.map(region)}
                            </div>
                        ))}
                    </div>
                ))}
                {/* Regions the contract leaves out of every row follow in canonical order. */}
                {presentation.canonicalOrder
                    .filter((id) => !placed.has(id))
                    .map(region)}
            </article>
        </div>
    )
}
