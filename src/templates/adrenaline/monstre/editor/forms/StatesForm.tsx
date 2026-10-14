import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUiText } from '@/i18n/text'
import { useId, useState, type ReactNode } from 'react'
import { CharacteristicsFields } from '../../../shared/editor/AdrenalineFields'
import {
    LongTextField,
    NumberField,
    StringRows,
    TextField,
} from '../../../shared/editor/FieldPrimitives'
import { CHARACTERISTIC_FIELDS } from '../../../shared/schemaFields'
import {
    addMonsterState,
    removeMonsterState,
    selectMonsterState,
} from '../../states'
import type { DeltaSource } from '../deltaEdit'
import { useMonstreEdit } from '../useMonstreEdit'

/*
 * A field whose every keystroke is validated: the entry stays as typed while the field has the
 * focus, so a value the schema refuses halfway (an empty id, a trailing hyphen) can still be
 * typed through. Leaving the field returns to the last value the document accepted.
 */
function DraftTextField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    const text = useUiText()
    const statusId = useId()
    const [draft, setDraft] = useState<string | null>(null)
    /* A blank name is not a name: it stays typed in the field, the document keeps the last one. */
    const blank = draft !== null && draft.trim() === ''
    return (
        <div className="grid gap-1">
            <label className="grid gap-1 text-sm">
                <span>{label}</span>
                <Input
                    value={draft ?? value}
                    aria-invalid={blank ? true : undefined}
                    aria-describedby={blank ? statusId : undefined}
                    onFocus={() => setDraft(value)}
                    onBlur={() => setDraft(null)}
                    onChange={(event) => {
                        setDraft(event.target.value)
                        if (event.target.value.trim() === '') return
                        onChange(event.target.value)
                    }}
                />
            </label>
            {blank && (
                <p
                    id={statusId}
                    role="status"
                    className="text-xs text-muted-foreground"
                >
                    {value.trim() === ''
                        ? text('adrenaline:shared.draft.nameMissing')
                        : text('adrenaline:shared.draft.nameKept', {
                              name: value,
                          })}
                </p>
            )}
        </div>
    )
}

/*
 * One delta key of one state: the field while the state owns the value, else the key and the one
 * button that gives the state its own values. Typing never creates a delta key.
 */
function OwnedRow({
    label,
    source,
    give,
    back,
    children,
}: {
    label: string
    source: DeltaSource
    give: () => void
    back: () => void
    children: (source: DeltaSource) => ReactNode
}) {
    const text = useUiText()
    return (
        <div className="grid gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{label}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={source.owner ? back : give}
                >
                    {text(
                        source.owner
                            ? 'adrenaline:monstre.form.backToBase'
                            : 'adrenaline:monstre.form.giveOwnValues'
                    )}
                </Button>
            </div>
            {source.owner ? children(source) : null}
        </div>
    )
}

