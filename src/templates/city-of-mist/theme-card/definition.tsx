import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { themeCardDescriptor } from './descriptor'
import { ThemeCardAppearancePanel } from './editor/ThemeCardAppearancePanel'
import { ThemeCardEditorPanel } from './editor/ThemeCardEditorPanel'
import { ThemeCardImageExportSettings } from './editor/ThemeCardImageExportSettings'
import { getCityOfMistThemeCardPreviewWidth } from './hooks'
import { ThemeCardPreview } from './preview/ThemeCardPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeCardTemplate: AnyTemplateDefinition = {
    ...themeCardDescriptor,
    io: {
        importToml: (tomlText) => {
            const { cityOfMistThemeCard, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistThemeCard,
                warnings,
                previewName: cityOfMistThemeCard.title || 'Imported Theme Card',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeCardPreview />,
    },
    editor: { renderPanel: () => <ThemeCardEditorPanel /> },
    appearance: {
        getPreviewWidth: getCityOfMistThemeCardPreviewWidth,
        renderPanel: () => <ThemeCardAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:themeCard.exportToml',
            }),
            createImageExportAction({
                description: 'city:themeCard.exportPng',
                renderSettings: () => <ThemeCardImageExportSettings />,
            }),
        ],
    },
}

export default themeCardTemplate
