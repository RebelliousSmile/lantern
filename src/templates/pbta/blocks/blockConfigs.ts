import masksNpc from 'schema-pbta/packs/masks/npc-presentation-contract.json'
import motwMonster from 'schema-pbta/packs/monster-of-the-week/monster-presentation-contract.json'
import motwTeam from 'schema-pbta/packs/monster-of-the-week/team-presentation-contract.json'
import motwThreat from 'schema-pbta/packs/monster-of-the-week/threat-presentation-contract.json'
import sprawlCorporation from 'schema-pbta/packs/the-sprawl/corporation-presentation-contract.json'
import sprawlMatrix from 'schema-pbta/packs/the-sprawl/matrix-presentation-contract.json'
import sprawlMission from 'schema-pbta/packs/the-sprawl/mission-presentation-contract.json'
import sprawlResource from 'schema-pbta/packs/the-sprawl/resource-presentation-contract.json'
import sprawlThreat from 'schema-pbta/packs/the-sprawl/threat-presentation-contract.json'
import type { SpecializedPlaybookConfig } from '../specialized/staticDefinitionFactory'
import { BLOCK_SAMPLES } from './blockSamples'

type Contract = {
    target: string
    regions: Array<{ id: string; label: string; fields: string[] }>
    canonicalOrder: string[]
}

type BlockSpec = {
    /** Template id, `<game>.<block>`. */
    id: string
    gameId: string
    gameLabel: string
    label: string
    newTitle: string
    contract: Contract
}

/*
 * One entry per block a pack publishes besides its playbook. Format and
 * presentation come from the pack: the regions, their order and their labels
 * are the published presentation contract, never restated here.
 */
const BLOCK_SPECS: BlockSpec[] = [
    {
        id: 'masks.npc',
        gameId: 'masks',
        gameLabel: 'Masks',
        label: 'PNJ',
        newTitle: 'Nouveau PNJ',
        contract: masksNpc,
    },
    {
        id: 'monster-of-the-week.monster',
        gameId: 'monster-of-the-week',
        gameLabel: 'Monster of the Week',
        label: 'Monstre',
        newTitle: 'Nouveau monstre',
        contract: motwMonster,
    },
    {
        id: 'monster-of-the-week.threat',
        gameId: 'monster-of-the-week',
        gameLabel: 'Monster of the Week',
        label: 'Menace',
        newTitle: 'Nouvelle menace',
        contract: motwThreat,
    },
    {
        id: 'monster-of-the-week.team',
        gameId: 'monster-of-the-week',
        gameLabel: 'Monster of the Week',
        label: 'Équipe',
        newTitle: 'Nouvelle équipe',
        contract: motwTeam,
    },
    {
        id: 'the-sprawl.mission',
        gameId: 'the-sprawl',
        gameLabel: 'The Sprawl',
        label: 'Mission',
        newTitle: 'Nouvelle mission',
        contract: sprawlMission,
    },
    {
        id: 'the-sprawl.threat',
        gameId: 'the-sprawl',
        gameLabel: 'The Sprawl',
        label: 'Menace',
        newTitle: 'Nouvelle menace',
        contract: sprawlThreat,
    },
    {
        id: 'the-sprawl.resource',
        gameId: 'the-sprawl',
        gameLabel: 'The Sprawl',
        label: 'Ressource',
        newTitle: 'Nouvelle ressource',
        contract: sprawlResource,
    },
    {
        id: 'the-sprawl.corporation',
        gameId: 'the-sprawl',
        gameLabel: 'The Sprawl',
        label: 'Corporation',
        newTitle: 'Nouvelle corporation',
        contract: sprawlCorporation,
    },
    {
        id: 'the-sprawl.matrix',
        gameId: 'the-sprawl',
        gameLabel: 'The Sprawl',
        label: 'Matrice',
        newTitle: 'Nouvelle matrice',
        contract: sprawlMatrix,
    },
]

export type BlockConfig = SpecializedPlaybookConfig & {
    example: Record<string, unknown>
}

function configOf(spec: BlockSpec): BlockConfig {
    const samples = BLOCK_SAMPLES[spec.contract.target]
    const byId = new Map(spec.contract.regions.map((r) => [r.id, r] as const))
    return {
        id: spec.id,
        gameId: spec.gameId,
        gameLabel: spec.gameLabel,
        label: { text: spec.label },
        newTitle: { text: spec.newTitle },
        contractKey: `pbta/${spec.contract.target}`,
        sections: spec.contract.canonicalOrder.flatMap((regionId) => {
            const region = byId.get(regionId)
            return region
                ? [
                      {
                          id: region.id,
                          label: { text: region.label },
                          fields: region.fields,
                      },
                  ]
                : []
        }),
        blank: samples.blank,
        example: samples.example,
    }
}

export const BLOCK_CONFIGS: BlockConfig[] = BLOCK_SPECS.map(configOf)

export const blockConfigById = (id: string): BlockConfig => {
    const config = BLOCK_CONFIGS.find((candidate) => candidate.id === id)
    if (!config) throw new Error(`unknown PbtA block template: ${id}`)
    return config
}
