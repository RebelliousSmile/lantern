import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useState } from 'react'
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
import {
    addMonsterState,
    monsterStates,
    removeMonsterState,
    replaceMonsterState,
    selectMonsterState,
    type MonsterDocument,
    type MonsterState,
    type MonsterStateResult,
} from '../states'

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
    const [stateError, setStateError] = useState<string | null>(null)
    const { document, update } = useAdrenalineDocument(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    const set = (key: string, value: unknown) =>
        update((next) => {
            next[key] = value
        })
    const contagion = record(document.contagion)
    const states = monsterStates(document)
    const commitStateDocument = (replacement: MonsterDocument) => {
        update((next) => {
            if ('etats' in replacement) next.etats = replacement.etats
            else delete next.etats
            if ('etatActif' in replacement)
                next.etatActif = replacement.etatActif
            else delete next.etatActif
            delete next.etatAlternatif
        })
        setStateError(null)
    }
    const commitStateResult = (result: MonsterStateResult) => {
        if (result.ok) {
            commitStateDocument(result.document)
            return
        }
        setStateError(
            text(
                result.error === 'duplicate-id'
                    ? 'adrenaline:monstre.form.duplicateStateId'
                    : 'adrenaline:monstre.form.invalidState'
            )
        )
    }
    const replaceState = (index: number, state: MonsterState) =>
        commitStateResult(replaceMonsterState(document, index, state))
    const setOptionalDeltaString = (
        index: number,
        state: MonsterState,
        key: 'zoneDeDetection' | 'deplacement' | 'notes',
        value: string
    ) => {
        const delta = { ...state.delta }
        if (value.trim()) delta[key] = value
        else delete delta[key]
        replaceState(index, { ...state, delta })
    }
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
                    {text('adrenaline:monstre.form.statesHeading')}
                </h3>
                <label className="grid gap-1 text-sm">
                    <span>{text('adrenaline:monstre.form.activeState')}</span>
                    <Select
                        value={String(document.etatActif ?? 'base')}
                        onValueChange={(stateId) =>
                            commitStateDocument(
                                selectMonsterState(document, stateId)
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="base">
                                {text('adrenaline:monstre.form.baseState')}
                            </SelectItem>
                            {states.map((state) => (
                                <SelectItem key={state.id} value={state.id}>
                                    {state.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </label>
                {states.map((state, index) => {
                    const delta = state.delta
                    const triggers = state.declencheurs ?? []
                    return (
                        <div
                            className="grid gap-2 rounded border p-3"
                            key={state.id}
                        >
                            <TextField
                                label={text('adrenaline:monstre.form.stateId')}
                                value={state.id}
                                onChange={(id) =>
                                    replaceState(index, { ...state, id })
                                }
                            />
                            <TextField
                                label={text('fields.name')}
                                value={state.nom}
                                onChange={(nom) =>
                                    replaceState(index, { ...state, nom })
                                }
                            />
                            <div className="grid gap-2">
                                <span className="text-sm">
                                    {text('adrenaline:monstre.form.triggers')}
                                </span>
                                {triggers.map((trigger, triggerIndex) => (
                                    <div
                                        className="flex gap-2"
                                        key={`${triggerIndex}-${trigger}`}
                                    >
                                        <div className="flex-1">
                                            <TextField
                                                label={text(
                                                    'adrenaline:monstre.form.trigger'
                                                )}
                                                value={trigger}
                                                onChange={(value) =>
                                                    replaceState(index, {
                                                        ...state,
                                                        declencheurs:
                                                            triggers.map(
                                                                (entry, at) =>
                                                                    at ===
                                                                    triggerIndex
                                                                        ? value
                                                                        : entry
                                                            ),
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                replaceState(index, {
                                                    ...state,
                                                    declencheurs:
                                                        triggers.filter(
                                                            (_, at) =>
                                                                at !==
                                                                triggerIndex
                                                        ),
                                                })
                                            }
                                        >
                                            {text('actions.remove')}
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        replaceState(index, {
                                            ...state,
                                            declencheurs: [
                                                ...triggers,
                                                text(
                                                    'adrenaline:monstre.form.newTrigger'
                                                ),
                                            ],
                                        })
                                    }
                                >
                                    {text('actions.add')}
                                </Button>
                            </div>
                            <CharacteristicsFields
                                value={
                                    delta.caracteristiques ??
                                    document.caracteristiques
                                }
                                onChange={(caracteristiques) =>
                                    replaceState(index, {
                                        ...state,
                                        delta: {
                                            ...delta,
                                            caracteristiques:
                                                caracteristiques as MonsterState['delta']['caracteristiques'],
                                        },
                                    })
                                }
                            />
                            <TextField
                                label={text(
                                    'adrenaline:monstre.form.detectionRange'
                                )}
                                value={String(delta.zoneDeDetection ?? '')}
                                onChange={(value) =>
                                    setOptionalDeltaString(
                                        index,
                                        state,
                                        'zoneDeDetection',
                                        value
                                    )
                                }
                            />
                            <TextField
                                label={text('adrenaline:monstre.form.movement')}
                                value={String(delta.deplacement ?? '')}
                                onChange={(value) =>
                                    setOptionalDeltaString(
                                        index,
                                        state,
                                        'deplacement',
                                        value
                                    )
                                }
                            />
                            <NumberField
                                label={text(
                                    'adrenaline:monstre.form.actionsPerRound'
                                )}
                                value={Number(delta.actionsParRound ?? 0)}
                                onChange={(actionsParRound) =>
                                    replaceState(index, {
                                        ...state,
                                        delta: {
                                            ...delta,
                                            actionsParRound,
                                        },
                                    })
                                }
                            />
                            <LongTextField
                                label={text('fields.notes')}
                                value={String(delta.notes ?? '')}
                                onChange={(value) =>
                                    setOptionalDeltaString(
                                        index,
                                        state,
                                        'notes',
                                        value
                                    )
                                }
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    commitStateDocument(
                                        removeMonsterState(document, index)
                                    )
                                }
                            >
                                {text('actions.remove')}
                            </Button>
                        </div>
                    )
                })}
                {stateError ? (
                    <p className="text-sm text-destructive" role="alert">
                        {stateError}
                    </p>
                ) : null}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        commitStateResult(
                            addMonsterState(
                                document,
                                text('adrenaline:monstre.form.newStateName')
                            )
                        )
                    }
                >
                    {text('adrenaline:monstre.form.addState')}
                </Button>
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
