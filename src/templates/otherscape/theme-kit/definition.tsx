import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getOtherscapeThemeKitPreviewWidth } from './hooks'
import { themeKitSections } from './metadata'
import {
    blankOtherscapeThemeKit,
    defaultOtherscapeThemeKitSheetState,
    defaultOtherscapeThemeKitView,
    type OtherscapeThemeKit,
    type OtherscapeThemeKitViewState,
} from './model'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { getSampleOtherscapeThemeKit } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'otherscape.themeKit',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:themeKit.label',
    implemented: true,
    contractKey: 'mist/otherscape/theme-kit',
    createBlank: blankOtherscapeThemeKit,
    createExample: getSampleOtherscapeThemeKit,
    createInitialView: () => cloneValue(defaultOtherscapeThemeKitView),
    createInitialSheet: () => cloneValue(defaultOtherscapeThemeKitSheetState),
    getTabTitle: (doc: OtherscapeThemeKit) =>
        doc.title_tag.trim() || 'Theme Kit',
    sections: themeKitSections,
    landing: {
        newTitle: 'otherscape:themeKit.newTitle',
        description: 'otherscape:themeKit.description',
    },
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
