import {
    CITY_GAME_ID,
    LEGEND_GAME_ID,
    OTHERSCAPE_GAME_ID,
    type GameId,
} from './templates/types'

export const EDITOR_TOKEN_SCOPE_CLASS = 'mist-markdown-scope'

export type GameThemeDefinition = {
    id: GameId
    backgroundMode: 'cover' | 'contain-bottom' | 'neutral'
    backgroundImage: string | null
    tokenScopeClassName: typeof EDITOR_TOKEN_SCOPE_CLASS
}

/**
 * The id a theme falls back to when no theme is declared for a game. It
 * matches no painted selector in `game-themes.css`, so it always resolves
 * to the no-background branch.
 */
export const NEUTRAL_GAME_ID = 'neutral'

export const neutralGameTheme: GameThemeDefinition = {
    id: NEUTRAL_GAME_ID,
    backgroundMode: 'neutral',
    backgroundImage: null,
    tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
}

export const gameThemeRegistry: Partial<Record<GameId, GameThemeDefinition>> = {
    [CITY_GAME_ID]: {
        id: CITY_GAME_ID,
        backgroundMode: 'cover',
        backgroundImage: '/assets/images/com-bg.webp',
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
    [LEGEND_GAME_ID]: {
        id: LEGEND_GAME_ID,
        backgroundMode: 'contain-bottom',
        backgroundImage: '/assets/images/litm-bg.webp',
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
    [OTHERSCAPE_GAME_ID]: {
        id: OTHERSCAPE_GAME_ID,
        backgroundMode: 'cover',
        backgroundImage: '/assets/images/otherscape-bg.webp',
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
}

export function getGameTheme(gameId: GameId): GameThemeDefinition {
    return gameThemeRegistry[gameId] ?? neutralGameTheme
}
