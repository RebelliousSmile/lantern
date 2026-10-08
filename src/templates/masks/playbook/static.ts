import type { StaticTemplateDefinition } from '@/core/templates/types'
import { masksSections } from './metadata'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type MasksPlaybook,
    type ViewState,
} from './model'
import { getSampleMasksPlaybook } from './sample'

const clone = <T>(value: T): T => structuredClone(value)

export const staticDefinition: StaticTemplateDefinition<
    MasksPlaybook,
    ViewState,
    typeof defaultSheet
> = {
    id: 'masks.playbook',
    gameId: 'masks',
    gameLabel: 'Masks',
    label: 'pbta:playbook.label',
    implemented: true,
    contractKey: 'pbta/masks-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleMasksPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc) => doc.name || 'Masks Playbook',
    sections: masksSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: {
            key: 'pbta:specialized.description',
            values: { game: 'Masks' },
        },
    },
}

export default staticDefinition
