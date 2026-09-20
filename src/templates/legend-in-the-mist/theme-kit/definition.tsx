import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getLegendInTheMistThemeKitPreviewWidth } from './hooks'
import { themeKitSections } from './metadata'
import {
    blankLegendInTheMistThemeKit,
    defaultLegendInTheMistThemeKitSheetState,
    defaultLegendInTheMistThemeKitView,
    type LegendInTheMistThemeKit,
    type LegendInTheMistThemeKitViewState,
} from './model'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { getSampleLegendInTheMistThemeKit } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'legend.themeKit',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:themeKit.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/theme-kit',
    createBlank: blankLegendInTheMistThemeKit,
    createExample: getSampleLegendInTheMistThemeKit,
    createInitialView: () => cloneValue(defaultLegendInTheMistThemeKitView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistThemeKitSheetState),
    getTabTitle: (doc: LegendInTheMistThemeKit) =>
        doc.name.trim() || 'Theme Kit',
    sections: themeKitSections,
    landing: {
        newTitle: 'legend:themeKit.newTitle',
        description: 'legend:themeKit.description',
    },
    io: {
        importToml: (tomlText: string) => {
            const { legendInTheMistThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistThemeKit,
                warnings,
                previewName:
                    legendInTheMistThemeKit.name || 'Imported Theme Kit',
            }
        },
        exportToml: (doc: LegendInTheMistThemeKit) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeKitPreview />,
    },
    editor: {
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistThemeKitViewState) =>
            getLegendInTheMistThemeKitPreviewWidth(view),
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
