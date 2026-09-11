import { useWorkspaceStore } from '@/core/workspace/store'
import type { PbtaGameDefinition } from '../game-definition/model'

export const PBTA_GAME_DEFINITION_TEMPLATE_ID = 'pbta.gameDefinition'

/**
 * A game definition is never referenced by id: a playbook, move, front or npc
 * names the game it belongs to (`doc.game`), and the definition itself has to
 * be open as a tab in the same workspace to be found. There is no store of
 * definitions outside the open tabs.
 */
export function useGameDefinitionForGame(
    game: string
): PbtaGameDefinition | null {
    return useWorkspaceStore((state) => {
        const tab = state.tabs.find(
            (candidate) =>
                candidate.templateId === PBTA_GAME_DEFINITION_TEMPLATE_ID &&
                (candidate.doc as PbtaGameDefinition | undefined)?.game === game
        )
        return (tab?.doc as PbtaGameDefinition | undefined) ?? null
    })
}
