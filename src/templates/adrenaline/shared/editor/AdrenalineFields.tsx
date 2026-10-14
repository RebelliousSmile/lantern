import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { publishedLocations } from '../../pj/editor/zone'
import { CHARACTERISTIC_KEYS } from '../formations'
import {
    CheckField,
    LongTextField,
    NumberField,
    OptionSelect,
    RangedNumberField,
    RecordRows,
    StringRows,
    TextField,
    useLimits,
    ValueField,
    type RangedValue,
    type ValueForm,
} from './FieldPrimitives'
import { OptionalNumberField } from './OptionalFields'
import { StatusScope, useDescribedBy } from './draft'
import { enumAt, requiredAt } from './schemaShapes'

type RecordValue = Record<string, unknown>
/* The labels of the characteristics the schemas may declare; the form offers the ones a schema names. */
const statLabels: Record<string, TranslationKey> = {
    for: 'adrenaline:shared.characteristics.for',
    con: 'adrenaline:shared.characteristics.con',
    dex: 'adrenaline:shared.characteristics.dex',
    rap: 'adrenaline:shared.characteristics.rap',
    log: 'adrenaline:shared.characteristics.log',
    vol: 'adrenaline:shared.characteristics.vol',
    per: 'adrenaline:shared.characteristics.per',
    cha: 'adrenaline:shared.characteristics.cha',
}
/* The weapon lists the schemas may declare, by field name. */
const weaponLabels: Record<string, TranslationKey> = {
    armesPhysiques: 'adrenaline:shared.equipment.physicalWeapons',
    armesMentales: 'adrenaline:shared.equipment.mentalWeapons',
    armesPsychologiques: 'adrenaline:shared.equipment.psychologicalWeapons',
}
const wounds: [string, TranslationKey][] = [
    ['superficiel', 'adrenaline:shared.health.superficiel'],
    ['leger', 'adrenaline:shared.health.leger'],
    ['grave', 'adrenaline:shared.health.grave'],
    ['profond', 'adrenaline:shared.health.profond'],
]
const healthKindHeadingKeys: Record<'physique' | 'mental', TranslationKey> = {
    physique: 'adrenaline:shared.health.physicalHeading',
    mental: 'adrenaline:shared.health.mentalHeading',
}
/** The number the document holds there, none when it holds none: an unset field is blank, not 0. */
const numberOrUndefined = (value: unknown): number | undefined =>
    typeof value === 'number' ? value : undefined

/** What a value of a published enumeration is worded as; the raw value when no label is known. */
const PARAMETER_LABELS: Record<string, TranslationKey> = {
    equitable: 'adrenaline:pj.sheet.values.equitable',
    aleatoire: 'adrenaline:pj.sheet.values.aleatoire',
    'one-shot': 'adrenaline:pj.sheet.values.one-shot',
    campagne: 'adrenaline:pj.sheet.values.campagne',
    'bac-a-sable': 'adrenaline:pj.sheet.values.bac-a-sable',
    storyline: 'adrenaline:pj.sheet.values.storyline',
}
const PUBLICATION_LABELS: Record<string, TranslationKey> = {
    officiel: 'adrenaline:shared.meta.publicationTypes.officiel',
    tiers: 'adrenaline:shared.meta.publicationTypes.tiers',
    communautaire: 'adrenaline:shared.meta.publicationTypes.communautaire',
    maison: 'adrenaline:shared.meta.publicationTypes.maison',
}

