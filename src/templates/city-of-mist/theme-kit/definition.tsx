import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { themeKitDescriptor } from './descriptor'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getCityOfMistThemeKitPreviewWidth } from './hooks'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    ...themeKitDescriptor,
    io: {
        importToml: (tomlText) => {
            const { cityOfMistThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistThemeKit,
                warnings,
                previewName: cityOfMistThemeKit.name || 'Imported Themebook',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeKitPreview />,
    },
    editor: { renderPanel: () => <ThemeKitEditorPanel /> },
    appearance: {
        getPreviewWidth: getCityOfMistThemeKitPreviewWidth,
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:themeKit.exportToml',
            }),
            createImageExportAction({
                description: 'city:themeKit.exportPng',
                renderSettings: () => <ThemeKitImageExportSettings />,
            }),
        ],
    },
}

export default themeKitTemplate
