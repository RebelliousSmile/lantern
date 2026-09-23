import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { UrbanShadowsPlaybookAppearancePanel } from './editor/UrbanShadowsPlaybookAppearancePanel'
import { UrbanShadowsPlaybookEditorPanel } from './editor/UrbanShadowsPlaybookEditorPanel'
import { UrbanShadowsPlaybookImageExportSettings } from './editor/UrbanShadowsPlaybookImageExportSettings'
import { getUrbanShadowsPreviewWidth } from './hooks'
import type { ViewState } from './model'
import { UrbanShadowsPlaybookPreview } from './preview/UrbanShadowsPlaybookPreview'
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
        render: () => <UrbanShadowsPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <UrbanShadowsPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getUrbanShadowsPreviewWidth(view),
        renderPanel: () => <UrbanShadowsPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => (
                    <UrbanShadowsPlaybookImageExportSettings />
                ),
            }),
        ],
    },
}
export default template
