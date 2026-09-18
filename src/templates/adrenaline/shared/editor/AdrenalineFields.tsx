import {
    LongTextField,
    NumberField,
    RangedNumberField,
    RecordRows,
    StringRows,
    TextField,
} from './FieldPrimitives'

type RecordValue = Record<string, unknown>
const stats = ['for', 'con', 'dex', 'rap', 'log', 'vol', 'per', 'cha']
const wounds = ['superficiel', 'leger', 'grave', 'profond']
const record = (value: unknown): RecordValue =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as RecordValue)
        : {}
const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : []
const rows = (value: unknown): RecordValue[] =>
    Array.isArray(value)
        ? value.filter(
              (entry): entry is RecordValue =>
                  Boolean(entry) &&
                  typeof entry === 'object' &&
                  !Array.isArray(entry)
          )
        : []

export function CharacteristicsFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            {stats.map((key) => (
                <RangedNumberField
                    key={key}
                    label={key.toUpperCase()}
                    value={current[key]}
                    onChange={(next) => onChange({ ...current, [key]: next })}
                />
            ))}
        </div>
    )
}

export function IdentityFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    const textFields = [
        ['nationalite', 'Nationalité'],
        ['genre', 'Genre'],
        ['cheveux', 'Cheveux'],
        ['yeux', 'Yeux'],
        ['taille', 'Taille'],
        ['peau', 'Peau'],
        ['poids', 'Poids'],
    ] as const
    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
                {textFields.map(([key, label]) => (
                    <TextField
                        key={key}
                        label={label}
                        value={String(current[key] ?? '')}
                        onChange={(next) =>
                            onChange({ ...current, [key]: next })
                        }
                    />
                ))}
                <NumberField
                    label="Âge"
                    value={Number(current.age ?? 0)}
                    onChange={(age) => onChange({ ...current, age })}
                />
            </div>
            <StringRows
                label="Signes particuliers"
                values={strings(current.signesParticuliers)}
                onChange={(signesParticuliers) =>
                    onChange({ ...current, signesParticuliers })
                }
            />
        </div>
    )
}

