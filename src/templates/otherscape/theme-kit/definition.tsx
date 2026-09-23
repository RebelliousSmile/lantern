import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapeThemeKitPreviewWidth } from './hooks'
import type { OtherscapeThemeKit, OtherscapeThemeKitViewState } from './model'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeThemeKit,
                warnings,
                previewName:
                    otherscapeThemeKit.title_tag || 'Imported Theme Kit',
            }
        },
        exportToml: (doc: OtherscapeThemeKit) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeKitPreview />,
    },
    editor: {
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeThemeKitViewState) =>
            getOtherscapeThemeKitPreviewWidth(view),
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:themeKit.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:themeKit.exportPng',
                renderSettings: () => <ThemeKitImageExportSettings />,
            }),
        ],
    },
}

export default themeKitTemplate
