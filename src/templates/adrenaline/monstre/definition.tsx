import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import descriptor from './descriptor'
import { MonstreEditorPanel } from './editor/MonstreEditorPanel'
import { MonstrePreview } from './preview/MonstrePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (source) => {
            const result = importFromTOMLWithWarnings(source)
            return { doc: result.monstre, warnings: result.warnings }
        },
        exportToml: (doc) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <MonstrePreview />,
    },
    editor: {
        renderPanel: () => <MonstreEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'adrenaline:monstre.exportToml',
            }),
            createImageExportAction({
                description: 'adrenaline:monstre.exportPng',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
