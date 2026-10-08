import type { StaticTemplateDefinition } from '@/core/templates/types'
import { monsterOfTheWeekSections } from './metadata'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type MonsterOfTheWeekPlaybook,
    type ViewState,
} from './model'
import { getSampleMonsterOfTheWeekPlaybook } from './sample'

const clone = <T>(value: T): T => structuredClone(value)

export const staticDefinition: StaticTemplateDefinition<
    MonsterOfTheWeekPlaybook,
    ViewState,
    typeof defaultSheet
> = {
    id: 'monster-of-the-week.playbook',
    gameId: 'monster-of-the-week',
    gameLabel: 'Monster of the Week',
    label: 'pbta:playbook.label',
    implemented: true,
    contractKey: 'pbta/monster-of-the-week-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleMonsterOfTheWeekPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc) => doc.name || 'Monster of the Week Playbook',
    sections: monsterOfTheWeekSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: {
            key: 'pbta:specialized.description',
            values: { game: 'Monster of the Week' },
        },
    },
}

export default staticDefinition
