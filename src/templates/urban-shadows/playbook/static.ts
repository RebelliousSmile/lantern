import type { StaticTemplateDefinition } from '@/core/templates/types'
import { urbanShadowsSections } from './metadata'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type UrbanShadowsPlaybook,
    type ViewState,
} from './model'
import { getSampleUrbanShadowsPlaybook } from './sample'

const clone = <T>(value: T): T => structuredClone(value)

export const staticDefinition: StaticTemplateDefinition<
    UrbanShadowsPlaybook,
    ViewState,
    typeof defaultSheet
> = {
    id: 'urban-shadows.playbook',
    gameId: 'urban-shadows',
    gameLabel: 'Urban Shadows',
    label: 'pbta:playbook.label',
    implemented: true,
    contractKey: 'pbta/urban-shadows-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleUrbanShadowsPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc) => doc.name || 'Urban Shadows Playbook',
    sections: urbanShadowsSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: {
            key: 'pbta:specialized.description',
            values: { game: 'Urban Shadows' },
        },
    },
}

export default staticDefinition
