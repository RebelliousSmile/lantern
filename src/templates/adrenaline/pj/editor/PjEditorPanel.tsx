import { Button } from '@/components/ui/button'
import { useUiText } from '@/i18n/text'
import { useState, type ReactNode } from 'react'
import {
    blankWeapon,
    CharacteristicsFields,
    EquipmentFields,
    IdentityFields,
    MetaFields,
    PARAMETER_FIELDS,
    ParametersFields,
    SkillRows,
} from '../../shared/editor/AdrenalineFields'
import { filled, put, record, withoutHollow } from '../../shared/editor/clean'
import {
    SchemaProvider,
    StatusScope,
    useMissingCaptions,
} from '../../shared/editor/draft'
import {
    LimitsProvider,
    LongTextField,
    RequiredTextField,
    TextField,
    ValueField,
} from '../../shared/editor/FieldPrimitives'
import { pjLimit } from '../../shared/editor/pjLimits'
import {
    FORMATION_TYPES,
    formationColumns,
    formationTypeLabel,
    withFormation,
} from '../../shared/formations'
import { useAdrenalineDocument } from '../../shared/hooks'
import { hasContent } from '../../shared/presentation'
import { CHARACTERISTIC_FIELDS, WEAPON_FIELDS } from '../../shared/schemaFields'
import type { PjSection } from '../../shared/sections'
import { blankPj } from '../sample'
import { PjDefence } from './CompactDefence'
import { PjThresholds } from './CompactFields'
import { StateFields } from './StateFields'
import {
    identityZones,
    publishedLocations,
    publishedNatures,
    publishedSocialWeapons,
    publishedThresholds,
    zoneCarries,
} from './zone'

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

/** A formation column nobody has filled: it holds nothing, so nothing is written for it. */
const blankFormation = (): Entry => ({})

/**
 * The name and percentage of a formation, and the skills under it. While one of the two is missing
 * the formation is a draft, and the export leaves it out with its skills: the status says so, and
 * the fields of the name and of every skill point at it.
 */
function FormationHead({
    type,
    formation,
    children,
}: {
    type: string
    formation: Entry
    children: ReactNode
}) {
    const text = useUiText()
    /* A column nobody has filled is not a draft but not there: it says nothing of what it lacks. */
    const held = Object.values(formation).some((value) =>
        typeof value === 'string'
            ? value.trim() !== ''
            : Array.isArray(value)
              ? value.length > 0
              : value !== undefined && value !== null
    )
    const captions = useMissingCaptions('/formations[]', { ...formation, type })
    const missing = held ? captions : []
    const holdsSkills = records(formation.competences).length > 0
    return (
        <StatusScope
            message={
                missing.length === 0
                    ? undefined
                    : text(
                          holdsSkills
                              ? 'adrenaline:shared.draft.formationSkills'
                              : 'adrenaline:shared.draft.incomplete',
                          { missing: missing.join(', ') }
                      )
            }
        >
            {children}
        </StatusScope>
    )
}

/** The part of a block the click hit: one formation column, one skill line, one weapon line. */
const zoneOf = (keys: readonly string[] | undefined, kind: string) => {
    const found = (keys ?? []).find((key) => key.startsWith(`${kind}:`))
    return found?.slice(kind.length + 1)
}

/** The weapon line a click on the sheet hit, when the equipment panel is open on it. */
const weaponIndex = (keys: readonly string[] | undefined) => {
    const zone = zoneOf(keys, 'weapon')
    return zone === undefined ? undefined : Number(zone)
}

const weaponCount = (document: Entry) =>
    records(record(document.equipement)[WEAPON_FIELDS.pj[0]]).length

/** A weapon line nobody has typed in: it is not a weapon of the document. */
const isBlankWeapon = (entry: Entry) =>
    JSON.stringify(entry) === JSON.stringify(blankWeapon())

/**
 * The identity folds away and is not drawn while empty, so the panel is its way in. That depends on
 * the identity being empty, never on whether a zone is open: a click on any zone must leave it
 * reachable.
 */
export const showsIdentityEntry = (
    document: Entry,
    target: PjSection | null | undefined
) => target !== 'identity' && !hasContent(document.identite)

