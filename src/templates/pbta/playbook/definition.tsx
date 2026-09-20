import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { PlaybookAppearancePanel } from './editor/PlaybookAppearancePanel'
import { PlaybookEditorPanel } from './editor/PlaybookEditorPanel'
import { PlaybookImageExportSettings } from './editor/PlaybookImageExportSettings'
import { playbookEditorSchema } from './editorSchema'
import { getPlaybookPreviewWidth } from './hooks'
import { playbookSections } from './metadata'
import {
    blankPlaybook,
    defaultPlaybookSheetState,
    defaultPlaybookView,
    type PbtaPlaybook,
    type PlaybookViewState,
} from './model'
import { PlaybookPreview } from './preview/PlaybookPreview'
import { getSamplePbtaPlaybook } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const playbookTemplate: AnyTemplateDefinition = {
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
    getTabTitle: (doc: PbtaPlaybook) => doc.name.trim() || 'Playbook',
    sections: playbookSections,
    landing: {
        newTitle: 'pbta:playbook.newTitle',
        description: 'pbta:playbook.description',
    },
    io: {
        importToml: (tomlText: string) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(tomlText)
            return {
                doc: playbook,
                warnings,
                previewName: playbook.name || 'Imported Playbook',
            }
        },
        exportToml: (doc: PbtaPlaybook) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <PlaybookPreview />,
    },
    editor: {
        renderPanel: () => <PlaybookEditorPanel />,
        schema: playbookEditorSchema,
    },
    appearance: {
        getPreviewWidth: (view: PlaybookViewState) =>
            getPlaybookPreviewWidth(view),
        renderPanel: () => <PlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => <PlaybookImageExportSettings />,
            }),
        ],
    },
}

export default playbookTemplate
