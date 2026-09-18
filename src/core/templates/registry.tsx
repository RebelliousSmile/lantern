import { documentContracts } from '@/contracts/registry'
import { inferObject } from '@/core/editor-schema/inferSchema'
import adrenalineMonstreTemplate from '@/templates/adrenaline/monstre/definition'
import adrenalinePjTemplate from '@/templates/adrenaline/pj/definition'
import adrenalinePnjTemplate from '@/templates/adrenaline/pnj/definition'
import cityCustomMoveTemplate from '@/templates/city-of-mist/custom-move/definition'
import dangerTemplate from '@/templates/city-of-mist/danger/definition'
import cityThemeCardTemplate from '@/templates/city-of-mist/theme-card/definition'
import cityThemeKitTemplate from '@/templates/city-of-mist/theme-kit/definition'
import challengeTemplate from '@/templates/legend-in-the-mist/challenge/definition'
import journeyTemplate from '@/templates/legend-in-the-mist/journey/definition'
import storyThemeTemplate from '@/templates/legend-in-the-mist/story-theme/definition'
import themeKitTemplate from '@/templates/legend-in-the-mist/theme-kit/definition'
import masksPlaybookTemplate from '@/templates/masks/playbook/definition'
import monsterOfTheWeekPlaybookTemplate from '@/templates/monster-of-the-week/playbook/definition'
import monsterheartsPlaybookTemplate from '@/templates/monsterhearts/playbook/definition'
import otherscapeChallengeTemplate from '@/templates/otherscape/challenge/definition'
import otherscapeCharacterTropeTemplate from '@/templates/otherscape/character-trope/definition'
import otherscapeLoadoutItemTemplate from '@/templates/otherscape/loadout-item/definition'
import otherscapePowerSetTemplate from '@/templates/otherscape/power-set/definition'
import otherscapeThemeKitTemplate from '@/templates/otherscape/theme-kit/definition'
import otherscapeThemeTemplate from '@/templates/otherscape/theme/definition'
import gameDefinitionTemplate from '@/templates/pbta/game-definition/definition'
import playbookTemplate from '@/templates/pbta/playbook/definition'
import theSprawlPlaybookTemplate from '@/templates/the-sprawl/playbook/definition'
import urbanShadowsPlaybookTemplate from '@/templates/urban-shadows/playbook/definition'
import { type AnyTemplateDefinition, type GameId } from './types'

export const templateRegistry: AnyTemplateDefinition[] = [
    adrenalinePjTemplate,
    adrenalinePnjTemplate,
    adrenalineMonstreTemplate,
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
    gameDefinitionTemplate,
    playbookTemplate,
    urbanShadowsPlaybookTemplate,
    monsterheartsPlaybookTemplate,
    masksPlaybookTemplate,
    monsterOfTheWeekPlaybookTemplate,
    theSprawlPlaybookTemplate,
]

/*
 * Every template's contract key has to resolve, and it has to resolve here
 * rather than at the first import or export: a fifteenth module pointing at
 * nothing must fail the run with its key named, not ship and break on a user's
 * document. `require` throws with the key and the known ones.
 */
for (const template of templateRegistry) {
    documentContracts.require(template.contractKey)
    if (!template.editor.schema) {
        template.editor.schema = inferObject(
            template.id,
            template.createBlank() as Record<string, unknown>
        )
    }
}

export type GameGroup = {
    gameId: GameId
    gameLabel: string
    templates: AnyTemplateDefinition[]
}

/*
 * Grouped by first occurrence in `templateRegistry`, which is itself
 * ordered game by game, so the shipped city -> legend -> otherscape
 * display order falls out of the fold with no extra bookkeeping.
 */
export const templatesByGame: GameGroup[] = (() => {
    const groups: GameGroup[] = []
    const groupByGameId = new Map<string, GameGroup>()

    for (const template of templateRegistry) {
        let group = groupByGameId.get(template.gameId)
        if (!group) {
            group = {
                gameId: template.gameId,
                gameLabel: template.gameLabel,
                templates: [],
            }
            groupByGameId.set(template.gameId, group)
            groups.push(group)
        }
        group.templates.push(template)
    }

    return groups
})()

export function assertTemplateRegistryIntegrity(
    templates: readonly AnyTemplateDefinition[],
    groups: readonly GameGroup[],
    requireContract: (key: string) => unknown = (key) =>
        documentContracts.require(key)
) {
    const ids = new Set<string>()
    for (const template of templates) {
        if (!template.id)
            throw new Error('template registry contains an empty id')
        if (ids.has(template.id))
            throw new Error(
                `template registry contains duplicate id: ${template.id}`
            )
        ids.add(template.id)
        if (!template.gameId || !template.gameLabel)
            throw new Error(
                `template ${template.id} has an incomplete game identity`
            )
        requireContract(template.contractKey)
    }

    const grouped = new Set<string>()
    for (const group of groups) {
        if (!group.gameId || !group.gameLabel)
            throw new Error(
                'template registry contains an incomplete game group'
            )
        if (!group.templates.length)
            throw new Error(
                `template registry contains an empty game group: ${group.gameId}`
            )
        for (const template of group.templates) {
            if (template.gameId !== group.gameId)
                throw new Error(
                    `template ${template.id} is grouped under ${group.gameId}, not ${template.gameId}`
                )
            if (!ids.has(template.id))
                throw new Error(
                    `game group ${group.gameId} contains an unregistered template: ${template.id}`
                )
            grouped.add(template.id)
        }
    }
    for (const template of templates) {
        if (!grouped.has(template.id))
            throw new Error(
                `template ${template.id} is missing from its game group`
            )
    }
}

assertTemplateRegistryIntegrity(templateRegistry, templatesByGame)

export const templateById = new Map(
    templateRegistry.map((template) => [template.id, template] as const)
)
