import {
    CharacteristicsFields,
    EquipmentFields,
    HealthFields,
    MetaFields,
    NarrativeFields,
    ProtectionFields,
    SkillRows,
} from '../../shared/editor/AdrenalineFields'
import {
    LongTextField,
    NumberField,
    RangedNumberField,
    RecordRows,
    StringRows,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import { useAdrenalineDocument } from '../../shared/hooks'
import { blankMonstre } from '../sample'

type Entry = Record<string, unknown>
const record = (value: unknown): Entry =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Entry)
        : {}
const records = (value: unknown): Entry[] =>
    Array.isArray(value)
        ? value.filter(
              (entry): entry is Entry =>
                  Boolean(entry) &&
                  typeof entry === 'object' &&
                  !Array.isArray(entry)
          )
        : []
const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : []

export function MonstreEditorPanel() {
    const { document, update } = useAdrenalineDocument(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    const set = (key: string, value: unknown) =>
        update((next) => {
            next[key] = value
        })
    const alternate = record(document.etatAlternatif)
    const contagion = record(document.contagion)
    return (
        <div className="space-y-6 p-1">
            <section className="grid gap-2">
                <h3 className="font-semibold">Créature</h3>
                {(
                    [
                        ['nom', 'Nom'],
                        ['typeDeCorps', 'Type de corps'],
                        ['instinct', 'Instinct'],
                        ['typeInfecte', 'Type infecté'],
                        ['zoneDeDetection', 'Zone de détection'],
                        ['deplacement', 'Déplacement'],
                    ] as const
                ).map(([key, label]) => (
                    <TextField
                        key={key}
                        label={label}
                        value={String(document[key] ?? '')}
                        onChange={(next) => set(key, next)}
                    />
                ))}
                <NumberField
                    label="Niveau de danger"
                    value={Number(document.niveauDeDanger ?? 0)}
                    onChange={(niveauDeDanger) =>
                        set('niveauDeDanger', niveauDeDanger)
                    }
                />
                <NumberField
                    label="Actions par round"
                    value={Number(document.actionsParRound ?? 0)}
                    onChange={(actionsParRound) =>
                        set('actionsParRound', actionsParRound)
                    }
                />
                <LongTextField
                    label="Description"
                    value={String(document.description ?? '')}
                    onChange={(description) => set('description', description)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Caractéristiques</h3>
                <CharacteristicsFields
                    value={document.caracteristiques}
                    onChange={(caracteristiques) =>
                        set('caracteristiques', caracteristiques)
                    }
                />
            </section>
            <section className="grid gap-2">
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
            <section className="grid gap-2">
                <h3 className="font-semibold">Comportement</h3>
                <StringRows
                    label="Comportements"
                    values={strings(document.comportement)}
                    onChange={(comportement) =>
                        set('comportement', comportement)
                    }
                />
                <StringRows
                    label="Traits spéciaux"
                    values={strings(document.traitsSpeciaux)}
                    onChange={(traitsSpeciaux) =>
                        set('traitsSpeciaux', traitsSpeciaux)
                    }
                />
                <SkillRows
                    label="Compétences"
                    value={document.competences}
                    onChange={(competences) => set('competences', competences)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Équipement</h3>
                <EquipmentFields
                    value={document.equipement}
                    onChange={(equipement) => set('equipement', equipement)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">État alternatif</h3>
                <TextField
                    label="Nom"
                    value={String(alternate.nom ?? '')}
                    onChange={(nom) =>
                        set('etatAlternatif', { ...alternate, nom })
                    }
                />
                <StringRows
                    label="Déclencheurs"
                    values={strings(alternate.declencheurs)}
                    onChange={(declencheurs) =>
                        set('etatAlternatif', { ...alternate, declencheurs })
                    }
                />
                <CharacteristicsFields
                    value={alternate.caracteristiques}
                    onChange={(caracteristiques) =>
                        set('etatAlternatif', {
                            ...alternate,
                            caracteristiques,
                        })
                    }
                />
                <TextField
                    label="Zone de détection"
                    value={String(alternate.zoneDeDetection ?? '')}
                    onChange={(zoneDeDetection) =>
                        set('etatAlternatif', { ...alternate, zoneDeDetection })
                    }
                />
                <TextField
                    label="Déplacement"
                    value={String(alternate.deplacement ?? '')}
                    onChange={(deplacement) =>
                        set('etatAlternatif', { ...alternate, deplacement })
                    }
                />
                <NumberField
                    label="Actions par round"
                    value={Number(alternate.actionsParRound ?? 0)}
                    onChange={(actionsParRound) =>
                        set('etatAlternatif', { ...alternate, actionsParRound })
                    }
                />
                <LongTextField
                    label="Notes"
                    value={String(alternate.notes ?? '')}
                    onChange={(notes) =>
                        set('etatAlternatif', { ...alternate, notes })
                    }
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Contagion</h3>
                <TextField
                    label="Agent"
                    value={String(contagion.agent ?? '')}
                    onChange={(agent) =>
                        set('contagion', { ...contagion, agent })
                    }
                />
                <TextField
                    label="Délai avant effet"
                    value={String(contagion.delaiAvantEffet ?? '')}
                    onChange={(delaiAvantEffet) =>
                        set('contagion', { ...contagion, delaiAvantEffet })
                    }
                />
                <LongTextField
                    label="Issue"
                    value={String(contagion.issue ?? '')}
                    onChange={(issue) =>
                        set('contagion', { ...contagion, issue })
                    }
                />
                <RecordRows
                    label="Vecteurs"
                    values={records(contagion.vecteurs)}
                    create={() => ({
                        nom: '',
                        probabilite: { minimum: 0, current: 0, maximum: 0 },
                        notes: '',
                    })}
                    onChange={(vecteurs) =>
                        set('contagion', { ...contagion, vecteurs })
                    }
                >
                    {(entry, _, replace) => (
                        <div className="grid grid-cols-2 gap-2">
                            <TextField
                                label="Nom"
                                value={String(entry.nom ?? '')}
                                onChange={(nom) => replace({ ...entry, nom })}
                            />
                            <RangedNumberField
                                label="Probabilité"
                                value={entry.probabilite}
                                onChange={(probabilite) =>
                                    replace({ ...entry, probabilite })
                                }
                            />
                            <LongTextField
                                label="Notes"
                                value={String(entry.notes ?? '')}
                                onChange={(notes) =>
                                    replace({ ...entry, notes })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
                <RecordRows
                    label="Modulations"
                    values={records(contagion.modulations)}
                    create={() => ({
                        profil: '',
                        delaiAvantEffet: '',
                        issue: '',
                    })}
                    onChange={(modulations) =>
                        set('contagion', { ...contagion, modulations })
                    }
                >
                    {(entry, _, replace) => (
                        <div className="grid grid-cols-2 gap-2">
                            <TextField
                                label="Profil"
                                value={String(entry.profil ?? '')}
                                onChange={(profil) =>
                                    replace({ ...entry, profil })
                                }
                            />
                            <TextField
                                label="Délai avant effet"
                                value={String(entry.delaiAvantEffet ?? '')}
                                onChange={(delaiAvantEffet) =>
                                    replace({ ...entry, delaiAvantEffet })
                                }
                            />
                            <LongTextField
                                label="Issue"
                                value={String(entry.issue ?? '')}
                                onChange={(issue) =>
                                    replace({ ...entry, issue })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Narratif</h3>
                <NarrativeFields
                    value={document.narratif}
                    onChange={(narratif) => set('narratif', narratif)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Provenance</h3>
                <MetaFields
                    value={document.meta}
                    onChange={(meta) => set('meta', meta)}
                />
            </section>
        </div>
    )
}