export function StatesForm() {
    const {
        text,
        states,
        stateLimitReached,
        commitStateDocument,
        commitStateResult,
        replaceState,
        sourceFor,
        giveKeys,
        takeBackKeys,
        errorLine,
        document,
        shows,
        zone,
        profile,
    } = useMonstreEdit()
    /* A state exists with a name nobody gave it by default: the name is typed, then the state is added. */
    const [newName, setNewName] = useState('')
    const newNameId = useId()
    /*
     * Opened from the state header of a card, the panel is that header: the state's name, its triggers
     * and the current-state choice. The values of the other zones, and the list management, belong to
     * the section list.
     */
    return (
        <>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.statesHeading')}
                </h3>
                {shows('etatActif') ? (
                    <label className="grid gap-1 text-sm">
                        <span>
                            {text('adrenaline:monstre.form.activeState')}
                        </span>
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
                ) : null}
                {states.map((state, index) => {
                    const triggers = state.declencheurs ?? []
                    if (!shows('etats') || (zone && state.id !== profile))
                        return null
                    return (
                        <div
                            className="grid gap-2 rounded border p-3"
                            key={index}
                        >
                            <DraftTextField
                                label={text('fields.name')}
                                value={state.nom}
                                onChange={(nom) =>
                                    replaceState(index, { ...state, nom })
                                }
                            />
                            <StringRows
                                label={text('adrenaline:monstre.form.triggers')}
                                values={triggers}
                                onChange={(declencheurs) =>
                                    replaceState(index, {
                                        ...state,
                                        declencheurs,
                                    })
                                }
                            />
                            {zone ? null : (
                                <>
                                    <OwnedRow
                                        label={text(
                                            'adrenaline:shared.headings.characteristics'
                                        )}
                                        source={sourceFor(
                                            state,
                                            index,
                                            'caracteristiques'
                                        )}
                                        give={() =>
                                            giveKeys(state, index, [
                                                'caracteristiques',
                                            ])
                                        }
                                        back={() =>
                                            takeBackKeys(state, index, [
                                                'caracteristiques',
                                            ])
                                        }
                                    >
                                        {(source) => (
                                            <CharacteristicsFields
                                                form="number"
                                                keys={
                                                    CHARACTERISTIC_FIELDS.monstreEtat
                                                }
                                                value={source.value}
                                                onChange={source.write}
                                            />
                                        )}
                                    </OwnedRow>
                                    <OwnedRow
                                        label={text(
                                            'adrenaline:monstre.form.detectionRange'
                                        )}
                                        source={sourceFor(
                                            state,
                                            index,
                                            'zoneDeDetection'
                                        )}
                                        give={() =>
                                            giveKeys(state, index, [
                                                'zoneDeDetection',
                                            ])
                                        }
                                        back={() =>
                                            takeBackKeys(state, index, [
                                                'zoneDeDetection',
                                            ])
                                        }
                                    >
                                        {(source) => (
                                            <TextField
                                                label={text(
                                                    'adrenaline:monstre.form.detectionRange'
                                                )}
                                                value={String(
                                                    source.value ?? ''
                                                )}
                                                onChange={source.write}
                                            />
                                        )}
                                    </OwnedRow>
                                    <OwnedRow
                                        label={text(
                                            'adrenaline:monstre.form.movement'
                                        )}
                                        source={sourceFor(
                                            state,
                                            index,
                                            'deplacement'
                                        )}
                                        give={() =>
                                            giveKeys(state, index, [
                                                'deplacement',
                                            ])
                                        }
                                        back={() =>
                                            takeBackKeys(state, index, [
                                                'deplacement',
                                            ])
                                        }
                                    >
                                        {(source) => (
                                            <TextField
                                                label={text(
                                                    'adrenaline:monstre.form.movement'
                                                )}
                                                value={String(
                                                    source.value ?? ''
                                                )}
                                                onChange={source.write}
                                            />
                                        )}
                                    </OwnedRow>
                                    <OwnedRow
                                        label={text(
                                            'adrenaline:monstre.form.actionsPerRound'
                                        )}
                                        source={sourceFor(
                                            state,
                                            index,
                                            'actionsParRound'
                                        )}
                                        give={() =>
                                            giveKeys(state, index, [
                                                'actionsParRound',
                                            ])
                                        }
                                        back={() =>
                                            takeBackKeys(state, index, [
                                                'actionsParRound',
                                            ])
                                        }
                                    >
                                        {(source) => (
                                            <NumberField
                                                label={text(
                                                    'adrenaline:monstre.form.actionsPerRound'
                                                )}
                                                value={
                                                    typeof source.value ===
                                                    'number'
                                                        ? source.value
                                                        : undefined
                                                }
                                                onChange={source.write}
                                                onClear={() =>
                                                    source.write(undefined)
                                                }
                                            />
                                        )}
                                    </OwnedRow>
                                    <OwnedRow
                                        label={text('fields.notes')}
                                        source={sourceFor(
                                            state,
                                            index,
                                            'notes'
                                        )}
                                        give={() =>
                                            giveKeys(state, index, ['notes'])
                                        }
                                        back={() =>
                                            takeBackKeys(state, index, [
                                                'notes',
                                            ])
                                        }
                                    >
                                        {(source) => (
                                            <LongTextField
                                                label={text('fields.notes')}
                                                value={String(
                                                    source.value ?? ''
                                                )}
                                                onChange={source.write}
                                            />
                                        )}
                                    </OwnedRow>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            commitStateDocument(
                                                removeMonsterState(
                                                    document,
                                                    index
                                                )
                                            )
                                        }
                                    >
                                        {text('actions.remove')}
                                    </Button>
                                </>
                            )}
                        </div>
                    )
                })}
                {errorLine()}
                {!zone && stateLimitReached && (
                    <p className="text-sm text-muted-foreground">
                        {text('adrenaline:monstre.form.stateLimitReached')}
                    </p>
                )}
                {zone ? null : (
                    <div className="grid gap-1">
                        <label className="grid gap-1 text-sm">
                            <span>
                                {text('adrenaline:monstre.form.newStateName')}
                            </span>
                            <Input
                                value={newName}
                                aria-describedby={
                                    newName.trim() === ''
                                        ? newNameId
                                        : undefined
                                }
                                onChange={(event) =>
                                    setNewName(event.target.value)
                                }
                            />
                        </label>
                        {newName.trim() === '' && (
                            <p
                                id={newNameId}
                                role="status"
                                className="text-xs text-muted-foreground"
                            >
                                {text(
                                    'adrenaline:monstre.form.newStateNameMissing'
                                )}
                            </p>
                        )}
                        <Button
                            disabled={
                                stateLimitReached || newName.trim() === ''
                            }
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (newName.trim() === '') return
                                commitStateResult(
                                    addMonsterState(document, newName.trim())
                                )
                                setNewName('')
                            }}
                        >
                            {text('adrenaline:monstre.form.addState')}
                        </Button>
                    </div>
                )}
            </section>
        </>
    )
}
