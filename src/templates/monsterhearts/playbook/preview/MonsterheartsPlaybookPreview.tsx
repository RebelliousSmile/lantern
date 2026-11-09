import {
    Fragment,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
    PBTA_MONSTERHEARTS_APPEARANCE,
    PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION,
    type PbtaMonsterheartsPlaybookPresentation,
    type PbtaMonsterheartsRegionId,
} from 'schema-pbta'
import aliceUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/alice-latin-400-normal.woff2'
import averiaSerifLibreUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/averia-serif-libre-latin-700-normal.woff2'
import elMessiriUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/el-messiri-latin-400-normal.woff2'
import elMessiriBoldUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/el-messiri-latin-700-normal.woff2'
import imFellDoublePicaUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/im-fell-double-pica-latin-400-italic.woff2'
import yellowMagicianUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/yellow-magician-latin-400-normal.woff2'
import 'schema-pbta/packs/monsterhearts/assets/styles/playbook.css'
import { PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS } from 'schema-pbta/presentation/monsterhearts-appearance-assets'
import '../../../pbta/preview/playbookRegionInteraction.css'
import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import type { MonsterheartsPlaybook, SectionId } from '../model'

/*
 * Lantern emits the DOM of Handbook's Monsterhearts block
 * (`obsidian-handbook/src/features/pbta/monsterheartsLayout.ts`): the same
 * elements, classes and `data-region`, so that the stylesheet schema-pbta
 * publishes (`packs/monsterhearts/assets/styles/playbook.css`) dresses both
 * hosts alike. No dressing value is set here.
 */

type MoveEntry = MonsterheartsPlaybook['moves'][number]
type Panel = SectionId | 'basic'

const viteAssetUrls = new Map([
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Yellow Magician'],
        yellowMagicianUrl,
    ],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['El Messiri'],
        elMessiriUrl,
    ],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Averia Serif Libre'],
        averiaSerifLibreUrl,
    ],
    [PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Alice'], aliceUrl],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['IM Fell Double Pica'],
        imFellDoublePicaUrl,
    ],
])

function viteAssetUrl(publishedUrl: string) {
    return viteAssetUrls.get(publishedUrl) ?? publishedUrl
}

/* Each face is declared with the weight and style the published stylesheet
   gives it; El Messiri has one static file per weight, and the published
   asset map names only its 400 face. */
const fontFaces = [
    { family: 'Yellow Magician', weight: '400', style: 'normal' },
    { family: 'El Messiri', weight: '400', style: 'normal' },
    {
        family: 'El Messiri',
        weight: '700',
        style: 'normal',
        url: elMessiriBoldUrl,
    },
    { family: 'Averia Serif Libre', weight: '700', style: 'normal' },
    { family: 'Alice', weight: '400', style: 'normal' },
    { family: 'IM Fell Double Pica', weight: '400', style: 'italic' },
] as const

/** `game-identity` is never placed: the name sits under the portrait, as in Handbook. */
export function getMonsterheartsRegionLayout(
    presentation: PbtaMonsterheartsPlaybookPresentation = PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION
) {
    const header = 'game-identity' as const
    const rows = presentation.rows
    const placed = new Set(rows.flat(2))
    return {
        header,
        rows,
        trailing: presentation.canonicalOrder.filter(
            (id) => id !== header && !placed.has(id)
        ),
    }
}

export const getMonsterheartsRegionLabel = (
    id: PbtaMonsterheartsRegionId,
    presentation: PbtaMonsterheartsPlaybookPresentation = PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION
) => presentation.regions.find((region) => region.id === id)?.label ?? id

