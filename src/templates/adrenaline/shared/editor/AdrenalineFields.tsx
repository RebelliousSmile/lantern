import { useUiText, type TranslationKey } from '@/i18n/text'
import {
    LongTextField,
    NumberField,
    RangedNumberField,
    RecordRows,
    StringRows,
    TextField,
} from './FieldPrimitives'

type RecordValue = Record<string, unknown>
const stats: [string, TranslationKey][] = [
    ['for', 'adrenaline:shared.characteristics.for'],
    ['con', 'adrenaline:shared.characteristics.con'],
    ['dex', 'adrenaline:shared.characteristics.dex'],
    ['rap', 'adrenaline:shared.characteristics.rap'],
    ['log', 'adrenaline:shared.characteristics.log'],
    ['vol', 'adrenaline:shared.characteristics.vol'],
    ['per', 'adrenaline:shared.characteristics.per'],
    ['cha', 'adrenaline:shared.characteristics.cha'],
]
const wounds: [string, TranslationKey][] = [
    ['superficiel', 'adrenaline:shared.health.superficielBase'],
    ['leger', 'adrenaline:shared.health.legerBase'],
    ['grave', 'adrenaline:shared.health.graveBase'],
    ['profond', 'adrenaline:shared.health.profondBase'],
]
const healthKindHeadingKeys: Record<'physique' | 'mental', TranslationKey> = {
    physique: 'adrenaline:shared.health.physicalHeading',
    mental: 'adrenaline:shared.health.mentalHeading',
}
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
    const text = useUiText()
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            {stats.map(([key, labelKey]) => (
                <RangedNumberField
                    key={key}
                    label={text(labelKey)}
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
    const text = useUiText()
    const current = record(value)
    const textFields: [string, TranslationKey][] = [
        ['nationalite', 'adrenaline:shared.identity.nationality'],
        ['genre', 'adrenaline:shared.identity.gender'],
        ['cheveux', 'adrenaline:shared.identity.hair'],
        ['yeux', 'adrenaline:shared.identity.eyes'],
        ['taille', 'adrenaline:shared.identity.height'],
        ['peau', 'adrenaline:shared.identity.skin'],
        ['poids', 'adrenaline:shared.identity.weight'],
    ]
    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
                {textFields.map(([key, labelKey]) => (
                    <TextField
                        key={key}
                        label={text(labelKey)}
                        value={String(current[key] ?? '')}
                        onChange={(next) =>
                            onChange({ ...current, [key]: next })
                        }
                    />
                ))}
                <NumberField
                    label={text('adrenaline:shared.identity.age')}
                    value={Number(current.age ?? 0)}
                    onChange={(age) => onChange({ ...current, age })}
                />
            </div>
            <StringRows
                label={text('adrenaline:shared.identity.distinguishingMarks')}
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
    const text = useUiText()
    const current = record(value)
    return (
        <div className="grid gap-3">
            {(['physique', 'mental'] as const).map((kind) => {
                const block = record(current[kind])
                return (
                    <div className="grid gap-2" key={kind}>
                        <h4 className="font-medium capitalize">
                            {text(healthKindHeadingKeys[kind])}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {wounds.map(([level, baseLabelKey]) => {
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
                                            label={text(baseLabelKey)}
                                            value={threshold.base}
                                            onChange={(next) =>
                                                set('base', next)
                                            }
                                        />
                                        <RangedNumberField
                                            label={text(
                                                'adrenaline:shared.health.covered'
                                            )}
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
    const text = useUiText()
    const current = record(value)
    const shield = record(current.bouclier)
    const armour = record(current[mental ? 'caractere' : 'armure'])
    const armourKey = mental ? 'caractere' : 'armure'
    return (
        <div className="grid gap-2 rounded border p-2">
            <h4 className="font-medium">{label}</h4>
            <RangedNumberField
                label={text('adrenaline:shared.protection.toughness')}
                value={current.solidite}
                onChange={(solidite) => onChange({ ...current, solidite })}
            />
            <div className="grid grid-cols-2 gap-2">
                <TextField
                    label={text(
                        mental
                            ? 'adrenaline:shared.protection.characterTrait'
                            : 'adrenaline:shared.protection.armour'
                    )}
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
                    label={text('adrenaline:shared.protection.points')}
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
                label={text('adrenaline:shared.protection.locations')}
                values={strings(armour.localisations)}
                onChange={(localisations) =>
                    onChange({
                        ...current,
                        [armourKey]: { ...armour, localisations },
                    })
                }
            />
            <TextField
                label={text('adrenaline:shared.protection.shield')}
                value={String(shield.nom ?? '')}
                onChange={(nom) =>
                    onChange({ ...current, bouclier: { ...shield, nom } })
                }
            />
            <StringRows
                label={text('adrenaline:shared.protection.shieldProperties')}
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
    const text = useUiText()
    const current = record(value)
    return (
        <div className="grid gap-3">
            <DefenceFields
                label={text('adrenaline:shared.protection.physicalHeading')}
                value={current.physiques}
                onChange={(physiques) => onChange({ ...current, physiques })}
            />
            <DefenceFields
                label={text('adrenaline:shared.protection.mentalHeading')}
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
    const text = useUiText()
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
                            label={text('fields.name')}
                            value={String(entry.nom ?? '')}
                            onChange={(nom) => replace({ ...entry, nom })}
                        />
                        <TextField
                            label={text('adrenaline:shared.skills.specialty')}
                            value={String(entry.specialite ?? '')}
                            onChange={(specialite) =>
                                replace({ ...entry, specialite })
                            }
                        />
                        <RangedNumberField
                            label={text('adrenaline:shared.percentage')}
                            value={entry.pourcentage}
                            onChange={(pourcentage) =>
                                replace({ ...entry, pourcentage })
                            }
                        />
                        <TextField
                            label={text(
                                'adrenaline:shared.skills.characteristic'
                            )}
                            value={String(entry.caracteristique ?? '')}
                            onChange={(caracteristique) =>
                                replace({ ...entry, caracteristique })
                            }
                        />
                        <RangedNumberField
                            label={text('adrenaline:shared.skills.total')}
                            value={entry.total}
                            onChange={(total) => replace({ ...entry, total })}
                        />
                    </div>
                    <StringRows
                        label={text('adrenaline:shared.skills.perks')}
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
    const text = useUiText()
    const current = record(value)
    const weapons = (key: string, labelKey: TranslationKey) => (
        <RecordRows
            label={text(labelKey)}
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
                        label={text('fields.name')}
                        value={String(entry.nom ?? '')}
                        onChange={(nom) => replace({ ...entry, nom })}
                    />
                    <RangedNumberField
                        label={text('adrenaline:shared.percentage')}
                        value={entry.pourcentage}
                        onChange={(pourcentage) =>
                            replace({ ...entry, pourcentage })
                        }
                    />
                    <NumberField
                        label={text('adrenaline:shared.equipment.damageDice')}
                        value={Number(entry.desDeDegats ?? 0)}
                        onChange={(desDeDegats) =>
                            replace({ ...entry, desDeDegats })
                        }
                    />
                    <TextField
                        label={text('adrenaline:shared.type')}
                        value={String(entry.type ?? '')}
                        onChange={(type) => replace({ ...entry, type })}
                    />
                    <LongTextField
                        label={text('fields.notes')}
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
                label={text('adrenaline:shared.equipment.possessions')}
                values={strings(current.possessions)}
                onChange={(possessions) =>
                    onChange({ ...current, possessions })
                }
            />
            <TextField
                label={text('adrenaline:shared.equipment.favouriteGear')}
                value={String(current.equipementFavori ?? '')}
                onChange={(equipementFavori) =>
                    onChange({ ...current, equipementFavori })
                }
            />
            {weapons(
                'armesPhysiques',
                'adrenaline:shared.equipment.physicalWeapons'
            )}
            {weapons(
                'armesMentales',
                'adrenaline:shared.equipment.mentalWeapons'
            )}
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
    const text = useUiText()
    const current = record(value)
    const stringFields: [string, TranslationKey][] = [
        ['personnalite', 'adrenaline:shared.narrative.personality'],
        ['interpretation', 'adrenaline:shared.narrative.roleplayingTips'],
        ['repliques', 'adrenaline:shared.narrative.lines'],
        ['notesMj', 'adrenaline:shared.narrative.gmNotes'],
    ]
    return (
        <div className="grid gap-2">
            <TextField
                label={text('adrenaline:shared.narrative.role')}
                value={String(current.role ?? '')}
                onChange={(role) => onChange({ ...current, role })}
            />
            <TextField
                label={text('adrenaline:shared.narrative.attitude')}
                value={String(current.attitude ?? '')}
                onChange={(attitude) => onChange({ ...current, attitude })}
            />
            <LongTextField
                label={text('adrenaline:shared.narrative.background')}
                value={String(current.historique ?? '')}
                onChange={(historique) => onChange({ ...current, historique })}
            />
            <LongTextField
                label={text('adrenaline:shared.narrative.possibleDevelopment')}
                value={String(current.evolutionPossible ?? '')}
                onChange={(evolutionPossible) =>
                    onChange({ ...current, evolutionPossible })
                }
            />
            {stringFields.map(([key, labelKey]) => (
                <StringRows
                    key={key}
                    label={text(labelKey)}
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
    const text = useUiText()
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            <TextField
                label={text('adrenaline:shared.meta.publicationType')}
                value={String(current.typeDePublication ?? '')}
                onChange={(typeDePublication) =>
                    onChange({ ...current, typeDePublication })
                }
            />
            <TextField
                label={text('adrenaline:shared.meta.source')}
                value={String(current.source ?? '')}
                onChange={(source) => onChange({ ...current, source })}
            />
            <StringRows
                label={text('adrenaline:shared.meta.authors')}
                values={strings(current.auteurs)}
                onChange={(auteurs) => onChange({ ...current, auteurs })}
            />
            <NumberField
                label={text('adrenaline:shared.meta.page')}
                value={Number(current.page ?? 0)}
                onChange={(page) => onChange({ ...current, page })}
            />
            <TextField
                label={text('adrenaline:shared.meta.licence')}
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
    const text = useUiText()
    const current = record(value)
    const textFields: [string, TranslationKey][] = [
        ['joueur', 'adrenaline:pj.form.player'],
        ['typeDeCreation', 'adrenaline:pj.form.creationMethod'],
        ['typeDeScenario', 'adrenaline:pj.form.scenarioType'],
        ['declinaisonDeCampagne', 'adrenaline:pj.form.campaignVariant'],
    ]
    return (
        <div className="grid grid-cols-2 gap-2">
            {textFields.map(([key, labelKey]) => (
                <TextField
                    key={key}
                    label={text(labelKey)}
                    value={String(current[key] ?? '')}
                    onChange={(next) => onChange({ ...current, [key]: next })}
                />
            ))}
            <RangedNumberField
                label={text('adrenaline:pj.form.xp')}
                value={current.px}
                onChange={(px) => onChange({ ...current, px })}
            />
        </div>
    )
}
