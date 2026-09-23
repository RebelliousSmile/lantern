import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { MonsterheartsPlaybookAppearancePanel } from './editor/MonsterheartsPlaybookAppearancePanel'
import { MonsterheartsPlaybookEditorPanel } from './editor/MonsterheartsPlaybookEditorPanel'
import { MonsterheartsPlaybookImageExportSettings } from './editor/MonsterheartsPlaybookImageExportSettings'
import { MonsterheartsPlaybookPreview } from './preview/MonsterheartsPlaybookPreview'
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
        render: () => <MonsterheartsPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <MonsterheartsPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 1123,
        renderPanel: () => <MonsterheartsPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:monsterhearts.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:monsterhearts.exportPng',
                renderSettings: () => (
                    <MonsterheartsPlaybookImageExportSettings />
                ),
            }),
        ],
    },
}
export default template
