import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import { sections } from '../model'
import './monsterheartsPlaybookTheme.css'
export function MonsterheartsPlaybookPreview() {
    const { playbook } = useMonsterheartsStore()
    const { open } = useMonsterheartsSheet()
    const view = useMonsterheartsView()
    const values: Record<string, unknown> = {
        strings: playbook.strings,
        conditions: playbook.conditions,
        editorial: playbook.editorial,
        moves: playbook.moves.map((move) => `${move.checked ? '☑' : '☐'} ${'ref' in move ? move.ref : move.name}`),
        advances: playbook.advances.map((advance) => `${advance.checked ? '☑' : '☐'} ${advance.label}`),
        harm: playbook.harm,
    }
    return (
        <div className="monsterhearts-doc">
            <article className="monsterhearts-sheet">
                <button onClick={() => open('basic')}>
                    <h1>{playbook.name}</h1>
                    <p>{playbook.description}</p>
                </button>
                {sections.map(
                    (s) =>
                        !view.hidden[s.id] && (
                            <section key={s.id}>
                                <button onClick={() => open(s.id)}>
                                    {s.label}
                                </button>
                                <pre>
                                    {JSON.stringify(values[s.id], null, 2)}
                                </pre>
                            </section>
                        )
                )}
            </article>
        </div>
    )
}
