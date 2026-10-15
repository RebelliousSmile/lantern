import { Button } from '@/components/ui/button'
import { useUiText } from '@/i18n/text'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { canonical, compact, withoutHollow } from '../../shared/editor/clean'
import { useAdrenalineDocument } from '../../shared/hooks'
import { maximumStates } from '../../shared/schemaFields'
import type { MonstreSection } from '../../shared/sections'
import { shownKeys, showsKey } from '../editTargets'
import { blankMonstre } from '../sample'
import {
    monsterStates,
    replaceMonsterState,
    type MonsterDocument,
    type MonsterState,
    type MonsterStateResult,
} from '../states'
import {
    DELTA_KEYS,
    giveDeltaKey,
    shownValue,
    takeBackDeltaKey,
    writeDeltaKey,
    type DeltaSource,
    type Draft,
} from './deltaEdit'
import { record } from './fieldHelpers'

export function useMonstreEdit() {
    const text = useUiText()
    const [stateError, setStateError] = useState<string | null>(null)
    const [drafts, setDrafts] = useState<Record<string, Draft>>({})
    const [claims, setClaims] = useState<Record<string, true>>({})
    const { document, update, sheet } = useAdrenalineDocument<
        Record<string, unknown>,
        MonstreSection
    >(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    /* A field is a value or it is not there: nothing hollow is held by the document. */
    const setOptional = (key: string, value: unknown) =>
        update((next) => {
            const kept = withoutHollow(value)
            if (kept === undefined) delete next[key]
            else next[key] = kept
        })
    const set = setOptional
    const states = monsterStates(document)
    const stateMaximum = maximumStates()
    const stateLimitReached =
        stateMaximum !== undefined && states.length >= stateMaximum
    const commitStateDocument = (replacement: MonsterDocument) => {
        update((next) => {
            const states = withoutHollow(replacement.etats)
            if (states !== undefined) next.etats = states
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
    /*
     * A card prints, key by key, the state's `delta` value when the state defines it and the base
     * value otherwise. The sheet opened from a card names that profile (a section outside the cards
     * names the principal one); an edit goes where the card reads, and a state that defines no
     * value writes to the base rather than creating a `delta` key that would mask it. A state's
     * entry is a draft cleaned before it is written, so a blank row stays on screen without
     * reaching the contract.
     */
    const profile = sheet.profile ?? 'base'
    /* An error belongs to the edit that raised it: it goes when the panel or the profile changes. */
    useEffect(() => {
        setStateError(null)
    }, [sheet.target, profile])
    /* The block a click came from prints some keys only: the panel shows those, all of them when it was opened from the section list. */
    const shows = (...keys: string[]) => showsKey(sheet.keys, ...keys)
    /* Opened from a block: the panel is the zone of that block, not the whole sheet. */
    const zone = sheet.keys !== undefined
    /* The profile line only says something when the panel shows a key a state can hold. */
    const showsDeltaKey =
        sheet.target !== null &&
        shownKeys(sheet.target, sheet.keys).some(
            (key) => DELTA_KEYS.indexOf(key) >= 0
        )
    const profileIndex = states.findIndex((state) => state.id === profile)
    const profileState = profileIndex >= 0 ? states[profileIndex] : undefined
    /*
     * The source of one delta key for one profile (`state`, or the base when `undefined`). A state owns
     * the key when its `delta` holds it, or once the user has asked to give it its own values and no
     * value could be written yet (a claim); only then are edits written to the delta. A state that does
     * not own the key writes to the base: no `delta` key is ever created by typing.
     */
    const sourceFor = (
        state: MonsterState | undefined,
        index: number,
        key: string
    ): DeltaSource => {
        const draftKey = `${state?.id ?? 'base'}/${key}`
        const delta = (state?.delta ?? {}) as Record<string, unknown>
        const claimed = claims[draftKey] === true
        const owner =
            state && (delta[key] !== undefined || claimed) ? state : undefined
        const stored = owner ? delta[key] : document[key]
        const shown = owner ? shownValue(drafts[draftKey], stored) : stored
        return {
            key,
            state,
            index,
            owner,
            value: shown,
            refused:
                owner !== undefined &&
                canonical(compact(shown)) !== canonical(compact(stored)),
            write: (typed: unknown) => {
                /* A field is a value or it is not there: nothing hollow is held by the document. */
                const value = withoutHollow(typed)
                if (!owner) {
                    setStateError(null)
                    update((next) => {
                        if (value === undefined) delete next[key]
                        else next[key] = value
                    })
                    return
                }
                setDrafts((previous) => ({
                    ...previous,
                    [draftKey]: { value, over: canonical(stored) },
                }))
                const written = writeDeltaKey(owner, key, value)
                if (!written.ok) {
                    /* A claim with nothing to keep yet is not an error: the key waits for its first value. */
                    if (stored !== undefined)
                        setStateError(
                            text('adrenaline:monstre.form.stateKeepsValue')
                        )
                    return
                }
                replaceState(index, written.state)
            },
        }
    }
    const editedSource = (key: string) =>
        sourceFor(profileState, profileIndex, key)
    /* The one way a delta key is created: the user gives the state its own values (a copy of the base's, else the empty form the contract takes, else a draft). */
    const giveKeys = (state: MonsterState, index: number, keys: string[]) => {
        let next = state
        const pending: string[] = []
        for (const key of keys) {
            const gift = giveDeltaKey(next, key, document[key])
            if (gift.kind === 'written') next = gift.state
            else pending.push(key)
        }
        if (pending.length > 0)
            setClaims((previous) => {
                const added = { ...previous }
                for (const key of pending) added[`${state.id}/${key}`] = true
                return added
            })
        if (next !== state) replaceState(index, next)
    }
    const takeBackKeys = (
        state: MonsterState,
        index: number,
        keys: string[]
    ) => {
        const forget = <T,>(previous: Record<string, T>) => {
            const kept = { ...previous }
            for (const key of keys) delete kept[`${state.id}/${key}`]
            return kept
        }
        setClaims(forget)
        setDrafts(forget)
        replaceState(
            index,
            keys.reduce<MonsterState>(
                (current, key) => takeBackDeltaKey(current, key),
                state
            )
        )
    }
    const behaviours = editedSource('comportement')
    const traits = editedSource('traitsSpeciaux')
    const actionsSource = editedSource('actions')
    const skillsSource = editedSource('competences')
    const contagionSource = editedSource('contagion')
    const contagion = record(contagionSource.value)
    const characteristicsSource = editedSource('caracteristiques')
    const healthSource = editedSource('sante')
    const permanentStatesSource = editedSource('etatsPermanents')
    const maluses = editedSource('malusAvantHs')
    const protectionsSource = editedSource('protections')
    const equipmentSource = editedSource('equipement')
    const detectionSource = editedSource('zoneDeDetection')
    const movementSource = editedSource('deplacement')
    const actionsPerRound = editedSource('actionsParRound')
    const defenseSource = editedSource('defense')
    const defense = record(defenseSource.value)
    const setDefense = (key: string, value: unknown) => {
        const next = { ...defense }
        if (value === undefined) delete next[key]
        else next[key] = value
        defenseSource.write(Object.keys(next).length > 0 ? next : undefined)
    }
    /* The profile the sheet edits, on one line. */
    const profileLine = () =>
        showsDeltaKey ? (
            <p className="text-sm text-muted-foreground">
                {text('adrenaline:monstre.form.editedProfile', {
                    name: profileState
                        ? profileState.nom
                        : text('adrenaline:monstre.form.baseState'),
                })}
            </p>
        ) : null
    /*
     * Who owns what, once per panel: one line and one button when every key the panel shows is in the
     * same case, one short row per key when they differ. Nothing on the base profile. With `note`, a
     * key the state does not own says that typing writes to the base.
     */
    const ownership = (
        entries: [string, DeltaSource][],
        note = true
    ): ReactNode => {
        const shown = entries.filter(([, source]) => shows(source.key))
        const state = shown[0]?.[1].state
        if (!state || shown.length === 0) return null
        const index = shown[0][1].index
        const free = shown.filter(([, source]) => !source.owner)
        const kept = shown.filter(([, source]) => source.owner)
        const give = (list: [string, DeltaSource][]) => (
            <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                    giveKeys(
                        state,
                        index,
                        list.map(([, source]) => source.key)
                    )
                }
            >
                {text('adrenaline:monstre.form.giveOwnValues')}
            </Button>
        )
        const back = (list: [string, DeltaSource][]) => (
            <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                    takeBackKeys(
                        state,
                        index,
                        list.map(([, source]) => source.key)
                    )
                }
            >
                {text('adrenaline:monstre.form.backToBase')}
            </Button>
        )
        if (free.length === 0 || kept.length === 0)
            return (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {free.length > 0 && note ? (
                        <span>
                            {text('adrenaline:monstre.form.writesToBase')}
                        </span>
                    ) : null}
                    {free.length > 0 ? give(free) : back(kept)}
                </div>
            )
        return (
            <div className="grid gap-1 text-xs text-muted-foreground">
                {shown.map(([label, source]) => (
                    <div
                        className="flex flex-wrap items-center gap-2"
                        key={source.key}
                    >
                        <span>{label}</span>
                        {source.owner
                            ? back([[label, source]])
                            : give([[label, source]])}
                    </div>
                ))}
            </div>
        )
    }
    /* `id` lets the field whose write was refused name this line as its description. */
    const errorLine = (id?: string) =>
        stateError ? (
            <p id={id} className="text-sm text-destructive" role="alert">
                {stateError}
            </p>
        ) : null
    return {
        text,
        set,
        setOptional,
        states,
        stateMaximum,
        stateLimitReached,
        commitStateDocument,
        commitStateResult,
        replaceState,
        profile,
        shows,
        zone,
        profileIndex,
        profileState,
        sourceFor,
        editedSource,
        giveKeys,
        takeBackKeys,
        behaviours,
        traits,
        actionsSource,
        skillsSource,
        contagionSource,
        contagion,
        characteristicsSource,
        healthSource,
        permanentStatesSource,
        maluses,
        protectionsSource,
        equipmentSource,
        detectionSource,
        movementSource,
        actionsPerRound,
        defenseSource,
        defense,
        setDefense,
        profileLine,
        ownership,
        errorLine,
        stateError,
        setStateError,
        document,
        update,
        sheet,
    }
}
