import type { StaticTemplateDefinition } from '@/core/templates/types'
import { theSprawlSections } from './metadata'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type TheSprawlPlaybook,
    type ViewState,
} from './model'
import { getSampleTheSprawlPlaybook } from './sample'

const clone = <T>(value: T): T => structuredClone(value)

export const staticDefinition: StaticTemplateDefinition<
    TheSprawlPlaybook,
    ViewState,
    typeof defaultSheet
> = {
    id: 'the-sprawl.playbook',
    gameId: 'the-sprawl',
    gameLabel: 'The Sprawl',
    label: 'pbta:playbook.label',
    implemented: true,
    contractKey: 'pbta/the-sprawl-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleTheSprawlPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc) => doc.name || 'The Sprawl Playbook',
    sections: theSprawlSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: {
            key: 'pbta:specialized.description',
            values: { game: 'The Sprawl' },
        },
    },
}

export default staticDefinition
