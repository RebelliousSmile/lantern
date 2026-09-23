import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { playbookEditorSchema } from './editorSchema'
import { playbookSections } from './metadata'
import {
    blankPlaybook,
    defaultPlaybookSheetState,
    defaultPlaybookView,
    type PbtaPlaybook,
    type PlaybookViewState,
} from './model'
import { getSamplePbtaPlaybook } from './sample'

export const staticDefinition: StaticTemplateDefinition<
    PbtaPlaybook,
    PlaybookViewState,
    typeof defaultPlaybookSheetState
> = {
    id: 'pbta.playbook',
    gameId: 'apocalypse-world',
    gameLabel: 'Apocalypse World',
    label: 'pbta:playbook.label',
    implemented: true,
    contractKey: 'pbta/playbook',
    createBlank: blankPlaybook,
    createExample: getSamplePbtaPlaybook,
    createInitialView: () => cloneValue(defaultPlaybookView),
    createInitialSheet: () => cloneValue(defaultPlaybookSheetState),
    getTabTitle: (doc) => doc.name.trim() || 'Playbook',
    sections: playbookSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: 'pbta:playbook.description',
    },
    editorSchema: playbookEditorSchema,
}

export default staticDefinition
