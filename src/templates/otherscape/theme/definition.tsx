import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ThemeAppearancePanel } from './editor/ThemeAppearancePanel'
import { ThemeEditorPanel } from './editor/ThemeEditorPanel'
import { ThemeImageExportSettings } from './editor/ThemeImageExportSettings'
import { getOtherscapeThemePreviewWidth } from './hooks'
import { themeSections } from './metadata'
import {
    blankOtherscapeTheme,
    defaultOtherscapeThemeSheetState,
    defaultOtherscapeThemeView,
    type OtherscapeTheme,
    type OtherscapeThemeViewState,
} from './model'
import { ThemePreview } from './preview/ThemePreview'
import { getSampleOtherscapeTheme } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.theme',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:theme.label',
    implemented: true,
    contractKey: 'mist/otherscape/theme',
    createBlank: blankOtherscapeTheme,
    createExample: getSampleOtherscapeTheme,
    createInitialView: () => cloneValue(defaultOtherscapeThemeView),
    createInitialSheet: () => cloneValue(defaultOtherscapeThemeSheetState),
    getTabTitle: (doc: OtherscapeTheme) => doc.title_tag.trim() || 'Theme',
    sections: themeSections,
    landing: {
        newTitle: 'otherscape:theme.newTitle',
        description: 'otherscape:theme.description',
    },
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
