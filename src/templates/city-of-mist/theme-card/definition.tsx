import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ThemeCardAppearancePanel } from './editor/ThemeCardAppearancePanel'
import { ThemeCardEditorPanel } from './editor/ThemeCardEditorPanel'
import { ThemeCardImageExportSettings } from './editor/ThemeCardImageExportSettings'
import { getCityOfMistThemeCardPreviewWidth } from './hooks'
import { themeCardSections } from './metadata'
import {
    blankThemeCard,
    defaultThemeCardSheetState,
    defaultThemeCardView,
    type ThemeCardDocument,
    type ThemeCardViewState,
} from './model'
import { ThemeCardPreview } from './preview/ThemeCardPreview'
import { getSampleThemeCard } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const themeCardTemplate: AnyTemplateDefinition = {
    id: 'city.themeCard',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:themeCard.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-card',
    createBlank: blankThemeCard,
    createExample: getSampleThemeCard,
    createInitialView: () => cloneValue(defaultThemeCardView),
    createInitialSheet: () => cloneValue(defaultThemeCardSheetState),
    getTabTitle: (doc: ThemeCardDocument) => doc.title.trim() || 'Theme Card',
    sections: themeCardSections,
    landing: {
        newTitle: 'city:themeCard.newTitle',
        description: 'city:themeCard.description',
    },
    io: {
        importToml: (tomlText: string) => {
            const { cityOfMistThemeCard, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistThemeCard,
                warnings,
                previewName: cityOfMistThemeCard.title || 'Imported Theme Card',
            }
        },
        exportToml: (doc: ThemeCardDocument) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeCardPreview />,
    },
    editor: {
        renderPanel: () => <ThemeCardEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ThemeCardViewState) =>
            getCityOfMistThemeCardPreviewWidth(view),
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
