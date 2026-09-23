import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { dangerDescriptor } from './descriptor'
import { DangerAppearancePanel } from './editor/DangerAppearancePanel'
import { DangerEditorPanel } from './editor/DangerEditorPanel'
import { DangerImageExportSettings } from './editor/DangerImageExportSettings'
import { getCityOfMistDangerPreviewWidth } from './hooks'
import { DangerPreview } from './preview/DangerPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const dangerTemplate: AnyTemplateDefinition = {
    ...dangerDescriptor,
    io: {
        importToml: (tomlText) => {
            const { cityOfMistDanger, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistDanger,
                warnings,
                previewName: cityOfMistDanger.name || 'Imported Danger',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <DangerPreview />,
    },
    editor: { renderPanel: () => <DangerEditorPanel /> },
    appearance: {
        getPreviewWidth: getCityOfMistDangerPreviewWidth,
        renderPanel: () => <DangerAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:danger.exportToml',
            }),
            createImageExportAction({
                description: 'city:danger.exportPng',
                renderSettings: () => <DangerImageExportSettings />,
            }),
        ],
    },
}

export default dangerTemplate
