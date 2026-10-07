import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import aliceUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/alice-latin-400-normal.woff2'
import averiaSerifLibreUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/averia-serif-libre-latin-700-normal.woff2'
import elMessiriUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/el-messiri-latin-400-700-normal.woff2'
import imFellDoublePicaUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/im-fell-double-pica-latin-400-italic.woff2'
import yellowMagicianUrl from 'schema-pbta/packs/monsterhearts/assets/fonts/yellow-magician-latin-400-normal.woff2'
import gameMarkUrl from 'schema-pbta/packs/monsterhearts/assets/images/thorn-heart.svg?url&no-inline'
import {
    PBTA_MONSTERHEARTS_APPEARANCE,
    PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION,
    type PbtaMonsterheartsPlaybookPresentation,
    type PbtaMonsterheartsRegionId,
} from 'schema-pbta'
import { PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS } from 'schema-pbta/presentation/monsterhearts-appearance-assets'
import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import './monsterheartsPlaybookTheme.css'

export const getMoveHeart = (checked: boolean) => (checked ? '♥' : '♡')

export const getAdvanceCheckClass = (checked: boolean | undefined) =>
    checked ? 'is-checked' : undefined

const viteAssetUrls = new Map([
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Yellow Magician'],
        yellowMagicianUrl,
    ],
    [PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['El Messiri'], elMessiriUrl],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Averia Serif Libre'],
        averiaSerifLibreUrl,
    ],
    [PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['Alice'], aliceUrl],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.fonts['IM Fell Double Pica'],
        imFellDoublePicaUrl,
    ],
    [
        PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.assets['game-mark'],
        gameMarkUrl,
    ],
])

function viteAssetUrl(publishedUrl: string) {
    return viteAssetUrls.get(publishedUrl) ?? publishedUrl
}

/* Each face is declared with the weight and style the published stylesheet
   gives it; El Messiri is one file covering the 400 to 700 range. */
const fontFaces = [
    { family: 'Yellow Magician', weight: '400', style: 'normal' },
    { family: 'El Messiri', weight: '400 700', style: 'normal' },
    { family: 'Averia Serif Libre', weight: '700', style: 'normal' },
    { family: 'Alice', weight: '400', style: 'normal' },
    { family: 'IM Fell Double Pica', weight: '400', style: 'italic' },
] as const

