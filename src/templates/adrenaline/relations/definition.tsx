import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import descriptor from './descriptor'
import { RelationsEditorPanel } from './editor/RelationsEditorPanel'
import { RelationsPreview } from './preview/RelationsPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (source) => {
            const result = importFromTOMLWithWarnings(source)
            return { doc: result.relations, warnings: result.warnings }
        },
        exportToml: (doc) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <RelationsPreview />,
    },
    editor: {
        renderPanel: () => <RelationsEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'adrenaline:relations.exportToml',
            }),
            createImageExportAction({
                description: 'adrenaline:relations.exportPng',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
