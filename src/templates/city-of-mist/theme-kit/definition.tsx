import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getCityOfMistThemeKitPreviewWidth } from './hooks'
import { themeKitSections } from './metadata'
import {
    blankThemeKit,
    defaultThemeKitSheetState,
    defaultThemeKitView,
    type ThemeKitDocument,
    type ThemeKitViewState,
} from './model'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { getSampleThemeKit } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'city.themeKit',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:themeKit.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-kit',
    createBlank: blankThemeKit,
    createExample: getSampleThemeKit,
    createInitialView: () => cloneValue(defaultThemeKitView),
    createInitialSheet: () => cloneValue(defaultThemeKitSheetState),
    getTabTitle: (doc: ThemeKitDocument) => doc.name.trim() || 'Themebook',
    sections: themeKitSections,
    landing: {
        newTitle: 'city:themeKit.newTitle',
        description: 'city:themeKit.description',
    },
    io: {
        importToml: (tomlText: string) => {
            const { cityOfMistThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistThemeKit,
                warnings,
                previewName: cityOfMistThemeKit.name || 'Imported Themebook',
            }
        },
        exportToml: (doc: ThemeKitDocument) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeKitPreview />,
    },
    editor: {
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ThemeKitViewState) =>
            getCityOfMistThemeKitPreviewWidth(view),
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
