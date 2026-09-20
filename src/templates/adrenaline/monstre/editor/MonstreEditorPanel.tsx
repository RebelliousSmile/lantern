import { useUiText, type TranslationKey } from '@/i18n/text'
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

const creatureFields: [string, TranslationKey][] = [
    ['nom', 'fields.name'],
    ['typeDeCorps', 'adrenaline:monstre.form.bodyType'],
    ['instinct', 'adrenaline:monstre.form.instinct'],
    ['typeInfecte', 'adrenaline:monstre.form.infectedType'],
    ['zoneDeDetection', 'adrenaline:monstre.form.detectionRange'],
    ['deplacement', 'adrenaline:monstre.form.movement'],
]

export function MonstreEditorPanel() {
    const text = useUiText()
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
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.creatureHeading')}
                </h3>
                {creatureFields.map(([key, labelKey]) => (
                    <TextField
                        key={key}
                        label={text(labelKey)}
                        value={String(document[key] ?? '')}
                        onChange={(next) => set(key, next)}
                    />
                ))}
                <NumberField
                    label={text('adrenaline:monstre.form.dangerLevel')}
                    value={Number(document.niveauDeDanger ?? 0)}
                    onChange={(niveauDeDanger) =>
                        set('niveauDeDanger', niveauDeDanger)
                    }
                />
                <NumberField
                    label={text('adrenaline:monstre.form.actionsPerRound')}
                    value={Number(document.actionsParRound ?? 0)}
                    onChange={(actionsParRound) =>
                        set('actionsParRound', actionsParRound)
                    }
                />
                <LongTextField
                    label={text('fields.description')}
                    value={String(document.description ?? '')}
                    onChange={(description) => set('description', description)}
                />
            </section>
            <section className="grid gap-2">
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
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.health')}
                </h3>
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
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.behaviourHeading')}
                </h3>
                <StringRows
                    label={text('adrenaline:monstre.form.behaviours')}
                    values={strings(document.comportement)}
                    onChange={(comportement) =>
                        set('comportement', comportement)
                    }
                />
                <StringRows
                    label={text('adrenaline:monstre.form.specialTraits')}
                    values={strings(document.traitsSpeciaux)}
                    onChange={(traitsSpeciaux) =>
                        set('traitsSpeciaux', traitsSpeciaux)
                    }
                />
                <SkillRows
                    label={text('adrenaline:shared.skills.label')}
                    value={document.competences}
                    onChange={(competences) => set('competences', competences)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.equipment')}
                </h3>
                <EquipmentFields
                    value={document.equipement}
                    onChange={(equipement) => set('equipement', equipement)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.alternateStateHeading')}
                </h3>
                <TextField
                    label={text('fields.name')}
                    value={String(alternate.nom ?? '')}
                    onChange={(nom) =>
                        set('etatAlternatif', { ...alternate, nom })
                    }
                />
                <StringRows
                    label={text('adrenaline:monstre.form.triggers')}
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
                    label={text('adrenaline:monstre.form.detectionRange')}
                    value={String(alternate.zoneDeDetection ?? '')}
                    onChange={(zoneDeDetection) =>
                        set('etatAlternatif', { ...alternate, zoneDeDetection })
                    }
                />
                <TextField
                    label={text('adrenaline:monstre.form.movement')}
                    value={String(alternate.deplacement ?? '')}
                    onChange={(deplacement) =>
                        set('etatAlternatif', { ...alternate, deplacement })
                    }
                />
                <NumberField
                    label={text('adrenaline:monstre.form.actionsPerRound')}
                    value={Number(alternate.actionsParRound ?? 0)}
                    onChange={(actionsParRound) =>
                        set('etatAlternatif', { ...alternate, actionsParRound })
                    }
                />
                <LongTextField
                    label={text('fields.notes')}
                    value={String(alternate.notes ?? '')}
                    onChange={(notes) =>
                        set('etatAlternatif', { ...alternate, notes })
                    }
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.contagionHeading')}
                </h3>
                <TextField
                    label={text('adrenaline:monstre.form.agent')}
                    value={String(contagion.agent ?? '')}
                    onChange={(agent) =>
                        set('contagion', { ...contagion, agent })
                    }
                />
                <TextField
                    label={text('adrenaline:monstre.form.onsetDelay')}
                    value={String(contagion.delaiAvantEffet ?? '')}
                    onChange={(delaiAvantEffet) =>
                        set('contagion', { ...contagion, delaiAvantEffet })
                    }
                />
                <LongTextField
                    label={text('adrenaline:monstre.form.outcome')}
                    value={String(contagion.issue ?? '')}
                    onChange={(issue) =>
                        set('contagion', { ...contagion, issue })
                    }
                />
                <RecordRows
                    label={text('adrenaline:monstre.form.vectors')}
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
                                label={text('fields.name')}
                                value={String(entry.nom ?? '')}
                                onChange={(nom) => replace({ ...entry, nom })}
                            />
                            <RangedNumberField
                                label={text(
                                    'adrenaline:monstre.form.probability'
                                )}
                                value={entry.probabilite}
                                onChange={(probabilite) =>
                                    replace({ ...entry, probabilite })
                                }
                            />
                            <LongTextField
                                label={text('fields.notes')}
                                value={String(entry.notes ?? '')}
                                onChange={(notes) =>
                                    replace({ ...entry, notes })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
                <RecordRows
                    label={text('adrenaline:monstre.form.modifiers')}
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
                                label={text('adrenaline:monstre.form.profile')}
                                value={String(entry.profil ?? '')}
                                onChange={(profil) =>
                                    replace({ ...entry, profil })
                                }
                            />
                            <TextField
                                label={text(
                                    'adrenaline:monstre.form.onsetDelay'
                                )}
                                value={String(entry.delaiAvantEffet ?? '')}
                                onChange={(delaiAvantEffet) =>
                                    replace({ ...entry, delaiAvantEffet })
                                }
                            />
                            <LongTextField
                                label={text('adrenaline:monstre.form.outcome')}
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
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.narrative')}
                </h3>
                <NarrativeFields
                    value={document.narratif}
                    onChange={(narratif) => set('narratif', narratif)}
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:shared.headings.provenance')}
                </h3>
                <MetaFields
                    value={document.meta}
                    onChange={(meta) => set('meta', meta)}
                />
            </section>
        </div>
    )
}
