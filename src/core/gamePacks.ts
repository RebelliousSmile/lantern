import { create } from 'zustand'

import type { GameId } from './templates/types'

/* A game pack is one game and the templates it brings. The sidebar lists them
   all, and the list is the only place a document can be started from, so it
   gets long as packs are added. Two settings keep it readable, and both are
   remembered: which packs are offered at all, and which ones are unfolded.

   What is persisted for the first is the *disabled* set, never the enabled one:
   a pack added after the user last touched this list has never been refused, so
   it must show up on its own. Storing the enabled set would bury every future
   pack behind a setting nobody knows to open.

   The unfolded set runs the other way and stores what is *open*, so a fresh
   workspace opens nothing — the sidebar shows one row per pack and the user
   picks. The app used to hard-code Legend in the Mist open, a leftover from
   when it was the only game.

   Hiding a pack only filters the launcher. Open tabs of that game stay open and
   keep working — the setting is about what can be started, not about what is
   already on the workbench. */
export const GAME_PACKS_STORAGE_KEY = 'mist:game-packs:v1'

type StoredGamePacks = {
    disabled: string[]
    open: string[]
}

function readStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return []
    return value.filter((id): id is string => typeof id === 'string')
}

function readGamePacks(): StoredGamePacks {
    try {
        const raw = window.localStorage.getItem(GAME_PACKS_STORAGE_KEY)
        if (!raw) return { disabled: [], open: [] }
        const parsed: unknown = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') {
            return { disabled: [], open: [] }
        }
        const record = parsed as Record<string, unknown>
        return {
            disabled: readStringArray(record.disabled),
            open: readStringArray(record.open),
        }
    } catch {
        return { disabled: [], open: [] }
    }
}

function persistGamePacks(packs: StoredGamePacks) {
    try {
        window.localStorage.setItem(
            GAME_PACKS_STORAGE_KEY,
            JSON.stringify(packs)
        )
    } catch {
        /* Same contract as the workspace store: a full or blocked storage does
           not break the session, it only stops remembering. */
    }
}

function toggleMembership(list: string[], id: string, member: boolean) {
    if (member) return list.includes(id) ? list : [...list, id]
    return list.includes(id) ? list.filter((entry) => entry !== id) : list
}

type GamePackState = {
    disabledGameIds: string[]
    openGameIds: string[]
    setGamePackEnabled: (gameId: GameId | string, enabled: boolean) => void
    setGamePackOpen: (gameId: GameId | string, open: boolean) => void
}

export const useGamePackStore = create<GamePackState>((set, get) => {
    const stored = readGamePacks()

    function commit(next: StoredGamePacks) {
        persistGamePacks(next)
        set({ disabledGameIds: next.disabled, openGameIds: next.open })
    }

    return {
        disabledGameIds: stored.disabled,
        openGameIds: stored.open,

        setGamePackEnabled: (gameId, enabled) => {
            const { disabledGameIds, openGameIds } = get()
            const disabled = toggleMembership(disabledGameIds, gameId, !enabled)
            if (disabled === disabledGameIds) return
            /* A pack that comes back reopens as the user left it, so its
               unfolded state is kept while it is hidden. */
            commit({ disabled, open: openGameIds })
        },

        setGamePackOpen: (gameId, open) => {
            const { disabledGameIds, openGameIds } = get()
            const nextOpen = toggleMembership(openGameIds, gameId, open)
            if (nextOpen === openGameIds) return
            commit({ disabled: disabledGameIds, open: nextOpen })
        },
    }
})
