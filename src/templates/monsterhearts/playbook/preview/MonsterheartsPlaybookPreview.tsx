import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
    PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION,
    type PbtaMonsterheartsPlaybookPresentation,
    type PbtaMonsterheartsRegionId,
} from 'schema-pbta'
import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import './monsterheartsPlaybookTheme.css'

export const getMoveHeart = (checked: boolean) => (checked ? '♥' : '♡')

export const getAdvanceCheckClass = (checked: boolean | undefined) =>
    checked ? 'is-checked' : undefined

export function getMonsterheartsRegionLayout(
    presentation: PbtaMonsterheartsPlaybookPresentation = PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION
) {
    const header = 'game-identity' as const
    const columns = presentation.columns ?? [
        presentation.canonicalOrder.filter((id) => id !== header),
    ]
    const placed = new Set(columns.flat())
    return {
        header,
        columns,
        trailing: presentation.canonicalOrder.filter(
            (id) => id !== header && !placed.has(id)
        ),
    }
}

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

    const renderRegion = (
        id: PbtaMonsterheartsRegionId
    ): ReactNode | null => {
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
                        <h2>{t('pbta:monsterhearts.sections.stats')}</h2>
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
                            {t('pbta:monsterhearts.sections.moves')}
                        </button>
                        <div className="mh-actions">
                            {playbook.moves.length ? (
                                playbook.moves.map((move, index) => (
                                    <article
                                        key={`${'ref' in move ? move.ref : move.name}-${index}`}
                                    >
                                        <h2>
                                            {getMoveHeart(move.checked === true)}{' '}
                                            {'ref' in move ? move.ref : move.name}
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
            case 'relationships':
                return isVisible('ascendants') ? (
                    <button
                        type="button"
                        className="mh-stat-block"
                        onClick={() => open('ascendants')}
                    >
                        <h2>{t('pbta:monsterhearts.sections.ascendants')}</h2>
                        {ascendants.length ? (
                            <ul className="mh-conditions">
                                {ascendants.map((ascendant, index) => (
                                    <li key={`${ascendant.name}-${index}`}>
                                        <strong>{ascendant.name}</strong>
                                        <span>
                                            {t('pbta:monsterhearts.fields.value')}{' '}
                                            {ascendant.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mh-empty">
                                {t('pbta:monsterhearts.empty.ascendants')}
                            </p>
                        )}
                    </button>
                ) : null
            case 'conditions-and-harm':
                return (
                    <>
                        {isVisible('conditions') && (
                            <button
                                type="button"
                                className="mh-stat-block"
                                onClick={() => open('conditions')}
                            >
                                <h2>{t('pbta:monsterhearts.sections.conditions')}</h2>
                                {playbook.conditions.length ? (
                                    <ul className="mh-conditions">
                                        {playbook.conditions.map((condition) => (
                                            <li key={condition.name}>
                                                <strong>{condition.name}</strong>
                                                {condition.description && (
                                                    <span>{condition.description}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mh-empty">
                                        {t('pbta:monsterhearts.empty.conditions')}
                                    </p>
                                )}
                            </button>
                        )}
                        {isVisible('harm') && (
                            <button
                                type="button"
                                className="mh-harm"
                                onClick={() => open('harm')}
                            >
                                {t('pbta:monsterhearts.sections.harm')}{' '}
                                {Array.from({ length: 4 }, (_, index) => (
                                    <span
                                        key={index}
                                        className={
                                            index < playbook.harm ? 'is-marked' : ''
                                        }
                                    />
                                ))}
                            </button>
                        )}
                    </>
                )
            case 'gear':
                return gear.length ? (
                    <section className="mh-stat-block">
                        <h2>{t('pbta:playbook.sections.gear')}</h2>
                        <ul className="mh-conditions">
                            {gear.map((item, index) => (
                                <li key={`${item.name}-${index}`}>
                                    <strong>{item.name}</strong>
                                    {item.description && <span>{item.description}</span>}
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
            case 'monsterhearts-progression':
                return isVisible('advances') ? (
                    <section>
                        <button
                            type="button"
                            className="mh-section-title"
                            onClick={() => open('advances')}
                        >
                            {t('pbta:monsterhearts.sections.advances')} □ □ □ □ □
                        </button>
                        <ul className="mh-checklist">
                            {playbook.advances.map((advance, index) => (
                                <li
                                    key={`${advance.label}-${index}`}
                                    className={getAdvanceCheckClass(advance.checked)}
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
        <div className="monsterhearts-doc">
            <article
                className="monsterhearts-sheet"
                style={{ '--mh-columns': layout.columns.length } as CSSProperties}
            >
                <button
                    type="button"
                    className="mh-header"
                    onClick={() => open('basic')}
                >
                    <h1>{playbook.name}</h1>
                    <p>{playbook.description}</p>
                </button>
                {layout.columns.map((column, index) => (
                    <div className="mh-column" key={index}>
                        {column.map((id) => (
                            <div className="mh-region" key={id}>
                                {renderRegion(id)}
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
            </article>
        </div>
    )
}
