import { translateEnglish } from '@/i18n/text'
import {
    useUrbanShadowsPlaybookStore,
    useUrbanShadowsSheetStore,
    useUrbanShadowsViewStore,
} from '../hooks'
import { urbanShadowsSections } from '../metadata'
import './urbanShadowsPlaybookTheme.css'
export function UrbanShadowsPlaybookPreview() {
    const { playbook } = useUrbanShadowsPlaybookStore()
    const { openSheet } = useUrbanShadowsSheetStore()
    const view = useUrbanShadowsViewStore()
    const rows: Record<string, React.ReactNode> = {
        circles: (
            <>
                {Object.entries(playbook.stats)
                    .map(([k, v]) => `${k} ${v}`)
                    .join(' · ')}
                <br />
                {Object.entries(playbook.statuses)
                    .map(([k, v]) => `${k} ${v}`)
                    .join(' · ')}
            </>
        ),
        relationships: playbook.mortalRelationships.map((x) => (
            <p key={x.key}>
                <b>{x.label}</b>
                {x.description ? ` — ${x.description}` : ''}
            </p>
        )),
        harm: (
            <p>
                Armor {playbook.harm.armor ?? 0} · Faint{' '}
                {playbook.harm.faint ?? 0} · Serious{' '}
                {playbook.harm.serious ?? 0} · Critical{' '}
                {playbook.harm.critical ?? 0}
                <br />
                {playbook.scars.map((x) => x.name).join(', ')}
            </p>
        ),
        corruption: (
            <p>
                {playbook.corruption.trigger}
                <br />
                {playbook.corruption.advances
                    .map(
                        (advance) =>
                            `${advance.checked ? '☑' : '☐'} ${advance.label}`
                    )
                    .join(' · ')}
                <br />
                <b>End move:</b> {playbook.endMove}
            </p>
        ),
        editorial: <pre>{JSON.stringify(playbook.editorial, null, 2)}</pre>,
        moves: playbook.moves.map((x) => (
            <p key={x.name}>
                {x.checked ? '☑' : '☐'} <b>{x.name}</b> — {x.description}
            </p>
        )),
        creation: playbook.creation.map((x) => (
            <p key={x.label}>
                {x.label}:{' '}
                {x.options
                    .map((option) =>
                        typeof option === 'string' ? option : option.label
                    )
                    .join(', ')}
            </p>
        )),
        gear: playbook.gear.map((x) => (
            <p key={x.name}>
                <b>{x.name}</b> — {x.description}
            </p>
        )),
        advancement: playbook.advancement
            .map(
                (advance) => `${advance.checked ? '☑' : '☐'} ${advance.label}`
            )
            .join(' · '),
    }
    return (
        <div className="urban-shadows-doc">
            <article
                className="urban-shadows-sheet"
                style={{
                    transform: `scale(${view.zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <button
                    type="button"
                    onClick={() => openSheet({ kind: 'basic' })}
                    className="urban-shadows-header"
                >
                    <h1>{playbook.name}</h1>
                    <p>{playbook.description}</p>
                </button>
                {urbanShadowsSections.map(
                    (section) =>
                        !view.hidden[section.id] && (
                            <section key={section.id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openSheet({ kind: section.id })
                                    }
                                >
                                    {translateEnglish(section.label)}
                                </button>
                                <div>{rows[section.id]}</div>
                            </section>
                        )
                )}
            </article>
        </div>
    )
}