function foldText(value: string) {
    return value.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** A creation question is already in the booklet prose when most of its options appear there. */
function coveredByParagraphs(options: string[], paragraphs: readonly string[]) {
    if (options.length < 2) return false
    const text = foldText(paragraphs.join(' '))
    const found = options.filter((option) =>
        text.includes(foldText(option))
    ).length
    return found * 2 >= options.length
}

/** A blank to fill in at the table: the page shows no choices, only room to write. */
const Fill = () => <span className="handbook-monsterhearts-fill" />

const Box = ({ checked, label }: { checked: boolean; label: string }) => (
    <input type="checkbox" checked={checked} aria-label={label} readOnly />
)

const Row = ({ label, value }: { label: string; value: string | number }) => (
    <div className="handbook-monsterhearts-row">
        <dt>{label}</dt>
        <dd>{String(value)}</dd>
    </div>
)

function formatRoll(roll: { rollType: string; rollMod?: number }) {
    if (roll.rollMod === undefined) return roll.rollType
    return `${roll.rollType} ${roll.rollMod >= 0 ? '+' : ''}${roll.rollMod}`
}

function MoveCard({
    move,
    startingMoves,
}: {
    move: MoveEntry
    startingMoves: readonly string[]
}) {
    const { t } = useTranslation()
    const acquired =
        move.checked ?? ('ref' in move && startingMoves.includes(move.ref))
    const roll =
        'ref' in move || !move.roll
            ? null
            : t('pbta:monsterhearts.preview.roll', {
                  roll: formatRoll(move.roll),
              })
    return (
        <article
            className="handbook-monsterhearts-move"
            data-acquired={String(acquired)}
        >
            <h4>
                <span
                    className="handbook-monsterhearts-move-symbol"
                    aria-label={t(
                        acquired
                            ? 'pbta:monsterhearts.preview.moveAcquired'
                            : 'pbta:monsterhearts.preview.moveNotAcquired'
                    )}
                />
                <span>{'ref' in move ? move.ref : move.name}</span>
            </h4>
            {'ref' in move ? null : (
                <>
                    <p>{move.description}</p>
                    {move.trigger ? <p>{move.trigger}</p> : null}
                    {move.choices ? <p>{move.choices}</p> : null}
                    {roll ? <p>{roll}</p> : null}
                    {move.results
                        ? Object.entries(move.results).map(([key, result]) => (
                              <p key={key}>
                                  <strong>
                                      {t('pbta:monsterhearts.preview.result', {
                                          label: result.label,
                                      })}
                                  </strong>
                                  <span>{result.text}</span>
                              </p>
                          ))
                        : null}
                </>
            )}
        </article>
    )
}

/** Opens a panel from an element inside a region, without opening the region's own panel. */
function innerTrigger(editing: boolean, open: () => void) {
    if (!editing) return {}
    return {
        role: 'button',
        tabIndex: 0,
        onClick: (event: MouseEvent) => {
            event.stopPropagation()
            open()
        },
        onKeyDown: (event: KeyboardEvent) => {
            if (event.key !== 'Enter') return
            event.stopPropagation()
            open()
        },
    }
}

export function MonsterheartsPlaybookPreview() {
    const { playbook } = useMonsterheartsStore()
    const { open, editing } = useMonsterheartsSheet()
    const view = useMonsterheartsView()
    const { t } = useTranslation()
    const isVisible = (id: SectionId) => !view.hidden[id]
    const { editorial } = playbook
    const layout = getMonsterheartsRegionLayout()
    const appearance = PBTA_MONSTERHEARTS_APPEARANCE.variants[0]
    const assetUrls = PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS
    const empty = (key: 'moves' | 'ascendants' | 'conditions' | 'gear') => (
        <p>{t(`pbta:monsterhearts.empty.${key}`)}</p>
    )

    /* A region is the clickable unit: while editing it opens its own short panel. */
    const region = (
        id: PbtaMonsterheartsRegionId,
        panel: Panel,
        children: ReactNode,
        heading?: string
    ) => (
        <section
            key={id}
            className="handbook-monsterhearts-region"
            data-region={id}
            {...(editing
                ? {
                      role: 'button',
                      tabIndex: 0,
                      onClick: () => open(panel),
                      onKeyDown: (event: KeyboardEvent) => {
                          if (event.key === 'Enter') open(panel)
                      },
                  }
                : {})}
        >
            {heading ? <h3>{heading}</h3> : null}
            {children}
        </section>
    )
    const editorialRegion = (
        id: PbtaMonsterheartsRegionId,
        block: { heading: string; paragraphs: string[] } | undefined,
        heading = block?.heading
    ) =>
        block && isVisible('editorial')
            ? region(
                  id,
                  'editorial',
                  block.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                  )),
                  heading
              )
            : null

    const renderIdentity = (id: PbtaMonsterheartsRegionId) => {
        const paragraphs = editorial.identity.paragraphs
        const prose: ReactNode[] = []
        const fields: ReactNode[] = []
        paragraphs.forEach((paragraph, index) => {
            const labelled = /^([^:]{1,24}) : ([\s\S]+)$/.exec(paragraph)
            if (!labelled) {
                prose.push(<p key={index}>{paragraph}</p>)
                return
            }
            fields.push(
                <p key={index}>
                    <span className="handbook-monsterhearts-label">
                        {t('pbta:monsterhearts.preview.fieldLabel', {
                            label: labelled[1],
                        })}
                    </span>
                    <Fill />
                </p>
            )
        })
        const questions = (playbook.creation ?? []).filter(
            (question) =>
                !coveredByParagraphs(
                    question.options.map((option) =>
                        typeof option === 'string' ? option : option.label
                    ),
                    paragraphs
                )
        )
        return region(
            id,
            'editorial',
            <>
                {prose}
                {fields.length ? (
                    <div className="handbook-monsterhearts-identity-fields">
                        {fields}
                    </div>
                ) : null}
                {questions.map((question, index) => (
                    <Fragment key={`${question.label}-${index}`}>
                        <h4>{question.label}</h4>
                        <Fill />
                    </Fragment>
                ))}
                {playbook.backstory?.length && !questions.length ? (
                    <>
                        <h4>{t('pbta:monsterhearts.preview.backstory')}</h4>
                        <Fill />
                    </>
                ) : null}
            </>,
            editorial.identity.heading
        )
    }

    const renderStats = (id: PbtaMonsterheartsRegionId) => {
        const profiles = playbook.statProfiles ?? []
        if (!Object.keys(playbook.stats).length && !profiles.length) return null
        const list = (values: Record<string, number>, key: number) => (
            <dl key={key}>
                {Object.keys(values).map((name) => (
                    <Row key={name} label={name} value={values[name]} />
                ))}
            </dl>
        )
        return region(
            id,
            'stats',
            <div className="handbook-monsterhearts-stats">
                {profiles.length
                    ? profiles.map((profile, index) =>
                          list(profile.stats, index)
                      )
                    : list(playbook.stats, 0)}
            </div>,
            getMonsterheartsRegionLabel(id)
        )
    }

    const renderPortrait = (id: PbtaMonsterheartsRegionId) => {
        const image = playbook.playbookImage?.trim()
        const source = image && /^https:\/\//i.test(image) ? image : null
        return region(
            id,
            'basic',
            <figure
                className={`handbook-monsterhearts-portrait${source ? '' : ' handbook-monsterhearts-portrait--empty'}`}
            >
                {source ? (
                    <img
                        src={source}
                        alt={t('pbta:monsterhearts.portrait', {
                            name: playbook.name,
                        })}
                    />
                ) : (
                    <span>
                        {t('pbta:monsterhearts.preview.portraitMissing')}
                    </span>
                )}
                <figcaption className="handbook-monsterhearts-portrait-name">
                    {playbook.name}
                </figcaption>
            </figure>
        )
    }

    /* Two panels share this region: the region opens the strings, each
       condition opens the conditions. */
    const renderStringsAndConditions = (id: PbtaMonsterheartsRegionId) => {
        const ascendants = playbook.ascendants ?? []
        const showStrings = isVisible('ascendants')
        const showConditions =
            isVisible('conditions') &&
            (playbook.conditions.length > 0 || editing)
        if (!showStrings && !showConditions) return null
        const openConditions = innerTrigger(editing, () => open('conditions'))
        return region(
            id,
            showStrings ? 'ascendants' : 'conditions',
            <>
                {showStrings ? (
                    <>
                        <h4>{t('pbta:monsterhearts.sections.ascendants')}</h4>
                        {ascendants.length ? (
                            <dl>
                                {ascendants.map((item, index) => (
                                    <Row
                                        key={`${item.name}-${index}`}
                                        label={item.name}
                                        value={item.value}
                                    />
                                ))}
                            </dl>
                        ) : (
                            <p>
                                {t('pbta:monsterhearts.preview.strings', {
                                    starting: playbook.strings.starting ?? 0,
                                    max: playbook.strings.max,
                                })}
                            </p>
                        )}
                    </>
                ) : null}
                {showConditions && !playbook.conditions.length ? (
                    <>
                        <h4 {...openConditions}>
                            {t('pbta:monsterhearts.sections.conditions')}
                        </h4>
                        {empty('conditions')}
                    </>
                ) : null}
                {showConditions
                    ? playbook.conditions.map((condition, index) => (
                          <Fragment key={`${condition.name}-${index}`}>
                              <h4 {...openConditions}>{condition.name}</h4>
                              {condition.description ? (
                                  <p {...openConditions}>
                                      {condition.description}
                                  </p>
                              ) : null}
                          </Fragment>
                      ))
                    : null}
            </>,
            getMonsterheartsRegionLabel(id)
        )
    }

    const renderProgression = (id: PbtaMonsterheartsRegionId) =>
        region(
            id,
            'advances',
            <>
                {editorial.progression.paragraphs.map((paragraph, index) => {
                    const named = /^([^:.]{1,40}) : ([\s\S]+)$/.exec(paragraph)
                    return named ? (
                        <MoveCard
                            key={index}
                            move={{
                                name: named[1],
                                moveType: 'skin',
                                description: named[2],
                                checked: false,
                            }}
                            startingMoves={[]}
                        />
                    ) : (
                        <p key={index}>{paragraph}</p>
                    )
                })}
                {playbook.advances.length ? (
                    <>
                        <h4>{t('pbta:monsterhearts.preview.advances')}</h4>
                        <ul>
                            {playbook.advances.map((advance, index) => (
                                <li key={`${advance.label}-${index}`}>
                                    <Box
                                        checked={advance.checked === true}
                                        label={advance.label}
                                    />
                                    <span>{advance.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : null}
            </>,
            editorial.progression.heading
        )

    /* An empty list is drawn only while editing, so that it can be filled;
       otherwise the region is left out, as in Handbook. */
    const renderRegion = (id: PbtaMonsterheartsRegionId): ReactNode => {
        switch (id) {
            case 'game-identity':
                return null
            case 'monsterhearts-opening':
                return editorialRegion(id, editorial.opening, '')
            case 'character-identity':
                return isVisible('editorial') ? renderIdentity(id) : null
            case 'stat-profiles':
                return isVisible('stats') ? renderStats(id) : null
            case 'playbook-portrait':
                return renderPortrait(id)
            case 'playbook-moves':
                if (!isVisible('moves')) return null
                if (!playbook.moves.length && !editing) return null
                return region(
                    id,
                    'moves',
                    playbook.moves.length
                        ? playbook.moves.map((move, index) => (
                              <MoveCard
                                  key={`${'ref' in move ? move.ref : move.name}-${index}`}
                                  move={move}
                                  startingMoves={playbook.startingMoves ?? []}
                              />
                          ))
                        : empty('moves'),
                    getMonsterheartsRegionLabel(id)
                )
            case 'ascendants-and-conditions':
                return renderStringsAndConditions(id)
            case 'harm-tracker':
                if (!isVisible('harm')) return null
                return region(
                    id,
                    'harm',
                    <div className="handbook-monsterhearts-harm">
                        {[1, 2, 3, 4].map((index) => (
                            <Box
                                key={index}
                                checked={index <= playbook.harm}
                                label={t('pbta:monsterhearts.preview.harmBox', {
                                    index,
                                })}
                            />
                        ))}
                    </div>,
                    getMonsterheartsRegionLabel(id)
                )
            case 'gear': {
                const gear = playbook.gear ?? []
                if (!isVisible('gear') || (!gear.length && !editing))
                    return null
                return region(
                    id,
                    'gear',
                    gear.length ? (
                        <ul>
                            {gear.map((item, index) => (
                                <li key={`${item.name}-${index}`}>
                                    {`${item.name}${item.quantity ? ` × ${item.quantity}` : ''}${item.description ? ` — ${item.description}` : ''}`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        empty('gear')
                    ),
                    getMonsterheartsRegionLabel(id)
                )
            }
            case 'monsterhearts-darkest-self':
                return editorialRegion(id, editorial.darkestSelf)
            case 'monsterhearts-sex-move':
                return editorialRegion(id, editorial.sexMove)
            case 'monsterhearts-play':
                return editorialRegion(id, editorial.play)
            case 'monsterhearts-progression':
                return isVisible('advances') ? renderProgression(id) : null
        }
        return null
    }

    return (
        <>
            <style>
                {fontFaces
                    .map(
                        (face) =>
                            `@font-face { font-family: '${face.family}'; src: url('${'url' in face ? face.url : viteAssetUrl(assetUrls.fonts[face.family])}') format('woff2'); font-weight: ${face.weight}; font-style: ${face.style}; font-display: swap; }`
                    )
                    .join(' ')}
            </style>
            {/* The page width and the zoom belong to the host; every dressing
                value comes from the published stylesheet. */}
            <article
                className="handbook-pbta-playbook handbook-monsterhearts-playbook"
                data-appearance-variant={appearance.id}
                style={
                    {
                        ...appearance.tokens,
                        width: `${view.previewWidth}px`,
                        transform: `scale(${view.zoom})`,
                        transformOrigin: 'top left',
                    } as CSSProperties
                }
            >
                {layout.rows.map((columns, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="handbook-monsterhearts-layout-row"
                        data-row={rowIndex + 1}
                    >
                        {columns.map((ids, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="handbook-monsterhearts-column"
                                data-column={columnIndex + 1}
                            >
                                {ids.map(renderRegion)}
                            </div>
                        ))}
                    </div>
                ))}
                {/* Regions the contract leaves out of every row follow in canonical order. */}
                {layout.trailing.map(renderRegion)}
            </article>
        </>
    )
}
