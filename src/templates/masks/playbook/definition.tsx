import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { MasksPlaybookAppearancePanel } from './editor/MasksPlaybookAppearancePanel'
import { MasksPlaybookEditorPanel } from './editor/MasksPlaybookEditorPanel'
import { MasksPlaybookImageExportSettings } from './editor/MasksPlaybookImageExportSettings'
import { getMasksPreviewWidth } from './hooks'
import type { ViewState } from './model'
import { MasksPlaybookPreview } from './preview/MasksPlaybookPreview'
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
        render: () => <MasksPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <MasksPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getMasksPreviewWidth(view),
        renderPanel: () => <MasksPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => <MasksPlaybookImageExportSettings />,
            }),
        ],
    },
}

export default template
