import { StringRows } from '../../../shared/editor/FieldPrimitives'
import { ActionRows } from '../ActionRows'
import { strings } from '../fieldHelpers'
import { useMonstreEdit } from '../useMonstreEdit'

/* The behaviour lines, the special traits and the actions: only those the clicked block prints. */
export function BehaviourForm() {
    const {
        text,
        shows,
        behaviours,
        traits,
        actionsSource,
        profileLine,
        ownership,
        errorLine,
    } = useMonstreEdit()
    return (
        <section className="grid gap-2">
            {profileLine()}
            {ownership([
                [text('adrenaline:monstre.form.behaviours'), behaviours],
                [text('adrenaline:monstre.form.specialTraits'), traits],
                [text('adrenaline:monstre.form.actions'), actionsSource],
            ])}
            {shows('comportement') ? (
                <StringRows
                    label={text('adrenaline:monstre.form.behaviours')}
                    values={strings(behaviours.value)}
                    onChange={(comportement) => behaviours.write(comportement)}
                />
            ) : null}
            {shows('traitsSpeciaux') ? (
                <StringRows
                    label={text('adrenaline:monstre.form.specialTraits')}
                    values={strings(traits.value)}
                    onChange={(traitsSpeciaux) => traits.write(traitsSpeciaux)}
                />
            ) : null}
            {shows('actions') ? (
                <ActionRows
                    key={actionsSource.owner ? actionsSource.owner.id : 'base'}
                    label={text('adrenaline:monstre.form.actions')}
                    value={actionsSource.value}
                    onChange={actionsSource.write}
                />
            ) : null}
            {errorLine()}
        </section>
    )
}