export function PjEditorPanel() {
    const text = useUiText()
    const { document, update, sheet, openSection } = useAdrenalineDocument<
        Record<string, unknown>,
        PjSection
    >('adrenaline.pj', blankPj() as unknown as Record<string, unknown>)
    const set = (key: string, value: unknown) =>
        update((next) => {
            if (value === undefined) delete next[key]
            else next[key] = value
        })
    /*
     * One click opens one zone of the identity, as on a sheet that has one: the first zone is the
     * identity proper, the others are named as the sheet names them. Opening writes nothing.
     */
    const identityEntry = showsIdentityEntry(document, sheet.target) && (
        <div className="flex flex-wrap gap-2">
            {identityZones().map(({ id, label }, at) => (
                <Button
                    key={id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openSection('identity', undefined, [id])}
                >
                    {at === 0 ? text('adrenaline:pj.form.addIdentity') : label}
                </Button>
            ))}
        </div>
    )
    if (!sheet.open || !sheet.target) {
        return (
            <div className="grid gap-3 rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                <p>{text('adrenaline:sections.emptyState')}</p>
                {identityEntry}
            </div>
        )
    }
    return (
        <div className="grid gap-2">
            <PjPanels
                document={document}
                set={set}
                target={sheet.target}
                keys={sheet.keys}
            />
            {identityEntry}
        </div>
    )
}

