import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useState, type ReactNode } from 'react'
import {
    LongTextField,
    RecordRows,
    StringRows,
    TextField,
    ValueField,
} from '../../shared/editor/FieldPrimitives'

import {
    canonical,
    cleanList,
    put,
    type Entry,
} from '../../shared/editor/clean'
import { EnumSelect } from '../../shared/editor/OptionalFields'
import { actionSummary, cleanAction, hasMoreFields } from './actionClean'
import { damageNatures, damageSides } from './damageEnums'
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

/* The values come from the published contract; only their wording is the editor's, a value without one shows as it is. */
const natureLabels: Record<string, TranslationKey> = {
    choquante: 'adrenaline:monstre.form.damageShocking',
    blessante: 'adrenaline:monstre.form.damageWounding',
}
const sideLabels: Record<string, TranslationKey> = {
    physique: 'adrenaline:monstre.form.damagePhysical',
    mental: 'adrenaline:monstre.form.damageMental',
}
const natureOptions = (): [string, TranslationKey | undefined][] =>
    damageNatures().map((value) => [value, natureLabels[value]])
const sideOptions = (): [string, TranslationKey | undefined][] =>
    damageSides().map((value) => [value, sideLabels[value]])

/** The always visible part of a damage: its profiles, one blank row while none is entered. */
function DamageProfiles({
    value,
    onChange,
}: {
    value: Entry
    onChange: (value: Entry) => void
}) {
    const text = useUiText()
    const entered = records(value.profils)
    return (
        <RecordRows
            label={text('adrenaline:monstre.form.damageProfiles')}
            values={entered.length > 0 ? entered : [{ des: '' }]}
            create={() => ({ des: '' })}
            onChange={(profils) => onChange({ ...value, profils })}
        >
            {(profile, _, replace) => (
                <div className="grid grid-cols-2 gap-2">
                    <TextField
                        label={text('adrenaline:monstre.form.damageDice')}
                        value={String(profile.des ?? '')}
                        onChange={(des) => replace({ ...profile, des })}
                    />
                    <EnumSelect
                        label={text('adrenaline:monstre.form.damageNature')}
                        value={profile.nature}
                        options={natureOptions()}
                        onChange={(nature) =>
                            replace(put(profile, 'nature', nature))
                        }
                    />
                    <div className="col-span-2">
                        <TextField
                            label={text(
                                'adrenaline:monstre.form.damageCondition'
                            )}
                            value={String(profile.condition ?? '')}
                            onChange={(condition) =>
                                replace({ ...profile, condition })
                            }
                        />
                    </div>
                </div>
            )}
        </RecordRows>
    )
}

/** The rarely used damage fields, kept behind "More". */
function DamageExtras({
    value,
    onChange,
}: {
    value: Entry
    onChange: (value: Entry) => void
}) {
    const text = useUiText()
    return (
        <>
            <div className="grid grid-cols-2 gap-2">
                <EnumSelect
                    label={text('adrenaline:monstre.form.damageSide')}
                    value={value.versant}
                    options={sideOptions()}
                    onChange={(versant) =>
                        onChange(put(value, 'versant', versant))
                    }
                />
                <TextField
                    label={text('adrenaline:monstre.form.damageLink')}
                    value={String(value.liant ?? '')}
                    onChange={(liant) => onChange(put(value, 'liant', liant))}
                />
            </div>
            <StringRows
                label={text('adrenaline:monstre.form.damageProperties')}
                values={strings(value.proprietes)}
                onChange={(proprietes) => onChange({ ...value, proprietes })}
            />
            <div className="grid grid-cols-2 gap-2">
                <TextField
                    label={text('adrenaline:monstre.form.damageAmmunition')}
                    value={String(value.munitions ?? '')}
                    onChange={(munitions) => onChange({ ...value, munitions })}
                />
                <TextField
                    label={text('adrenaline:monstre.form.damageRange')}
                    value={String(value.portee ?? '')}
                    onChange={(portee) => onChange({ ...value, portee })}
                />
            </div>
        </>
    )
}

/**
 * The fields an action and each of its follow-ups share. Test and damage are always there, empty
 * until filled: `cleanAction` writes nothing for a test without a name or damage without dice.
 */
