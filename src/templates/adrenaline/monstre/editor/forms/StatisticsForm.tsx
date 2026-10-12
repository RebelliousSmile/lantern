import { CharacteristicsFields } from '../../../shared/editor/AdrenalineFields'
import { TextField } from '../../../shared/editor/FieldPrimitives'
import { CHARACTERISTIC_FIELDS } from '../../../shared/schemaFields'
import { useMonstreEdit } from '../useMonstreEdit'

/* The characteristics block and the detection and movement lines it prints. */
export function StatisticsForm() {
    const {
        text,
        shows,
        characteristicsSource,
        detectionSource,
        movementSource,
        profileLine,
        ownership,
        errorLine,
    } = useMonstreEdit()
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:shared.headings.characteristics')}
            </h3>
            {profileLine()}
            {ownership([
                [
                    text('adrenaline:shared.headings.characteristics'),
                    characteristicsSource,
                ],
                [
                    text('adrenaline:monstre.form.detectionRange'),
                    detectionSource,
                ],
                [text('adrenaline:monstre.form.movement'), movementSource],
            ])}
            {shows('caracteristiques') ? (
                <CharacteristicsFields
                    form="number"
                    keys={CHARACTERISTIC_FIELDS.monstre}
                    value={characteristicsSource.value}
                    onChange={characteristicsSource.write}
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
            {errorLine()}
        </section>
    )
}
