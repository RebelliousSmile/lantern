import { HealthFields } from '../../../shared/editor/AdrenalineFields'
import {
    CleanStringRows,
    OptionalNumberField,
} from '../../../shared/editor/OptionalFields'
import { strings } from '../fieldHelpers'
import { useMonstreEdit } from '../useMonstreEdit'

/* The health track, the permanent states and the maluses before zero health. */
export function HealthForm() {
    const {
        text,
        shows,
        healthSource,
        permanentStatesSource,
        maluses,
        profileLine,
        ownership,
        errorLine,
    } = useMonstreEdit()
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:shared.headings.health')}
            </h3>
            {profileLine()}
            {ownership([
                [text('adrenaline:shared.headings.health'), healthSource],
                [
                    text('adrenaline:monstre.form.permanentStates'),
                    permanentStatesSource,
                ],
                [text('adrenaline:monstre.form.maluses'), maluses],
            ])}
            {shows('sante') ? (
                <HealthFields
                    form="number"
                    value={healthSource.value}
                    onChange={healthSource.write}
                />
            ) : null}
            {shows('etatsPermanents') ? (
                <CleanStringRows
                    label={text('adrenaline:monstre.form.permanentStates')}
                    values={strings(permanentStatesSource.value)}
                    onChange={permanentStatesSource.write}
                />
            ) : null}
            {shows('malusAvantHs') ? (
                <OptionalNumberField
                    label={text('adrenaline:monstre.form.maluses')}
                    value={maluses.value}
                    onChange={maluses.write}
                />
            ) : null}
            {errorLine()}
        </section>
    )
}