export function HealthFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid gap-3">
            {(['physique', 'mental'] as const).map((kind) => {
                const block = record(current[kind])
                return (
                    <div className="grid gap-2" key={kind}>
                        <h4 className="font-medium capitalize">Santé {kind}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {wounds.map((level) => {
                                const threshold = record(block[level])
                                const set = (key: string, next: unknown) =>
                                    onChange({
                                        ...current,
                                        [kind]: {
                                            ...block,
                                            [level]: {
                                                ...threshold,
                                                [key]: next,
                                            },
                                        },
                                    })
                                return (
                                    <div className="grid gap-1" key={level}>
                                        <RangedNumberField
                                            label={`${level} base`}
                                            value={threshold.base}
                                            onChange={(next) =>
                                                set('base', next)
                                            }
                                        />
                                        <RangedNumberField
                                            label="Couvert"
                                            value={threshold.couvert}
                                            onChange={(next) =>
                                                set('couvert', next)
                                            }
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function DefenceFields({
    label,
    value,
    onChange,
    mental,
}: {
    label: string
    value: unknown
    onChange: (value: RecordValue) => void
    mental?: boolean
}) {
    const current = record(value)
    const shield = record(current.bouclier)
    const armour = record(current[mental ? 'caractere' : 'armure'])
    const armourKey = mental ? 'caractere' : 'armure'
    return (
        <div className="grid gap-2 rounded border p-2">
            <h4 className="font-medium">{label}</h4>
            <RangedNumberField
                label="Solidité"
                value={current.solidite}
                onChange={(solidite) => onChange({ ...current, solidite })}
            />
            <div className="grid grid-cols-2 gap-2">
                <TextField
                    label={mental ? 'Trait de caractère' : 'Armure'}
                    value={String(armour[mental ? 'trait' : 'nom'] ?? '')}
                    onChange={(next) =>
                        onChange({
                            ...current,
                            [armourKey]: {
                                ...armour,
                                [mental ? 'trait' : 'nom']: next,
                            },
                        })
                    }
                />
                <RangedNumberField
                    label="Points"
                    value={armour.points}
                    onChange={(points) =>
                        onChange({
                            ...current,
                            [armourKey]: { ...armour, points },
                        })
                    }
                />
            </div>
            <StringRows
                label="Localisations"
                values={strings(armour.localisations)}
                onChange={(localisations) =>
                    onChange({
                        ...current,
                        [armourKey]: { ...armour, localisations },
                    })
                }
            />
            <TextField
                label="Bouclier"
                value={String(shield.nom ?? '')}
                onChange={(nom) =>
                    onChange({ ...current, bouclier: { ...shield, nom } })
                }
            />
            <StringRows
                label="Propriétés du bouclier"
                values={strings(shield.proprietes)}
                onChange={(proprietes) =>
                    onChange({
                        ...current,
                        bouclier: { ...shield, proprietes },
                    })
                }
            />
        </div>
    )
}
export function ProtectionFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid gap-3">
            <DefenceFields
                label="Protection physique"
                value={current.physiques}
                onChange={(physiques) => onChange({ ...current, physiques })}
            />
            <DefenceFields
                label="Protection mentale"
                mental
                value={current.mentales}
                onChange={(mentales) => onChange({ ...current, mentales })}
            />
        </div>
    )
}

export function SkillRows({
    label,
    value,
    onChange,
}: {
    label: string
    value: unknown
    onChange: (value: RecordValue[]) => void
}) {
    const current = rows(value)
    return (
        <RecordRows
            label={label}
            values={current}
            create={() => ({
                nom: '',
                specialite: '',
                pourcentage: { minimum: 0, current: 0, maximum: 0 },
                caracteristique: '',
                total: { minimum: 0, current: 0, maximum: 0 },
                avantages: [],
            })}
            onChange={onChange}
        >
            {(entry, _, replace) => (
                <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <TextField
                            label="Nom"
                            value={String(entry.nom ?? '')}
                            onChange={(nom) => replace({ ...entry, nom })}
                        />
                        <TextField
                            label="Spécialité"
                            value={String(entry.specialite ?? '')}
                            onChange={(specialite) =>
                                replace({ ...entry, specialite })
                            }
                        />
                        <RangedNumberField
                            label="Pourcentage"
                            value={entry.pourcentage}
                            onChange={(pourcentage) =>
                                replace({ ...entry, pourcentage })
                            }
                        />
                        <TextField
                            label="Caractéristique"
                            value={String(entry.caracteristique ?? '')}
                            onChange={(caracteristique) =>
                                replace({ ...entry, caracteristique })
                            }
                        />
                        <RangedNumberField
                            label="Total"
                            value={entry.total}
                            onChange={(total) => replace({ ...entry, total })}
                        />
                    </div>
                    <StringRows
                        label="Avantages"
                        values={strings(entry.avantages)}
                        onChange={(avantages) =>
                            replace({ ...entry, avantages })
                        }
                    />
                </div>
            )}
        </RecordRows>
    )
}

export function EquipmentFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    const weapons = (key: string, label: string) => (
        <RecordRows
            label={label}
            values={rows(current[key])}
            create={() => ({
                nom: '',
                pourcentage: { minimum: 0, current: 0, maximum: 0 },
                desDeDegats: 0,
                type: '',
                notes: '',
            })}
            onChange={(next) => onChange({ ...current, [key]: next })}
        >
            {(entry, _, replace) => (
                <div className="grid grid-cols-2 gap-2">
                    <TextField
                        label="Nom"
                        value={String(entry.nom ?? '')}
                        onChange={(nom) => replace({ ...entry, nom })}
                    />
                    <RangedNumberField
                        label="Pourcentage"
                        value={entry.pourcentage}
                        onChange={(pourcentage) =>
                            replace({ ...entry, pourcentage })
                        }
                    />
                    <NumberField
                        label="Dés de dégâts"
                        value={Number(entry.desDeDegats ?? 0)}
                        onChange={(desDeDegats) =>
                            replace({ ...entry, desDeDegats })
                        }
                    />
                    <TextField
                        label="Type"
                        value={String(entry.type ?? '')}
                        onChange={(type) => replace({ ...entry, type })}
                    />
                    <LongTextField
                        label="Notes"
                        value={String(entry.notes ?? '')}
                        onChange={(notes) => replace({ ...entry, notes })}
                    />
                </div>
            )}
        </RecordRows>
    )
    return (
        <div className="grid gap-3">
            <StringRows
                label="Possessions"
                values={strings(current.possessions)}
                onChange={(possessions) =>
                    onChange({ ...current, possessions })
                }
            />
            <TextField
                label="Équipement favori"
                value={String(current.equipementFavori ?? '')}
                onChange={(equipementFavori) =>
                    onChange({ ...current, equipementFavori })
                }
            />
            {weapons('armesPhysiques', 'Armes physiques')}
            {weapons('armesMentales', 'Armes mentales')}
        </div>
    )
}

export function NarrativeFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid gap-2">
            <TextField
                label="Rôle"
                value={String(current.role ?? '')}
                onChange={(role) => onChange({ ...current, role })}
            />
            <TextField
                label="Attitude"
                value={String(current.attitude ?? '')}
                onChange={(attitude) => onChange({ ...current, attitude })}
            />
            <LongTextField
                label="Historique"
                value={String(current.historique ?? '')}
                onChange={(historique) => onChange({ ...current, historique })}
            />
            <LongTextField
                label="Évolution possible"
                value={String(current.evolutionPossible ?? '')}
                onChange={(evolutionPossible) =>
                    onChange({ ...current, evolutionPossible })
                }
            />
            {(
                [
                    ['personnalite', 'Personnalité'],
                    ['interpretation', 'Interprétation'],
                    ['repliques', 'Répliques'],
                    ['notesMj', 'Notes MJ'],
                ] as const
            ).map(([key, label]) => (
                <StringRows
                    key={key}
                    label={label}
                    values={strings(current[key])}
                    onChange={(next) => onChange({ ...current, [key]: next })}
                />
            ))}
        </div>
    )
}

export function MetaFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            <TextField
                label="Type de publication"
                value={String(current.typeDePublication ?? '')}
                onChange={(typeDePublication) =>
                    onChange({ ...current, typeDePublication })
                }
            />
            <TextField
                label="Source"
                value={String(current.source ?? '')}
                onChange={(source) => onChange({ ...current, source })}
            />
            <StringRows
                label="Auteurs"
                values={strings(current.auteurs)}
                onChange={(auteurs) => onChange({ ...current, auteurs })}
            />
            <NumberField
                label="Page"
                value={Number(current.page ?? 0)}
                onChange={(page) => onChange({ ...current, page })}
            />
            <TextField
                label="Licence"
                value={String(current.licence ?? '')}
                onChange={(licence) => onChange({ ...current, licence })}
            />
        </div>
    )
}

export function ParametersFields({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            {(
                [
                    ['joueur', 'Joueur'],
                    ['typeDeCreation', 'Type de création'],
                    ['typeDeScenario', 'Type de scénario'],
                    ['declinaisonDeCampagne', 'Déclinaison de campagne'],
                ] as const
            ).map(([key, label]) => (
                <TextField
                    key={key}
                    label={label}
                    value={String(current[key] ?? '')}
                    onChange={(next) => onChange({ ...current, [key]: next })}
                />
            ))}
            <RangedNumberField
                label="PX"
                value={current.px}
                onChange={(px) => onChange({ ...current, px })}
            />
        </div>
    )
}
