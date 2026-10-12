import {
    LongTextField,
    NumberField,
    TextField,
} from '../../../shared/editor/FieldPrimitives'
import {
    EnumSelect,
    OptionalNumberField,
    OptionalTextField,
} from '../../../shared/editor/OptionalFields'
import { creatureFields } from '../fieldHelpers'
import { useMonstreEdit } from '../useMonstreEdit'

/* The identity block, the danger line, the description and the detection, movement, actions and defense it prints. */
export function BasicForm() {
    const {
        text,
        set,
        setOptional,
        shows,
        detectionSource,
        movementSource,
        actionsPerRound,
        defenseSource,
        defense,
        setDefense,
        profileLine,
        ownership,
        errorLine,
        document,
    } = useMonstreEdit()
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:monstre.form.creatureHeading')}
            </h3>
            {profileLine()}
            {ownership([
                [
                    text('adrenaline:monstre.form.detectionRange'),
                    detectionSource,
                ],
                [text('adrenaline:monstre.form.movement'), movementSource],
                [
                    text('adrenaline:monstre.form.actionsPerRound'),
                    actionsPerRound,
                ],
                [text('adrenaline:monstre.form.defense'), defenseSource],
            ])}
            {creatureFields
                .filter(([key]) => shows(key))
                .map(([key, labelKey]) => (
                    <TextField
                        key={key}
                        label={text(labelKey)}
                        value={String(document[key] ?? '')}
                        onChange={(next) => set(key, next)}
                    />
                ))}
            {shows('niveauDeDanger') ? (
                <NumberField
                    label={text('adrenaline:monstre.form.dangerLevel')}
                    value={Number(document.niveauDeDanger ?? 0)}
                    onChange={(niveauDeDanger) =>
                        set('niveauDeDanger', niveauDeDanger)
                    }
                />
            ) : null}
            {shows('categorie') ? (
                <OptionalTextField
                    label={text('adrenaline:shared.category')}
                    value={document.categorie}
                    onChange={(categorie) =>
                        setOptional('categorie', categorie)
                    }
                />
            ) : null}
            {shows('niveauDeDangerAlternatif') ? (
                <OptionalNumberField
                    label={text('adrenaline:shared.dangerAlternative')}
                    value={document.niveauDeDangerAlternatif}
                    onChange={(alternative) =>
                        setOptional('niveauDeDangerAlternatif', alternative)
                    }
                />
            ) : null}
            {shows('niveauDeDangerNote') ? (
                <OptionalTextField
                    label={text('adrenaline:shared.dangerNote')}
                    value={document.niveauDeDangerNote}
                    onChange={(note) => setOptional('niveauDeDangerNote', note)}
                />
            ) : null}
            {shows('zoneDeDetection') ? (
                <TextField
                    label={text('adrenaline:monstre.form.detectionRange')}
                    value={String(detectionSource.value ?? '')}
                    onChange={detectionSource.write}
                />
            ) : null}
            {shows('deplacement') ? (
                <TextField
                    label={text('adrenaline:monstre.form.movement')}
                    value={String(movementSource.value ?? '')}
                    onChange={movementSource.write}
                />
            ) : null}
            {shows('actionsParRound') ? (
                <NumberField
                    label={text('adrenaline:monstre.form.actionsPerRound')}
                    value={Number(actionsPerRound.value ?? 0)}
                    onChange={(value) => actionsPerRound.write(value)}
                />
            ) : null}
            {shows('defense') ? (
                <fieldset className="grid gap-2 rounded border p-2">
                    <legend className="px-1 text-sm">
                        {text('adrenaline:monstre.form.defense')}
                    </legend>
                    <EnumSelect
                        label={text('adrenaline:monstre.form.defenseLevel')}
                        value={defense.niveau}
                        options={[
                            ['oui', 'adrenaline:monstre.form.defenseYes'],
                            [
                                'expose',
                                'adrenaline:monstre.form.defenseExposed',
                            ],
                            ['non', 'adrenaline:monstre.form.defenseNo'],
                        ]}
                        onChange={(niveau) => setDefense('niveau', niveau)}
                    />
                    <OptionalNumberField
                        label={text('adrenaline:monstre.form.defenseBonus')}
                        value={defense.bonus}
                        onChange={(bonus) => setDefense('bonus', bonus)}
                    />
                    <OptionalTextField
                        label={text('fields.notes')}
                        value={defense.notes}
                        onChange={(notes) => setDefense('notes', notes)}
                    />
                </fieldset>
            ) : null}
            {shows('description') ? (
                <LongTextField
                    label={text('fields.description')}
                    value={String(document.description ?? '')}
                    onChange={(description) => set('description', description)}
                />
            ) : null}
            {errorLine()}
        </section>
    )
}