function ActionFields({
    entry,
    replace,
}: {
    entry: Entry
    replace: (entry: Entry) => void
}) {
    const text = useUiText()
    const test = record(entry.test)
    const damage = record(entry.degats)
    /* Opened by what the entry already holds, then by the user alone: emptying the last field must not fold it under the cursor. */
    const [more, setMore] = useState(hasMoreFields(entry))
    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
                <TextField
                    label={text('adrenaline:monstre.form.actionTestName')}
                    value={String(test.nom ?? '')}
                    onChange={(nom) =>
                        replace({ ...entry, test: { ...test, nom } })
                    }
                />
                <ValueField
                    form="number"
                    label={text('adrenaline:monstre.form.actionTestPercentage')}
                    value={test.pourcentage}
                    onChange={(pourcentage) =>
                        replace({ ...entry, test: { ...test, pourcentage } })
                    }
                />
            </div>
            {/* The test names the action most of the time: the name of its own comes second and says when it is needed. */}
            <TextField
                label={text('adrenaline:monstre.form.actionName')}
                value={String(entry.nom ?? '')}
                onChange={(nom) => replace({ ...entry, nom })}
            />
            <DamageProfiles
                value={damage}
                onChange={(degats) => replace({ ...entry, degats })}
            />
            <StringRows
                label={text('adrenaline:monstre.form.actionEffects')}
                values={strings(entry.effets)}
                onChange={(effets) => replace({ ...entry, effets })}
            />
            <details
                className="grid gap-2 rounded border p-2"
                open={more}
                onToggle={(event) => setMore(event.currentTarget.open)}
            >
                <summary className="cursor-pointer text-sm">
                    {text('adrenaline:monstre.form.more')}
                </summary>
                <div className="mt-2 grid gap-2">
                    <DamageExtras
                        value={damage}
                        onChange={(degats) => replace({ ...entry, degats })}
                    />
                    <StringRows
                        label={text('adrenaline:monstre.form.actionConditions')}
                        values={strings(entry.conditions)}
                        onChange={(conditions) =>
                            replace({ ...entry, conditions })
                        }
                    />
                    <LongTextField
                        label={text('fields.notes')}
                        value={String(entry.notes ?? '')}
                        onChange={(notes) => replace({ ...entry, notes })}
                    />
                </div>
            </details>
        </div>
    )
}

type Slot = { id: number; open: boolean }
let lastSlotId = 0
const freshSlotId = () => (lastSlotId += 1)

/**
 * A list whose entries are folded on one summary line and opened to be edited, one at a time; an
 * entry just added opens. The open flags follow the entries when one is removed.
 */
function FoldList({
    label,
    values,
    onChange,
    children,
}: {
    label: string
    values: Entry[]
    onChange: (values: Entry[]) => void
    children: (entry: Entry, replace: (entry: Entry) => void) => ReactNode
}) {
    const text = useUiText()
    /* Each entry keeps an identity of its own from the first render, so its open flag follows it when another is removed. */
    const [kept, setKept] = useState<Slot[]>(() =>
        values.map(() => ({ id: freshSlotId(), open: false }))
    )
    let slots = kept
    if (kept.length !== values.length) {
        /* The list changed under us (reset from the document): the entries that remain keep their slot. */
        slots = values.map(
            (_, at) => kept[at] ?? { id: freshSlotId(), open: false }
        )
        setKept(slots)
    }
    const setOpen = (index: number, open: boolean) => {
        if (slots[index].open === open) return
        /* One entry open at a time: opening one folds the others, so the panel stays short. */
        setKept(
            slots.map((slot, at) =>
                at === index ? { ...slot, open } : { ...slot, open: false }
            )
        )
    }
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {values.map((entry, index) => (
                <details
                    className="grid gap-2 rounded border p-2"
                    key={slots[index].id}
                    open={slots[index].open}
                    onToggle={(event) =>
                        setOpen(index, event.currentTarget.open)
                    }
                >
                    <summary className="cursor-pointer text-sm font-medium">
                        {actionSummary(entry) ??
                            text('adrenaline:monstre.form.unnamedAction')}
                    </summary>
                    <div className="mt-2 grid gap-2">
                        {children(entry, (replacement) =>
                            onChange(
                                values.map((other, at) =>
                                    at === index ? replacement : other
                                )
                            )
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setKept(slots.filter((_, at) => at !== index))
                                onChange(values.filter((_, at) => at !== index))
                            }}
                        >
                            {text('actions.remove')}
                        </Button>
                    </div>
                </details>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setKept([
                        ...slots.map((slot) => ({ ...slot, open: false })),
                        { id: freshSlotId(), open: true },
                    ])
                    onChange([...values, {}])
                }}
            >
                {text('actions.add')}
            </Button>
        </div>
    )
}

/**
 * The creature's actions, as the published `actions` path declares them: name, test, damage in
 * the published `degats` form, effects, conditions and notes, then one level of follow-ups.
 * The legacy `desDeDegats` and `modificateurDeDegats` are read and kept, never written.
 */
export function ActionRows({
    label,
    value,
    onChange,
}: {
    label: string
    value: unknown
    /** `undefined` when no action is left: the key leaves the document. */
    onChange: (value: Entry[] | undefined) => void
}) {
    const text = useUiText()
    const current = cleanList(value, cleanAction)
    const [draft, setDraft] = useState<Entry[]>(records(value))
    if (canonical(cleanList(draft, cleanAction)) !== canonical(current))
        setDraft(records(value))
    const commit = (next: Entry[]) => {
        setDraft(next)
        onChange(cleanList(next, cleanAction))
    }
    return (
        <FoldList label={label} values={draft} onChange={commit}>
            {(action, replace) => (
                <div className="grid gap-2">
                    <ActionFields entry={action} replace={replace} />
                    <FoldList
                        label={text('adrenaline:monstre.form.followUps')}
                        values={records(action.suites)}
                        onChange={(suites) => replace({ ...action, suites })}
                    >
                        {(followUp, replaceFollowUp) => (
                            <ActionFields
                                entry={followUp}
                                replace={replaceFollowUp}
                            />
                        )}
                    </FoldList>
                </div>
            )}
        </FoldList>
    )
}