export function getMonsterheartsRegionLayout(
    presentation: PbtaMonsterheartsPlaybookPresentation = PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION
) {
    const header = 'game-identity' as const
    const rows = presentation.rows ?? [
        [presentation.canonicalOrder.filter((id) => id !== header)],
    ]
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

function EditorialBlock({
    block,
    onClick,
}: {
    block: { heading: string; paragraphs: string[] }
    onClick: () => void
}) {
    return (
        <button type="button" className="mh-editorial" onClick={onClick}>
            <h2>{block.heading}</h2>
            {block.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
        </button>
    )
}

export function MonsterheartsPlaybookPreview() {
    const { playbook } = useMonsterheartsStore()
    const { open } = useMonsterheartsSheet()
    const view = useMonsterheartsView()
    const { t } = useTranslation()
    const isVisible = (id: keyof typeof view.hidden) => !view.hidden[id]
    const { editorial } = playbook
    const ascendants = playbook.ascendants ?? []
    const gear = playbook.gear ?? []
    const layout = getMonsterheartsRegionLayout()
    const label = (id: PbtaMonsterheartsRegionId) =>
        getMonsterheartsRegionLabel(id)
    const appearance = PBTA_MONSTERHEARTS_APPEARANCE.variants[0]
    const assetUrls = PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS
    const gameMark = viteAssetUrl(assetUrls.assets['game-mark'])

    const renderRegion = (id: PbtaMonsterheartsRegionId): ReactNode | null => {
        switch (id) {
            case 'monsterhearts-opening':
                return isVisible('editorial') ? (
                    <EditorialBlock
                        block={editorial.opening}
                        onClick={() => open('editorial')}
                    />
                ) : null
            case 'character-identity':
                return isVisible('editorial') ? (
                    <EditorialBlock
                        block={editorial.identity}
                        onClick={() => open('editorial')}
                    />
                ) : null
            case 'stat-profiles':
                return isVisible('stats') ? (
                    <button
                        type="button"
                        className="mh-stat-block"
                        onClick={() => open('stats')}
                    >
                        <h2>{label('stat-profiles')}</h2>
                        <p>
                            {Object.entries(playbook.stats)
                                .map(
                                    ([name, value]) =>
                                        `${name} ${value >= 0 ? '+' : ''}${value}`
                                )
                                .join(' · ')}
                        </p>
                    </button>
                ) : null
            case 'playbook-moves':
                return isVisible('moves') ? (
                    <section>
                        <button
                            type="button"
                            className="mh-section-title"
                            onClick={() => open('moves')}
                        >
                            {label('playbook-moves')}
                        </button>
                        <div className="mh-actions">
                            {playbook.moves.length ? (
                                playbook.moves.map((move, index) => (
                                    <article
                                        key={`${'ref' in move ? move.ref : move.name}-${index}`}
                                    >
                                        <h2>
                                            {getMoveHeart(
                                                move.checked === true
                                            )}{' '}
                                            {'ref' in move
                                                ? move.ref
                                                : move.name}
                                        </h2>
                                        {'ref' in move ? null : (
                                            <p>{move.description}</p>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <p className="mh-empty">
                                    {t('pbta:monsterhearts.empty.moves')}
                                </p>
                            )}
                        </div>
                    </section>
                ) : null
            case 'playbook-portrait':
                return (
                    <button
                        type="button"
                        className="mh-portrait"
                        onClick={() => open('basic')}
                    >
                        {playbook.playbookImage ? (
                            <img
                                src={playbook.playbookImage}
                                alt={t('pbta:monsterhearts.portrait', {
                                    name: playbook.name,
                                })}
                            />
                        ) : (
                            <span>
                                {t('pbta:monsterhearts.portrait', {
                                    name: playbook.name,
                                })}
                            </span>
                        )}
                    </button>
                )
            case 'ascendants-and-conditions':
                return (
                    <>
                        {isVisible('ascendants') && (
                            <button
                                type="button"
                                className="mh-stat-block"
                                onClick={() => open('ascendants')}
                            >
                                <h2>
                                    {t('pbta:monsterhearts.sections.ascendants')}
                                </h2>
                                {ascendants.length ? (
                                    <ul className="mh-conditions">
                                        {ascendants.map((ascendant, index) => (
                                            <li
                                                key={`${ascendant.name}-${index}`}
                                            >
                                                <strong>
                                                    {ascendant.name}
                                                </strong>
                                                <span>
                                                    {t(
                                                        'pbta:monsterhearts.fields.value'
                                                    )}{' '}
                                                    {ascendant.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mh-empty">
                                        {t(
                                            'pbta:monsterhearts.empty.ascendants'
                                        )}
                                    </p>
                                )}
                            </button>
                        )}
                        {isVisible('conditions') && (
                            <button
                                type="button"
                                className="mh-stat-block"
                                onClick={() => open('conditions')}
                            >
                                <h2>
                                    {t(
                                        'pbta:monsterhearts.sections.conditions'
                                    )}
                                </h2>
                                {playbook.conditions.length ? (
                                    <ul className="mh-conditions">
                                        {playbook.conditions.map(
                                            (condition) => (
                                                <li key={condition.name}>
                                                    <strong>
                                                        {condition.name}
                                                    </strong>
                                                    {condition.description && (
                                                        <span>
                                                            {
                                                                condition.description
                                                            }
                                                        </span>
                                                    )}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="mh-empty">
                                        {t(
                                            'pbta:monsterhearts.empty.conditions'
                                        )}
                                    </p>
                                )}
                            </button>
                        )}
                    </>
                )
            case 'harm-tracker':
                return isVisible('harm') ? (
                    <button
                        type="button"
                        className="mh-harm"
                        onClick={() => open('harm')}
                    >
                        {label('harm-tracker')}{' '}
                        {Array.from({ length: 4 }, (_, index) => (
                            <span
                                key={index}
                                className={
                                    index < playbook.harm ? 'is-marked' : ''
                                }
                            />
                        ))}
                    </button>
                ) : null
            case 'gear':
                return gear.length ? (
                    <section className="mh-stat-block">
                        <h2>{t('pbta:playbook.sections.gear')}</h2>
                        <ul className="mh-conditions">
                            {gear.map((item, index) => (
                                <li key={`${item.name}-${index}`}>
                                    <strong>{item.name}</strong>
                                    {item.description && (
                                        <span>{item.description}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null
            case 'monsterhearts-darkest-self':
                return isVisible('editorial') ? (
                    <EditorialBlock
                        block={editorial.darkestSelf}
                        onClick={() => open('editorial')}
                    />
                ) : null
            case 'monsterhearts-sex-move':
                return isVisible('editorial') ? (
                    <EditorialBlock
                        block={editorial.sexMove}
                        onClick={() => open('editorial')}
                    />
                ) : null
            case 'monsterhearts-play':
                return isVisible('editorial') && editorial.play ? (
                    <EditorialBlock
                        block={editorial.play}
                        onClick={() => open('editorial')}
                    />
                ) : null
            case 'monsterhearts-progression':
                return isVisible('advances') ? (
                    <section>
                        <button
                            type="button"
                            className="mh-section-title"
                            onClick={() => open('advances')}
                        >
                            {label('monsterhearts-progression')} □ □ □ □ □
                        </button>
                        <ul className="mh-checklist">
                            {playbook.advances.map((advance, index) => (
                                <li
                                    key={`${advance.label}-${index}`}
                                    className={getAdvanceCheckClass(
                                        advance.checked
                                    )}
                                >
                                    {advance.label}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null
            case 'game-identity':
                return null
        }
    }

    return (
        <div
            className="monsterhearts-doc"
            data-appearance-variant={appearance.id}
            style={appearance.tokens as CSSProperties}
        >
            <style>
                {fontFaces
                    .map(
                        ({ family, weight, style }) =>
                            `@font-face { font-family: '${family}'; src: url('${viteAssetUrl(assetUrls.fonts[family])}') format('woff2'); font-weight: ${weight}; font-style: ${style}; font-display: swap; }`
                    )
                    .join(' ')}
            </style>
            <article className="monsterhearts-sheet">
                <button
                    type="button"
                    className="mh-header"
                    onClick={() => open('basic')}
                >
                    <h1>{playbook.name}</h1>
                    <p>{playbook.description}</p>
                    <img
                        className="mh-game-mark"
                        src={gameMark}
                        alt=""
                    />
                </button>
                <div className="mh-layout">
                    {layout.rows.map((row, rowIndex) => (
                        <div className="mh-row" key={rowIndex}>
                            {row.map((column, columnIndex) => (
                                <div className="mh-column" key={columnIndex}>
                                    {column.map((id) => (
                                        <div className="mh-region" key={id}>
                                            {renderRegion(id)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                    {layout.trailing.length > 0 && (
                        <div className="mh-fallback">
                            {layout.trailing.map((id) => (
                                <div className="mh-region" key={id}>
                                    {renderRegion(id)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </div>
    )
}
