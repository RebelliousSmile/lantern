import type { AnyTemplateDefinition } from './types'

export type TemplateLoader = () => Promise<{
    default: AnyTemplateDefinition
}>

/**
 * Literal imports deliberately give Vite one independently addressable module
 * per template. The registry checks this map before a tab can request one.
 */
export const templateLoaders: Record<string, TemplateLoader> = {
    'adrenaline.pj': () => import('@/templates/adrenaline/pj/definition'),
    'adrenaline.pnj': () => import('@/templates/adrenaline/pnj/definition'),
    'adrenaline.monstre': () =>
        import('@/templates/adrenaline/monstre/definition'),
    'city.danger': () => import('@/templates/city-of-mist/danger/definition'),
    'city.customMove': () =>
        import('@/templates/city-of-mist/custom-move/definition'),
    'city.themeKit': () =>
        import('@/templates/city-of-mist/theme-kit/definition'),
    'city.themeCard': () =>
        import('@/templates/city-of-mist/theme-card/definition'),
    'legend.challenge': () =>
        import('@/templates/legend-in-the-mist/challenge/definition'),
    'legend.journey': () =>
        import('@/templates/legend-in-the-mist/journey/definition'),
    'legend.storyTheme': () =>
        import('@/templates/legend-in-the-mist/story-theme/definition'),
    'legend.themeKit': () =>
        import('@/templates/legend-in-the-mist/theme-kit/definition'),
    'otherscape.challenge': () =>
        import('@/templates/otherscape/challenge/definition'),
    'otherscape.characterTrope': () =>
        import('@/templates/otherscape/character-trope/definition'),
    'otherscape.powerSet': () =>
        import('@/templates/otherscape/power-set/definition'),
    'otherscape.themeKit': () =>
        import('@/templates/otherscape/theme-kit/definition'),
    'otherscape.theme': () =>
        import('@/templates/otherscape/theme/definition'),
    'otherscape.loadoutItem': () =>
        import('@/templates/otherscape/loadout-item/definition'),
    'pbta.gameDefinition': () =>
        import('@/templates/pbta/game-definition/definition'),
    'pbta.playbook': () => import('@/templates/pbta/playbook/definition'),
    'urban-shadows.playbook': () =>
        import('@/templates/urban-shadows/playbook/definition'),
    'monsterhearts.playbook': () =>
        import('@/templates/monsterhearts/playbook/definition'),
    'masks.playbook': () => import('@/templates/masks/playbook/definition'),
    'monster-of-the-week.playbook': () =>
        import('@/templates/monster-of-the-week/playbook/definition'),
    'the-sprawl.playbook': () =>
        import('@/templates/the-sprawl/playbook/definition'),
}

export function loadTemplateDefinition(templateId: string) {
    const loader = templateLoaders[templateId]
    return loader ? loader() : null
}
