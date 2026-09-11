import { documentContracts } from '@/contracts/registry'
import cityCustomMoveTemplate from '@/templates/city-of-mist/custom-move/definition'
import dangerTemplate from '@/templates/city-of-mist/danger/definition'
import cityThemeCardTemplate from '@/templates/city-of-mist/theme-card/definition'
import cityThemeKitTemplate from '@/templates/city-of-mist/theme-kit/definition'
import challengeTemplate from '@/templates/legend-in-the-mist/challenge/definition'
import journeyTemplate from '@/templates/legend-in-the-mist/journey/definition'
import storyThemeTemplate from '@/templates/legend-in-the-mist/story-theme/definition'
import themeKitTemplate from '@/templates/legend-in-the-mist/theme-kit/definition'
import otherscapeChallengeTemplate from '@/templates/otherscape/challenge/definition'
import otherscapeCharacterTropeTemplate from '@/templates/otherscape/character-trope/definition'
import otherscapeLoadoutItemTemplate from '@/templates/otherscape/loadout-item/definition'
import otherscapePowerSetTemplate from '@/templates/otherscape/power-set/definition'
import otherscapeThemeKitTemplate from '@/templates/otherscape/theme-kit/definition'
import otherscapeThemeTemplate from '@/templates/otherscape/theme/definition'
import { type AnyTemplateDefinition } from './types'

export const templateRegistry: AnyTemplateDefinition[] = [
    dangerTemplate,
    cityCustomMoveTemplate,
    cityThemeKitTemplate,
    cityThemeCardTemplate,
    challengeTemplate,
    journeyTemplate,
    storyThemeTemplate,
    themeKitTemplate,
    otherscapeChallengeTemplate,
    otherscapeCharacterTropeTemplate,
    otherscapePowerSetTemplate,
    otherscapeThemeKitTemplate,
    otherscapeThemeTemplate,
    otherscapeLoadoutItemTemplate,
]

/*
 * Every template's contract key has to resolve, and it has to resolve here
 * rather than at the first import or export: a fifteenth module pointing at
 * nothing must fail the run with its key named, not ship and break on a user's
 * document. `require` throws with the key and the known ones.
 */
for (const template of templateRegistry) {
    documentContracts.require(template.contractKey)
}

export const templateById = new Map(
    templateRegistry.map((template) => [template.id, template] as const)
)

export const templatesByGame = [
    {
        gameId: 'city',
        gameLabel: 'City of Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'city'
        ),
    },
    {
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'legend'
        ),
    },
    {
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'otherscape'
        ),
    },
] as const
