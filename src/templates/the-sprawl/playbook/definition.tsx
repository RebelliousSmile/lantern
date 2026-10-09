import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { SprawlPlaybookAppearancePanel } from './editor/SprawlPlaybookAppearancePanel'
import { SprawlPlaybookEditorPanel } from './editor/SprawlPlaybookEditorPanel'
import { SprawlPlaybookImageExportSettings } from './editor/SprawlPlaybookImageExportSettings'
import { getSprawlPreviewWidth } from './hooks'
import type { ViewState } from './model'
import { SprawlPlaybookPreview } from './preview/SprawlPlaybookPreview'
import staticDefinition from './static'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    ...staticDefinition,
    io: {
        importToml: (text) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(text)
            return { doc: playbook, warnings, previewName: playbook.name }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (id) => `[data-preview-root="${id}"]`,
        render: () => <SprawlPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <SprawlPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getSprawlPreviewWidth(view),
        renderPanel: () => <SprawlPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => <SprawlPlaybookImageExportSettings />,
            }),
        ],
    },
}

export default template
