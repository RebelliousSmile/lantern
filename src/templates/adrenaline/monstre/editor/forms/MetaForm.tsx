import { MetaFields } from '../../../shared/editor/AdrenalineFields'
import { useMonstreEdit } from '../useMonstreEdit'

export function MetaForm() {
    const { text, set, document } = useMonstreEdit()
    return (
        <>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.provenance')}
                </h3>
                <MetaFields
                    value={document.meta}
                    onChange={(meta) => set('meta', meta)}
                />
            </section>
        </>
    )
}
