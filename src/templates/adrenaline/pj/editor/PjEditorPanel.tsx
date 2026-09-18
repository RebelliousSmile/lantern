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
    RecordRows,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import { useAdrenalineDocument } from '../../shared/hooks'
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

export function PjEditorPanel() {
    const { document, update } = useAdrenalineDocument(
        'adrenaline.pj',
        blankPj() as unknown as Record<string, unknown>
    )
    const set = (key: string, value: unknown) =>
        update((next) => {
            next[key] = value
        })
    return (
        <div className="space-y-6 p-1">
            <section className="grid gap-3">
                <h3 className="font-semibold">Personnage et paramètres</h3>
                <TextField
                    label="Nom"
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
            <section className="grid gap-3">
                <h3 className="font-semibold">Identité</h3>
                <IdentityFields
                    value={document.identite}
                    onChange={(identite) => set('identite', identite)}
                />
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Caractéristiques</h3>
                <CharacteristicsFields
                    value={document.caracteristiques}
                    onChange={(caracteristiques) =>
                        set('caracteristiques', caracteristiques)
                    }
                />
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Santé et protections</h3>
                <HealthFields
                    value={document.sante}
                    onChange={(sante) => set('sante', sante)}
                />
                <ProtectionFields
                    value={document.protections}
                    onChange={(protections) => set('protections', protections)}
                />
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Formations</h3>
                <RecordRows
                    label="Formations"
                    values={records(document.formations)}
                    create={() => ({
                        type: '',
                        nom: '',
                        pourcentage: { minimum: 0, current: 0, maximum: 0 },
                        competences: [],
                    })}
                    onChange={(formations) => set('formations', formations)}
                >
                    {(formation, _, replace) => (
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <TextField
                                    label="Type"
                                    value={String(formation.type ?? '')}
                                    onChange={(type) =>
                                        replace({ ...formation, type })
                                    }
                                />
                                <TextField
                                    label="Nom"
                                    value={String(formation.nom ?? '')}
                                    onChange={(nom) =>
                                        replace({ ...formation, nom })
                                    }
                                />
                                <RangedNumberField
                                    label="Pourcentage"
                                    value={formation.pourcentage}
                                    onChange={(pourcentage) =>
                                        replace({ ...formation, pourcentage })
                                    }
                                />
                            </div>
                            <SkillRows
                                label="Compétences de formation"
                                value={formation.competences}
                                onChange={(competences) =>
                                    replace({ ...formation, competences })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Équipement</h3>
                <EquipmentFields
                    value={document.equipement}
                    onChange={(equipement) => set('equipement', equipement)}
                />
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Provenance</h3>
                <MetaFields
                    value={document.meta}
                    onChange={(meta) => set('meta', meta)}
                />
            </section>
        </div>
    )
}
