import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { MotwPlaybookAppearancePanel } from './editor/MotwPlaybookAppearancePanel'
import { MotwPlaybookEditorPanel } from './editor/MotwPlaybookEditorPanel'
import { MotwPlaybookImageExportSettings } from './editor/MotwPlaybookImageExportSettings'
import { getMotwPreviewWidth } from './hooks'
import type { ViewState } from './model'
import { MotwPlaybookPreview } from './preview/MotwPlaybookPreview'
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
        render: () => <MotwPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <MotwPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getMotwPreviewWidth(view),
        renderPanel: () => <MotwPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => <MotwPlaybookImageExportSettings />,
            }),
        ],
    },
}

export default template
