import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { themeKitDescriptor } from './descriptor'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getLegendInTheMistThemeKitPreviewWidth } from './hooks'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    ...themeKitDescriptor,
    io: {
        importToml: (tomlText) => {
            const { legendInTheMistThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistThemeKit,
                warnings,
                previewName:
                    legendInTheMistThemeKit.name || 'Imported Theme Kit',
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
        getPreviewWidth: getLegendInTheMistThemeKitPreviewWidth,
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'legend:themeKit.exportToml',
            }),
            createImageExportAction({
                description: 'legend:themeKit.exportPng',
                renderSettings: () => <ThemeKitImageExportSettings />,
            }),
        ],
    },
}

export default themeKitTemplate
