import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import './monsterheartsPlaybookTheme.css'

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
    const isVisible = (id: keyof typeof view.hidden) => !view.hidden[id]
    const { editorial } = playbook
    return (
        <div className="monsterhearts-doc">
            <article className="monsterhearts-sheet">
                <button
                    type="button"
                    className="mh-header"
                    onClick={() => open('basic')}
                >
                    <h1>{playbook.name}</h1>
                    <p>{playbook.description}</p>
                </button>
                <div className="mh-column">
                    {isVisible('moves') && (
                        <section>
                            <button
                                type="button"
                                className="mh-section-title"
                                onClick={() => open('moves')}
                            >
                                Actions
                            </button>
                            <div className="mh-actions">
                                {playbook.moves.length ? (
                                    playbook.moves.map((move, index) => (
                                        <article
                                            key={`${'ref' in move ? move.ref : move.name}-${index}`}
                                        >
                                            <h2>
                                                ♥{' '}
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
                                    <p className="mh-empty">No actions yet.</p>
                                )}
                            </div>
                        </section>
                    )}
                    {isVisible('editorial') && (
                        <>
                            <EditorialBlock
                                block={editorial.opening}
                                onClick={() => open('editorial')}
                            />
                            <EditorialBlock
                                block={editorial.sexMove}
                                onClick={() => open('editorial')}
                            />
                            <EditorialBlock
                                block={editorial.darkestSelf}
                                onClick={() => open('editorial')}
                            />
                        </>
                    )}
                </div>
                <div className="mh-column">
                    {isVisible('editorial') && (
                        <>
                            <EditorialBlock
                                block={editorial.identity}
                                onClick={() => open('editorial')}
                            />
                            <EditorialBlock
                                block={editorial.playAdvice}
                                onClick={() => open('editorial')}
                            />
                        </>
                    )}
                    {isVisible('strings') && (
                        <button
                            type="button"
                            className="mh-stat-block"
                            onClick={() => open('strings')}
                        >
                            <h2>Strings</h2>
                            <p>
                                Starting {playbook.strings.starting} · Maximum{' '}
                                {playbook.strings.max}
                            </p>
                        </button>
                    )}
                    {isVisible('conditions') && (
                        <button
                            type="button"
                            className="mh-stat-block"
                            onClick={() => open('conditions')}
                        >
                            <h2>Conditions</h2>
                            {playbook.conditions.length ? (
                                <ul className="mh-checklist">
                                    {playbook.conditions.map((condition) => (
                                        <li key={condition.name}>
                                            <strong>{condition.name}</strong>
                                            {condition.description && (
                                                <span>
                                                    {condition.description}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mh-empty">None yet.</p>
                            )}
                        </button>
                    )}
                </div>
                <div className="mh-column">
                    {isVisible('editorial') && (
                        <>
                            <EditorialBlock
                                block={editorial.progression}
                                onClick={() => open('editorial')}
                            />
                            <EditorialBlock
                                block={editorial.mcGuidance}
                                onClick={() => open('editorial')}
                            />
                        </>
                    )}
                    {isVisible('advances') && (
                        <section>
                            <button
                                type="button"
                                className="mh-section-title"
                                onClick={() => open('advances')}
                            >
                                Advances □ □ □ □ □
                            </button>
                            <ul className="mh-checklist">
                                {playbook.advances.map((advance, index) => (
                                    <li key={`${advance.label}-${index}`}>
                                        {advance.checked ? '☑' : '☐'}{' '}
                                        {advance.label}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {isVisible('harm') && (
                        <button
                            type="button"
                            className="mh-harm"
                            onClick={() => open('harm')}
                        >
                            Harm{' '}
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
                </div>
            </article>
        </div>
    )
}
