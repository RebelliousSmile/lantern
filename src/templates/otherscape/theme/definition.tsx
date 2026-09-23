import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { ThemeAppearancePanel } from './editor/ThemeAppearancePanel'
import { ThemeEditorPanel } from './editor/ThemeEditorPanel'
import { ThemeImageExportSettings } from './editor/ThemeImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapeThemePreviewWidth } from './hooks'
import type { OtherscapeTheme, OtherscapeThemeViewState } from './model'
import { ThemePreview } from './preview/ThemePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeTheme, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeTheme,
                warnings,
                previewName: otherscapeTheme.title_tag || 'Imported Theme',
            }
        },
        exportToml: (doc: OtherscapeTheme) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemePreview />,
    },
    editor: {
        renderPanel: () => <ThemeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeThemeViewState) =>
            getOtherscapeThemePreviewWidth(view),
        renderPanel: () => <ThemeAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:theme.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:theme.exportPng',
                renderSettings: () => <ThemeImageExportSettings />,
            }),
        ],
    },
}

export default themeTemplate
