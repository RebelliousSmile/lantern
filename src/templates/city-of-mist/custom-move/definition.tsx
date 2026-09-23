import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { customMoveDescriptor } from './descriptor'
import { CustomMoveAppearancePanel } from './editor/CustomMoveAppearancePanel'
import { CustomMoveEditorPanel } from './editor/CustomMoveEditorPanel'
import { CustomMoveImageExportSettings } from './editor/CustomMoveImageExportSettings'
import { getCityOfMistCustomMovePreviewWidth } from './hooks'
import { CustomMovePreview } from './preview/CustomMovePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const customMoveTemplate: AnyTemplateDefinition = {
    ...customMoveDescriptor,
    io: {
        importToml: (tomlText) => {
            const { cityOfMistCustomMove, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistCustomMove,
                warnings,
                previewName:
                    cityOfMistCustomMove.name || 'Imported Custom Move',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <CustomMovePreview />,
    },
    editor: { renderPanel: () => <CustomMoveEditorPanel /> },
    appearance: {
        getPreviewWidth: getCityOfMistCustomMovePreviewWidth,
        renderPanel: () => <CustomMoveAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:customMove.exportToml',
            }),
            createImageExportAction({
                description: 'city:customMove.exportPng',
                renderSettings: () => <CustomMoveImageExportSettings />,
            }),
        ],
    },
}

export default customMoveTemplate
