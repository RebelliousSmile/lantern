import type { StaticTemplateDefinition } from '@/core/templates/types'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    sections,
    type MonsterheartsPlaybook,
} from './model'
import { getSampleMonsterheartsPlaybook } from './sample'

const clone = <T>(value: T): T => structuredClone(value)

export const staticDefinition: StaticTemplateDefinition<
    MonsterheartsPlaybook,
    typeof defaultView,
    typeof defaultSheet
> = {
    id: 'monsterhearts.playbook',
    gameId: 'monsterhearts',
    gameLabel: 'Monsterhearts',
    label: 'pbta:monsterhearts.label',
    implemented: true,
    contractKey: 'pbta/monsterhearts-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleMonsterheartsPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc) => doc.name,
    sections,
    landing: {
        newTitle: 'pbta:monsterhearts.newTitle',
        description: 'pbta:monsterhearts.description',
    },
}

export default staticDefinition