/** The fields of the open section, narrowed to the zone of the sheet the click hit. */
export function PjPanels({
    document,
    set: write,
    target,
    keys,
}: {
    document: Record<string, unknown>
    set: (key: string, value: unknown) => void
    target: PjSection
    keys?: readonly string[]
}) {
    const text = useUiText()
    /* A field is a value or it is not there: nothing hollow is held by the document. */
    const set = (key: string, value: unknown) =>
        write(key, withoutHollow(value))
    const [formationTab, setFormationTab] = useState<string>(FORMATION_TYPES[0])
    const [skillType, skillIndex] = (zoneOf(keys, 'skill') ?? '').split(':')
    const formationType = zoneOf(keys, 'formation') ?? (skillType || undefined)
    const skillOpen =
        skillIndex === undefined || skillIndex === ''
            ? undefined
            : Number(skillIndex)
    const weaponZone = weaponIndex(keys)
    /*
     * An empty weapon line of the sheet opens the panel on a line ready to be typed in. That line is
     * a draft: it joins the document with the first thing typed in it, a click writes nothing.
     */
    const weaponKey = WEAPON_FIELDS.pj[0]
    const equipment = record(document.equipement)
    const weaponsWritten = records(equipment[weaponKey]).length
    const draft =
        target === 'equipment' &&
        weaponZone !== undefined &&
        weaponZone >= weaponsWritten
    const setEquipment = (next: Entry) => {
        const list = records(next[weaponKey])
        const kept =
            draft &&
            list.length > weaponsWritten &&
            isBlankWeapon(list[weaponsWritten])
                ? list.filter((_, at) => at !== weaponsWritten)
                : list
        const out = { ...next }
        if (kept.length === 0 && equipment[weaponKey] === undefined)
            delete out[weaponKey]
        else out[weaponKey] = kept
        set('equipement', out)
    }
    /* A click on the sheet opens the fields of the block it hit; the section list opens them all. */
    const carries = zoneCarries(keys)
    const identity = record(document.identite)
    const constraints = record(identity.contraintes)
    const setIdentity = (next: Entry) => set('identite', next)
    const setConstraint = (key: string, value: string) => {
        const next = put(constraints, key, filled(value))
        setIdentity(
            put(
                identity,
                'contraintes',
                Object.keys(next).length > 0 ? next : undefined
            )
        )
    }
    const healthKinds = (['physique', 'mental'] as const).filter((kind) =>
        carries(`/sante/${kind}`)
    )
    const protectionSides = (['physiques', 'mentales'] as const).filter(
        (side) => carries(`/protections/${side}`)
    )
    return (
        <SchemaProvider value="pj">
            <LimitsProvider value={pjLimit}>
                <div className="space-y-6 p-1">
                    {target === 'parameters' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text('adrenaline:pj.form.characterHeading')}
                            </h3>
                            {carries('/nom') && (
                                <RequiredTextField
                                    label={text('fields.name')}
                                    value={String(document.nom ?? '')}
                                    onChange={(nom) => set('nom', nom)}
                                />
                            )}
                            {[
                                ...PARAMETER_FIELDS.map(({ key }) => key),
                                'px',
                            ].some((key) =>
                                carries(`/parametresDuJeu/${key}`)
                            ) && (
                                <ParametersFields
                                    shows={(key) =>
                                        carries(`/parametresDuJeu/${key}`)
                                    }
                                    value={document.parametresDuJeu}
                                    onChange={(parametresDuJeu) =>
                                        set('parametresDuJeu', parametresDuJeu)
                                    }
                                />
                            )}
                        </section>
                    )}
                    {target === 'identity' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text('adrenaline:shared.headings.identity')}
                            </h3>
                            {carries('/identite') && (
                                <IdentityFields
                                    value={document.identite}
                                    onChange={(next) => set('identite', next)}
                                />
                            )}
                            {carries('/identite/contraintes') && (
                                <div className="grid gap-2">
                                    <TextField
                                        label={text(
                                            'adrenaline:pj.form.professionalConstraints'
                                        )}
                                        value={String(
                                            constraints.professionnelles ?? ''
                                        )}
                                        onChange={(value) =>
                                            setConstraint(
                                                'professionnelles',
                                                value
                                            )
                                        }
                                    />
                                    <TextField
                                        label={text(
                                            'adrenaline:pj.form.familyConstraints'
                                        )}
                                        value={String(
                                            constraints.familiales ?? ''
                                        )}
                                        onChange={(value) =>
                                            setConstraint('familiales', value)
                                        }
                                    />
                                    <TextField
                                        label={text(
                                            'adrenaline:pj.form.externalCommitments'
                                        )}
                                        value={String(
                                            constraints.engagementsExterieurs ??
                                                ''
                                        )}
                                        onChange={(value) =>
                                            setConstraint(
                                                'engagementsExterieurs',
                                                value
                                            )
                                        }
                                    />
                                </div>
                            )}
                            {carries('/identite/historique') && (
                                <LongTextField
                                    label={text(
                                        'adrenaline:shared.narrative.background'
                                    )}
                                    value={String(identity.historique ?? '')}
                                    onChange={(value) =>
                                        setIdentity(
                                            put(
                                                identity,
                                                'historique',
                                                filled(value)
                                            )
                                        )
                                    }
                                />
                            )}
                            {carries('/identite/personnalite') && (
                                <LongTextField
                                    label={text(
                                        'adrenaline:shared.narrative.personality'
                                    )}
                                    value={String(identity.personnalite ?? '')}
                                    onChange={(value) =>
                                        setIdentity(
                                            put(
                                                identity,
                                                'personnalite',
                                                filled(value)
                                            )
                                        )
                                    }
                                />
                            )}
                        </section>
                    )}
                    {target === 'characteristics' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text(
                                    'adrenaline:shared.headings.characteristics'
                                )}
                            </h3>
                            <CharacteristicsFields
                                form="number"
                                keys={CHARACTERISTIC_FIELDS.pj.filter((key) =>
                                    carries(`/caracteristiques/${key}`)
                                )}
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
                            {healthKinds.map((kind) => (
                                <PjThresholds
                                    key={kind}
                                    kind={kind}
                                    levels={publishedThresholds(kind)}
                                    value={document.sante}
                                    onChange={(sante) => set('sante', sante)}
                                />
                            ))}
                            <StateFields
                                carries={carries}
                                value={document.etatDePartie}
                                onChange={(etatDePartie) =>
                                    set('etatDePartie', etatDePartie)
                                }
                            />
                        </section>
                    )}
                    {target === 'protections' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text('adrenaline:shared.headings.protections')}
                            </h3>
                            <div className="grid gap-3">
                                {protectionSides.map((side) => (
                                    <PjDefence
                                        key={side}
                                        mental={side === 'mentales'}
                                        locations={publishedLocations(
                                            side === 'mentales'
                                                ? 'mental'
                                                : 'physical'
                                        )}
                                        value={
                                            record(document.protections)[side]
                                        }
                                        onChange={(next) =>
                                            set('protections', {
                                                ...record(document.protections),
                                                [side]: next,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                    {target === 'formations' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text('adrenaline:pj.form.trainingsHeading')}
                            </h3>
                            {formationType === undefined && (
                                <div
                                    className="grid grid-cols-3 gap-1"
                                    role="tablist"
                                >
                                    {FORMATION_TYPES.map((type) => (
                                        <Button
                                            key={type}
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                formationTab === type
                                            }
                                            variant={
                                                formationTab === type
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="px-1 text-xs"
                                            onClick={() =>
                                                setFormationTab(type)
                                            }
                                        >
                                            {formationTypeLabel(type)}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            {formationColumns(records(document.formations))
                                .slice(0, FORMATION_TYPES.length)
                                .filter(
                                    ({ type }) =>
                                        formationType === undefined ||
                                        type === formationType
                                )
                                .map(
                                    ({
                                        type,
                                        formation = blankFormation(),
                                    }) => {
                                        const replace = (next: Entry) =>
                                            set(
                                                'formations',
                                                withFormation(
                                                    records(
                                                        document.formations
                                                    ),
                                                    type,
                                                    next
                                                )
                                            )
                                        return (
                                            <fieldset
                                                className="grid gap-2 rounded-md border p-2"
                                                hidden={
                                                    formationType ===
                                                        undefined &&
                                                    type !== formationTab
                                                }
                                                key={type}
                                            >
                                                <legend className="px-1 text-sm font-semibold">
                                                    {formationTypeLabel(type)}
                                                </legend>
                                                <FormationHead
                                                    type={type}
                                                    formation={formation}
                                                >
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <TextField
                                                            label={text(
                                                                'adrenaline:shared.trainings.title'
                                                            )}
                                                            value={String(
                                                                formation.nom ??
                                                                    ''
                                                            )}
                                                            onChange={(nom) =>
                                                                replace({
                                                                    ...formation,
                                                                    nom,
                                                                })
                                                            }
                                                        />
                                                        <ValueField
                                                            form="number"
                                                            label={text(
                                                                'adrenaline:shared.percentage'
                                                            )}
                                                            limit={pjLimit(
                                                                '/formations[]/pourcentage'
                                                            )}
                                                            value={
                                                                formation.pourcentage
                                                            }
                                                            onChange={(
                                                                pourcentage
                                                            ) =>
                                                                replace({
                                                                    ...formation,
                                                                    pourcentage,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <SkillRows
                                                        key={`${type}:${skillOpen}`}
                                                        form="number"
                                                        playerSheet
                                                        fold={{
                                                            open:
                                                                type ===
                                                                formationType
                                                                    ? skillOpen
                                                                    : undefined,
                                                        }}
                                                        label={text(
                                                            'adrenaline:shared.trainings.trainingSkills'
                                                        )}
                                                        value={
                                                            formation.competences
                                                        }
                                                        onChange={(
                                                            competences
                                                        ) =>
                                                            replace({
                                                                ...formation,
                                                                competences,
                                                            })
                                                        }
                                                    />
                                                </FormationHead>
                                            </fieldset>
                                        )
                                    }
                                )}
                        </section>
                    )}
                    {target === 'equipment' && (
                        <section className="grid gap-3">
                            <h3 className="font-semibold">
                                {text('adrenaline:shared.headings.equipment')}
                            </h3>
                            <EquipmentFields
                                key={(keys ?? []).join()}
                                fold={{
                                    open:
                                        weaponZone === undefined
                                            ? undefined
                                            : Math.min(
                                                  weaponZone,
                                                  weaponCount(document)
                                              ),
                                }}
                                form="number"
                                weapons={WEAPON_FIELDS.pj}
                                natures={publishedNatures()}
                                socialWeapons={publishedSocialWeapons()}
                                perks
                                shows={(key) => carries(`/equipement/${key}`)}
                                value={
                                    draft
                                        ? {
                                              ...equipment,
                                              [weaponKey]: [
                                                  ...records(
                                                      equipment[weaponKey]
                                                  ),
                                                  blankWeapon(),
                                              ],
                                          }
                                        : document.equipement
                                }
                                onChange={setEquipment}
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
            </LimitsProvider>
        </SchemaProvider>
    )
}
