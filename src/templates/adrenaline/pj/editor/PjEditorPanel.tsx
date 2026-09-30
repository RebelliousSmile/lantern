import { useUiText } from '@/i18n/text'
import {
    CharacteristicsFields,
    EquipmentFields,
    HealthFields,
    IdentityFields,
    MetaFields,
    ParametersFields,
    ProtectionFields,
    SkillRows,
} from '../../shared/editor/AdrenalineFields'
import {
    RangedNumberField,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import {
    FORMATION_TYPES,
    formationColumns,
    formationTypeLabel,
    withFormation,
} from '../../shared/formations'
import { useAdrenalineDocument } from '../../shared/hooks'
import type { PjSection } from '../../shared/sections'
import { blankPj } from '../sample'

type Entry = Record<string, unknown>
const records = (value: unknown): Entry[] =>
    Array.isArray(value)
        ? value.filter(
              (entry): entry is Entry =>
                  Boolean(entry) &&
                  typeof entry === 'object' &&
                  !Array.isArray(entry)
          )
        : []

const blankFormation = (): Entry => ({
    nom: '',
    pourcentage: { minimum: 0, current: 0, maximum: 0 },
    competences: [],
})

export function PjEditorPanel() {
    const text = useUiText()
    const { document, update, sheet } = useAdrenalineDocument<
        Record<string, unknown>,
        PjSection
    >('adrenaline.pj', blankPj() as unknown as Record<string, unknown>)
    const set = (key: string, value: unknown) =>
        update((next) => {
            next[key] = value
        })
    if (!sheet.open || !sheet.target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('adrenaline:sections.emptyState')}
            </div>
        )
    }
    const target = sheet.target
    return (
        <div className="space-y-6 p-1">
            {target === 'parameters' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:pj.form.characterHeading')}
                    </h3>
                    <TextField
                        label={text('fields.name')}
                        value={String(document.nom ?? '')}
                        onChange={(nom) => set('nom', nom)}
                    />
                    <ParametersFields
                        value={document.parametresDuJeu}
                        onChange={(parametresDuJeu) =>
                            set('parametresDuJeu', parametresDuJeu)
                        }
                    />
                </section>
            )}
            {target === 'identity' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.identity')}
                    </h3>
                    <IdentityFields
                        value={document.identite}
                        onChange={(identite) => set('identite', identite)}
                    />
                </section>
            )}
            {target === 'characteristics' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.characteristics')}
                    </h3>
                    <CharacteristicsFields
                        value={document.caracteristiques}
                        onChange={(caracteristiques) =>
                            set('caracteristiques', caracteristiques)
                        }
                    />
                </section>
            )}
            {target === 'health' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.health')}
                    </h3>
                    <HealthFields
                        value={document.sante}
                        onChange={(sante) => set('sante', sante)}
                    />
                </section>
            )}
            {target === 'protections' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.protections')}
                    </h3>
                    <ProtectionFields
                        value={document.protections}
                        onChange={(protections) =>
                            set('protections', protections)
                        }
                    />
                </section>
            )}
            {target === 'formations' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:pj.form.trainingsHeading')}
                    </h3>
                    {formationColumns(records(document.formations))
                        .slice(0, FORMATION_TYPES.length)
                        .map(({ type, formation = blankFormation() }) => {
                            const replace = (next: Entry) =>
                                set(
                                    'formations',
                                    withFormation(
                                        records(document.formations),
                                        type,
                                        next
                                    )
                                )
                            return (
                                <fieldset
                                    className="grid gap-2 rounded-md border p-3"
                                    key={type}
                                >
                                    <legend className="px-1 text-sm font-semibold">
                                        {formationTypeLabel(type)}
                                    </legend>
                                    <div className="grid grid-cols-2 gap-2">
                                        <TextField
                                            label={text(
                                                'adrenaline:shared.trainings.title'
                                            )}
                                            value={String(formation.nom ?? '')}
                                            onChange={(nom) =>
                                                replace({ ...formation, nom })
                                            }
                                        />
                                        <RangedNumberField
                                            label={text(
                                                'adrenaline:shared.percentage'
                                            )}
                                            value={formation.pourcentage}
                                            onChange={(pourcentage) =>
                                                replace({
                                                    ...formation,
                                                    pourcentage,
                                                })
                                            }
                                        />
                                    </div>
                                    <SkillRows
                                        label={text(
                                            'adrenaline:shared.trainings.trainingSkills'
                                        )}
                                        value={formation.competences}
                                        onChange={(competences) =>
                                            replace({
                                                ...formation,
                                                competences,
                                            })
                                        }
                                    />
                                </fieldset>
                            )
                        })}
                </section>
            )}
            {target === 'equipment' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.equipment')}
                    </h3>
                    <EquipmentFields
                        value={document.equipement}
                        onChange={(equipement) => set('equipement', equipement)}
                    />
                </section>
            )}
            {target === 'meta' && (
                <section className="grid gap-3">
                    <h3 className="font-semibold">
                        {text('adrenaline:shared.headings.provenance')}
                    </h3>
                    <MetaFields
                        value={document.meta}
                        onChange={(meta) => set('meta', meta)}
                    />
                </section>
            )}
        </div>
    )
}
