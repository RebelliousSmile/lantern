import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { PlaybookAppearancePanel } from './editor/PlaybookAppearancePanel'
import { PlaybookEditorPanel } from './editor/PlaybookEditorPanel'
import { PlaybookImageExportSettings } from './editor/PlaybookImageExportSettings'
import { getPlaybookPreviewWidth } from './hooks'
import type { PlaybookViewState } from './model'
import { PlaybookPreview } from './preview/PlaybookPreview'
import staticDefinition from './static'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const playbookTemplate: AnyTemplateDefinition = {
    ...staticDefinition,
    io: {
        importToml: (tomlText) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(tomlText)
            return {
                doc: playbook,
                warnings,
                previewName: playbook.name || 'Imported Playbook',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <PlaybookPreview />,
    },
    editor: {
        renderPanel: () => <PlaybookEditorPanel />,
        schema: staticDefinition.editorSchema,
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