/** `source` with `key` set to `value`, or without `key` when `value` is none. */
const withKey = (
    source: RecordValue,
    key: string,
    value: unknown
): RecordValue => {
    const next = { ...source }
    if (value === undefined || value === '') delete next[key]
    else next[key] = value
    return next
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

/** `keys` are the characteristics the document's schema declares (see `schemaFields.ts`). */
export function CharacteristicsFields({
    keys,
    form,
    value,
    onChange,
}: {
    keys: readonly string[]
    /** The player sheet writes triplets; a creature or a PNJ writes plain numbers. */
    form: ValueForm
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const text = useUiText()
    const limits = useLimits()
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            {keys.map((key) => (
                <ValueField
                    form={form}
                    key={key}
                    limit={limits(`/caracteristiques/${key}`)}
                    label={
                        statLabels[key]
                            ? text(statLabels[key])
                            : key.toUpperCase()
                    }
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
    const limits = useLimits()
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
                        inline
                        label={text(labelKey)}
                        value={String(current[key] ?? '')}
                        onChange={(next) =>
                            onChange({ ...current, [key]: next })
                        }
                    />
                ))}
                <NumberField
                    inline
                    label={text('adrenaline:shared.identity.age')}
                    limit={limits('/identite/age')}
                    value={numberOrUndefined(current.age)}
                    onChange={(age) => onChange({ ...current, age })}
                    onClear={() => onChange(without(current, 'age'))}
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

type HealthKind = 'physique' | 'mental'
type HealthSide = Record<string, unknown>

const HEALTH_KINDS: readonly HealthKind[] = ['physique', 'mental']

/** A side of the health is whole once each of its four levels gives its base. */
const sideIsWhole = (side: HealthSide): boolean =>
    wounds.every(([level]) => record(side[level]).base !== undefined)

/** A threshold figure: a triplet where the sheet keeps one, else a number that may stay blank. */
function HealthValue({
    form,
    label,
    value,
    onChange,
    at,
}: {
    form: ValueForm
    label: string
    value: unknown
    onChange: (value: number | RangedValue | undefined) => void
    /** The pointer of the figure in the published document, for its bounds. */
    at: string
}) {
    const limits = useLimits()
    if (form === 'triplet')
        return (
            <ValueField
                form={form}
                label={label}
                value={value}
                onChange={onChange}
                limit={limits(at)}
            />
        )
    return (
        <OptionalNumberField
            at={at}
            label={label}
            value={typeof value === 'number' ? value : undefined}
            onChange={onChange}
        />
    )
}

/**
 * The health of a sheet, written as typed: a side that is not whole (its four levels with their
 * base) stays in the document, on the sheet, and the status of the side says what it lacks; the
 * export leaves it out (`compactAgainst`). Nothing is written that was not typed.
 */
export function HealthFields({
    form,
    schema,
    value,
    onChange,
}: {
    form: ValueForm
    schema: 'pnj' | 'monstre'
    value: unknown
    onChange: (value: RecordValue | undefined) => void
}) {
    const text = useUiText()
    const current = record(value)
    const required = requiredAt(schema, '/sante')
    const sideOf = (kind: HealthKind): HealthSide => record(current[kind])
    const change = (
        kind: HealthKind,
        level: string,
        key: string,
        next: unknown
    ) => {
        const threshold: Record<string, unknown> = {
            ...record(sideOf(kind)[level]),
        }
        if (next === undefined || next === '') delete threshold[key]
        else threshold[key] = next
        const side: Record<string, unknown> = { ...sideOf(kind) }
        if (Object.keys(threshold).length === 0) delete side[level]
        else side[level] = threshold
        const whole: Record<string, unknown> = { ...current }
        if (Object.keys(side).length === 0) delete whole[kind]
        else whole[kind] = side
        onChange(Object.keys(whole).length === 0 ? undefined : whole)
    }
    const allRequiredWhole = required.every((each) =>
        sideIsWhole(sideOf(each as HealthKind))
    )
    const messageOf = (kind: HealthKind): string | undefined => {
        const side = sideOf(kind)
        if (Object.keys(side).length === 0 && !required.includes(kind))
            return undefined
        if (!sideIsWhole(side))
            return Object.keys(side).length === 0
                ? undefined
                : text('adrenaline:shared.health.sideIncomplete')
        return allRequiredWhole
            ? undefined
            : text('adrenaline:shared.health.sideWaiting')
    }
    return (
        <div className="grid gap-3">
            {HEALTH_KINDS.map((kind) => {
                const block = sideOf(kind)
                return (
                    <StatusScope message={messageOf(kind)} key={kind}>
                        <h4 className="font-medium capitalize">
                            {text(healthKindHeadingKeys[kind])}
                        </h4>
                        <div className="grid gap-2">
                            {wounds.map(([level, levelLabelKey]) => {
                                const threshold = record(block[level])
                                const set = (key: string, next: unknown) =>
                                    change(kind, level, key, next)
                                return (
                                    <fieldset
                                        className="grid grid-cols-2 gap-1 rounded border p-1 text-sm"
                                        key={level}
                                    >
                                        <legend className="px-1 font-medium">
                                            {text(levelLabelKey)}
                                        </legend>
                                        <HealthValue
                                            form={form}
                                            label={text(
                                                'adrenaline:shared.health.base'
                                            )}
                                            at={`/sante/${kind}/${level}/base`}
                                            value={threshold.base}
                                            onChange={(next) =>
                                                set('base', next)
                                            }
                                        />
                                        <HealthValue
                                            form={form}
                                            label={text(
                                                kind === 'mental'
                                                    ? 'adrenaline:shared.health.plusTrait'
                                                    : 'adrenaline:shared.health.plusArmour'
                                            )}
                                            at={`/sante/${kind}/${level}/couvert`}
                                            value={threshold.couvert}
                                            onChange={(next) =>
                                                set('couvert', next)
                                            }
                                        />
                                    </fieldset>
                                )
                            })}
                        </div>
                    </StatusScope>
                )
            })}
        </div>
    )
}

function DefenceFields({
    form,
    label,
    value,
    onChange,
    mental,
}: {
    form: ValueForm
    label: string
    value: unknown
    onChange: (value: RecordValue) => void
    mental?: boolean
}) {
    const text = useUiText()
    const limits = useLimits()
    const current = record(value)
    const shield = record(current.bouclier)
    const armour = record(current[mental ? 'caractere' : 'armure'])
    const armourKey = mental ? 'caractere' : 'armure'
    /* The locations are the ones the schema lists, named as the presentation names them. */
    const published = publishedLocations(mental ? 'mental' : 'physical')
    const locations = enumAt(
        'pnj',
        `/protections/${mental ? 'mentales' : 'physiques'}/${armourKey}/localisations`
    ).map((id) => ({
        id,
        label: published.find((entry) => entry.id === id)?.label ?? id,
    }))
    return (
        <div className="grid gap-2 rounded border p-2">
            <h4 className="font-medium">{label}</h4>
            <ValueField
                form={form}
                label={text('adrenaline:shared.protection.toughness')}
                limit={limits(
                    `/protections/${mental ? 'mentales' : 'physiques'}/solidite`
                )}
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
                <ValueField
                    form={form}
                    label={text('adrenaline:shared.protection.points')}
                    limit={limits(
                        `/protections/${mental ? 'mentales' : 'physiques'}/${armourKey}/points`
                    )}
                    value={armour.points}
                    onChange={(points) =>
                        onChange({
                            ...current,
                            [armourKey]: { ...armour, points },
                        })
                    }
                />
            </div>
            <fieldset className="grid gap-1 text-sm">
                <legend className="px-1">
                    {text('adrenaline:shared.protection.locations')}
                </legend>
                <div className="grid grid-cols-3 gap-x-1 gap-y-0.5">
                    {locations.map((location) => {
                        const values = strings(armour.localisations)
                        return (
                            <CheckField
                                key={location.id}
                                label={location.label}
                                checked={values.indexOf(location.id) >= 0}
                                onChange={(checked) => {
                                    const next = checked
                                        ? [...values, location.id]
                                        : values.filter(
                                              (id) => id !== location.id
                                          )
                                    /* The contract wants at least one location: none ticked leaves the key. */
                                    const rest = { ...armour }
                                    if (next.length === 0)
                                        delete rest.localisations
                                    else rest.localisations = next
                                    onChange({
                                        ...current,
                                        [armourKey]: rest,
                                    })
                                }}
                            />
                        )
                    })}
                </div>
            </fieldset>
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
    form,
    value,
    onChange,
}: {
    form: ValueForm
    value: unknown
    onChange: (value: RecordValue) => void
}) {
    const text = useUiText()
    const current = record(value)
    return (
        <div className="grid gap-3">
            <DefenceFields
                form={form}
                label={text('adrenaline:shared.protection.physicalHeading')}
                value={current.physiques}
                onChange={(physiques) => onChange({ ...current, physiques })}
            />
            <DefenceFields
                form={form}
                label={text('adrenaline:shared.protection.mentalHeading')}
                mental
                value={current.mentales}
                onChange={(mentales) => onChange({ ...current, mentales })}
            />
        </div>
    )
}

const NO_CHARACTERISTIC = 'none'

/** A skill's characteristic, picked among the published keys; none leaves it to the roll. */
function CharacteristicSelect({
    value,
    onChange,
}: {
    value: unknown
    onChange: (value: string | undefined) => void
}) {
    const text = useUiText()
    const describedBy = useDescribedBy()
    const current =
        typeof value === 'string' && CHARACTERISTIC_KEYS.includes(value)
            ? value
            : NO_CHARACTERISTIC
    return (
        <label className="grid gap-1 text-sm">
            <span>{text('adrenaline:shared.skills.characteristic')}</span>
            <Select
                value={current}
                onValueChange={(next) =>
                    onChange(next === NO_CHARACTERISTIC ? undefined : next)
                }
            >
                <SelectTrigger
                    className="w-full"
                    aria-describedby={describedBy}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={NO_CHARACTERISTIC}>
                        {text('adrenaline:shared.skills.noCharacteristic')}
                    </SelectItem>
                    {CHARACTERISTIC_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>
                            {key.toUpperCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </label>
    )
}

/** Drops a key instead of writing it empty: an empty enum value is not a valid document. */
function without(entry: RecordValue, key: string): RecordValue {
    const rest = { ...entry }
    delete rest[key]
    return rest
}

export function SkillRows({
    label,
    form,
    value,
    onChange,
    playerSheet = false,
    fold,
    at,
}: {
    label: string
    form: ValueForm
    value: unknown
    onChange: (value: RecordValue[]) => void
    /** Where the published schema describes one skill of this list (`/competences[]`). */
    at?: string
    /** A PJ sheet keeps one percentage per skill, and the rarer fields of a skill in sub-panels. */
    playerSheet?: boolean
    /** Skills fold to a line each, `open` being the one shown unfolded. */
    fold?: { open?: number; only?: boolean }
}) {
    const text = useUiText()
    const limits = useLimits()
    const current = rows(value)
    const skillAt =
        at ?? (playerSheet ? '/formations[]/competences[]' : '/competences[]')
    return (
        <RecordRows
            label={label}
            at={skillAt}
            values={current}
            fold={
                fold && {
                    open: fold.open,
                    only: fold.only,
                    summary: (entry) => {
                        const speciality = entry.specialite
                            ? ` (${String(entry.specialite)})`
                            : ''
                        const plain = entry.pourcentage
                        const percentage =
                            typeof plain === 'number'
                                ? plain
                                : record(plain).current
                        return `${String(entry.nom ?? '')}${speciality}${
                            typeof percentage === 'number'
                                ? ` — ${percentage} %`
                                : ''
                        }`
                    },
                }
            }
            /* A new skill holds nothing: no percentage is written before one is typed. */
            create={() => ({}) as RecordValue}
            onChange={onChange}
        >
            {(entry, _, replace) => {
                if (playerSheet)
                    return (
                        <SkillTabs
                            entry={entry}
                            replace={replace}
                            at={skillAt}
                        />
                    )
                /* The speciality shows once asked for or filled, so most skills keep one name line. */
                const hasSpecialty = typeof entry.specialite === 'string'
                return (
                    <div className="grid gap-2">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
                            <TextField
                                label={text('fields.name')}
                                value={String(entry.nom ?? '')}
                                onChange={(nom) => replace({ ...entry, nom })}
                            />
                            {!hasSpecialty && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        replace({ ...entry, specialite: '' })
                                    }
                                >
                                    +{' '}
                                    {text('adrenaline:shared.skills.specialty')}
                                </Button>
                            )}
                        </div>
                        {hasSpecialty && (
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
                                <TextField
                                    label={text(
                                        'adrenaline:shared.skills.specialty'
                                    )}
                                    value={String(entry.specialite ?? '')}
                                    onChange={(specialite) =>
                                        replace({ ...entry, specialite })
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    aria-label={text(
                                        'adrenaline:shared.skills.removeSpecialty'
                                    )}
                                    title={text(
                                        'adrenaline:shared.skills.removeSpecialty'
                                    )}
                                    onClick={() =>
                                        replace(without(entry, 'specialite'))
                                    }
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <CharacteristicSelect
                                value={entry.caracteristique}
                                onChange={(caracteristique) =>
                                    replace(
                                        caracteristique === undefined
                                            ? without(entry, 'caracteristique')
                                            : { ...entry, caracteristique }
                                    )
                                }
                            />
                            <ValueField
                                form={form}
                                label={text('adrenaline:shared.percentage')}
                                limit={limits(`${skillAt}/pourcentage`)}
                                value={entry.pourcentage}
                                onChange={(pourcentage) =>
                                    replace({ ...entry, pourcentage })
                                }
                            />
                            <ValueField
                                form={form}
                                label={text('adrenaline:shared.skills.total')}
                                limit={limits(`${skillAt}/total`)}
                                value={entry.total}
                                onChange={(total) =>
                                    replace({ ...entry, total })
                                }
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
                )
            }}
        </RecordRows>
    )
}

/**
 * A player sheet skill, one sub-panel at a time: the panel keeps the height of the tallest, not of
 * all. The first holds what the sheet prints on the line, the others the rarer fields.
 */
function SkillTabs({
    entry,
    replace,
    at,
}: {
    entry: RecordValue
    replace: (entry: RecordValue) => void
    /** Where the schema describes this skill. */
    at: string
}) {
    const text = useUiText()
    const limits = useLimits()
    return (
        <div className="grid gap-2">
            <div className="grid gap-2">
                {/* The name and its specialty on one line; an emptied specialty leaves the document. */}
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
                            replace(
                                specialite === ''
                                    ? without(entry, 'specialite')
                                    : { ...entry, specialite }
                            )
                        }
                    />
                </div>
                {/* The game master picks the characteristic at the table: none is typed here. */}
                <ValueField
                    form="number"
                    label={text('adrenaline:shared.percentage')}
                    limit={limits(`${at}/pourcentage`)}
                    value={entry.pourcentage}
                    onChange={(pourcentage) =>
                        replace({ ...entry, pourcentage })
                    }
                />
            </div>
        </div>
    )
}

/**
 * The weapon a new line starts as: its name, empty. Nothing else is written until it is typed (the
 * schema requires only the name).
 */
export const blankWeapon = (): RecordValue => ({ nom: '' })

/** `weapons` are the weapon lists the document's schema declares (see `schemaFields.ts`). */
export function EquipmentFields({
    weapons: weaponKeys,
    form,
    value,
    onChange,
    natures,
    perks = false,
    socialWeapons,
    shows = () => true,
    fold,
}: {
    weapons: readonly string[]
    form: ValueForm
    value: unknown
    onChange: (value: RecordValue) => void
    /** The damage natures the sheet publishes: when given, a weapon can say which it is. */
    natures?: readonly { value: string; label: string }[]
    /** The sheet carries a list of advantages and immunities. */
    perks?: boolean
    /** The social weapons of the sheet: each can be struck out when the character does not use it. */
    socialWeapons?: readonly string[]
    /** Which of the equipment fields a panel carries; a zone of the sheet opens only its own. */
    shows?: (key: string) => boolean
    /** Weapons fold to a line each, `open` being the one shown unfolded. */
    fold?: { open?: number }
}) {
    const text = useUiText()
    const limits = useLimits()
    const current = record(value)
    const weapons = (key: string) => (
        <RecordRows
            key={key}
            at={`/equipement/${key}[]`}
            label={weaponLabels[key] ? text(weaponLabels[key]) : key}
            values={rows(current[key])}
            create={() => blankWeapon()}
            fold={
                fold && {
                    open: fold.open,
                    summary: (entry) => String(entry.nom ?? ''),
                }
            }
            onChange={(next) => onChange({ ...current, [key]: next })}
        >
            {(entry, _, replace) => (
                <div className="grid grid-cols-2 gap-2">
                    <TextField
                        label={text('fields.name')}
                        value={String(entry.nom ?? '')}
                        onChange={(nom) => replace({ ...entry, nom })}
                    />
                    <ValueField
                        form={form}
                        label={text('adrenaline:shared.percentage')}
                        limit={limits(`/equipement/${key}[]/pourcentage`)}
                        value={entry.pourcentage}
                        onChange={(pourcentage) =>
                            replace({ ...entry, pourcentage })
                        }
                    />
                    <NumberField
                        limit={limits(`/equipement/${key}[]/desDeDegats`)}
                        label={text('adrenaline:shared.equipment.damageDice')}
                        value={numberOrUndefined(entry.desDeDegats)}
                        onChange={(desDeDegats) =>
                            replace({ ...entry, desDeDegats })
                        }
                    />
                    {/* A sheet that publishes the natures prints no contact/distance type. */}
                    {!(natures && natures.length > 0) && (
                        <TextField
                            label={text('adrenaline:shared.type')}
                            value={String(entry.type ?? '')}
                            onChange={(type) => replace({ ...entry, type })}
                        />
                    )}
                    {natures && natures.length > 0 && (
                        <OptionSelect
                            label={text(
                                'adrenaline:shared.equipment.damageNature'
                            )}
                            noneLabel={text(
                                'adrenaline:shared.equipment.noNature'
                            )}
                            value={entry.nature}
                            options={natures}
                            onChange={(nature) => {
                                const next = { ...entry }
                                if (nature === undefined) delete next.nature
                                else next.nature = nature
                                replace(next)
                            }}
                        />
                    )}
                    {!(natures && natures.length > 0) && (
                        <LongTextField
                            label={text('fields.notes')}
                            value={String(entry.notes ?? '')}
                            onChange={(notes) => replace({ ...entry, notes })}
                        />
                    )}
                </div>
            )}
        </RecordRows>
    )
    return (
        <div className="grid gap-3">
            {shows('possessions') && (
                <StringRows
                    label={text('adrenaline:shared.equipment.possessions')}
                    values={strings(current.possessions)}
                    onChange={(possessions) =>
                        onChange({ ...current, possessions })
                    }
                />
            )}
            {shows('equipementFavori') && (
                <TextField
                    label={text('adrenaline:shared.equipment.favouriteGear')}
                    value={String(current.equipementFavori ?? '')}
                    onChange={(equipementFavori) =>
                        onChange({ ...current, equipementFavori })
                    }
                />
            )}
            {weaponKeys.filter(shows).map(weapons)}
            {socialWeapons &&
                socialWeapons.length > 0 &&
                shows('armesSocialesBarrees') && (
                    <fieldset className="grid gap-1 text-sm">
                        <legend className="px-1">
                            {text('adrenaline:shared.equipment.socialWeapons')}
                        </legend>
                        <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                            {socialWeapons.map((name) => {
                                const struck = strings(
                                    current.armesSocialesBarrees
                                )
                                return (
                                    <CheckField
                                        key={name}
                                        label={name}
                                        checked={struck.indexOf(name) < 0}
                                        onChange={(used) => {
                                            /* The list keeps the order of the sheet; an empty one leaves the key. */
                                            const next = socialWeapons.filter(
                                                (other) =>
                                                    other === name
                                                        ? !used
                                                        : struck.indexOf(
                                                              other
                                                          ) >= 0
                                            )
                                            const rest = { ...current }
                                            if (next.length === 0)
                                                delete rest.armesSocialesBarrees
                                            else
                                                rest.armesSocialesBarrees = next
                                            onChange(rest)
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </fieldset>
                )}
            {perks && shows('avantagesEtImmunites') && (
                <StringRows
                    label={text(
                        'adrenaline:shared.equipment.perksAndImmunities'
                    )}
                    values={strings(current.avantagesEtImmunites)}
                    onChange={(avantagesEtImmunites) =>
                        onChange({ ...current, avantagesEtImmunites })
                    }
                />
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
    const limits = useLimits()
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            <OptionSelect
                label={text('adrenaline:shared.meta.publicationType')}
                noneLabel={text('adrenaline:shared.meta.noPublicationType')}
                value={current.typeDePublication}
                options={enumAt('pj', '/meta/typeDePublication').map(
                    (value) => ({
                        value,
                        label: PUBLICATION_LABELS[value]
                            ? text(PUBLICATION_LABELS[value])
                            : value,
                    })
                )}
                onChange={(typeDePublication) =>
                    onChange(
                        withKey(current, 'typeDePublication', typeDePublication)
                    )
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
                limit={limits('/meta/page')}
                label={text('adrenaline:shared.meta.page')}
                value={numberOrUndefined(current.page)}
                onChange={(page) => onChange({ ...current, page })}
                onClear={() => onChange(without(current, 'page'))}
            />
            <TextField
                label={text('adrenaline:shared.meta.licence')}
                value={String(current.licence ?? '')}
                onChange={(licence) => onChange({ ...current, licence })}
            />
        </div>
    )
}

/** The game parameters of the player sheet: the text ones, and the enumerations the schema lists. */
export const PARAMETER_FIELDS: readonly {
    key: string
    label: TranslationKey
    choice: boolean
}[] = [
    { key: 'joueur', label: 'adrenaline:pj.form.player', choice: false },
    {
        key: 'typeDeCreation',
        label: 'adrenaline:pj.form.creationMethod',
        choice: true,
    },
    {
        key: 'typeDeScenario',
        label: 'adrenaline:pj.form.scenarioType',
        choice: true,
    },
    { key: 'scenario', label: 'adrenaline:pj.form.scenario', choice: false },
    {
        key: 'declinaisonDeCampagne',
        label: 'adrenaline:pj.form.campaignVariant',
        choice: true,
    },
]

export function ParametersFields({
    value,
    onChange,
    shows = () => true,
}: {
    value: unknown
    onChange: (value: RecordValue) => void
    /** Which of the game parameters a panel carries; a zone of the sheet opens only its own. */
    shows?: (key: string) => boolean
}) {
    const text = useUiText()
    const limits = useLimits()
    const current = record(value)
    return (
        <div className="grid grid-cols-2 gap-2">
            {PARAMETER_FIELDS.filter(({ key }) => shows(key)).map(
                ({ key, label, choice }) =>
                    choice ? (
                        <OptionSelect
                            key={key}
                            label={text(label)}
                            noneLabel={text('adrenaline:pj.form.noChoice')}
                            value={current[key]}
                            options={enumAt(
                                'pj',
                                `/parametresDuJeu/${key}`
                            ).map((option) => ({
                                value: option,
                                label: PARAMETER_LABELS[option]
                                    ? text(PARAMETER_LABELS[option])
                                    : option,
                            }))}
                            onChange={(next) =>
                                onChange(withKey(current, key, next))
                            }
                        />
                    ) : (
                        <TextField
                            key={key}
                            label={text(label)}
                            value={String(current[key] ?? '')}
                            onChange={(next) =>
                                onChange(withKey(current, key, next))
                            }
                        />
                    )
            )}
            {shows('px') && (
                <RangedNumberField
                    limit={limits('/parametresDuJeu/px')}
                    label={text('adrenaline:pj.form.xp')}
                    value={current.px}
                    onChange={(px) => onChange({ ...current, px })}
                />
            )}
        </div>
    )
}
