import { ProtectionFields } from '../../../shared/editor/AdrenalineFields'
import { useMonstreEdit } from '../useMonstreEdit'

export function ProtectionsForm() {
    const {
        shows,
        text,
        protectionsSource,
        profileLine,
        ownership,
        errorLine,
    } = useMonstreEdit()
    /* Only the zone that was clicked: this panel is that one key. */
    if (!shows('protections')) return null
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:shared.headings.protections')}
            </h3>
            {profileLine()}
            {ownership([
                [
                    text('adrenaline:shared.headings.protections'),
                    protectionsSource,
                ],
            ])}
            <ProtectionFields
                form="number"
                value={protectionsSource.value}
                onChange={protectionsSource.write}
            />
            {errorLine()}
        </section>
    )
}
