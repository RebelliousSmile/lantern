import { NarrativeFields } from '../../../shared/editor/AdrenalineFields'
import { useMonstreEdit } from '../useMonstreEdit'

export function NarrativeForm() {
    const { text, set, shows, document } = useMonstreEdit()
    if (!shows('narratif')) return null
    return (
        <>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.narrative')}
                </h3>
                <NarrativeFields
                    value={document.narratif}
                    onChange={(narratif) => set('narratif', narratif)}
                />
            </section>
        </>
    )
}
