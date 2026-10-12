import { EquipmentFields } from '../../../shared/editor/AdrenalineFields'
import { WEAPON_FIELDS } from '../../../shared/schemaFields'
import { useMonstreEdit } from '../useMonstreEdit'

export function EquipmentForm() {
    const { shows, text, equipmentSource, profileLine, ownership, errorLine } =
        useMonstreEdit()
    /* Only the zone that was clicked: this panel is that one key. */
    if (!shows('equipement')) return null
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:shared.headings.equipment')}
            </h3>
            {profileLine()}
            {ownership([
                [text('adrenaline:shared.headings.equipment'), equipmentSource],
            ])}
            <EquipmentFields
                form="number"
                weapons={WEAPON_FIELDS.monstre}
                value={equipmentSource.value}
                onChange={equipmentSource.write}
            />
            {errorLine()}
        </section>
    )
}
