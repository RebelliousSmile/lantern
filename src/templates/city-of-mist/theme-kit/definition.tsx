import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
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

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'city.themeKit',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Theme Kit',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-kit',
    createBlank: blankThemeKit,
    createExample: getSampleThemeKit,
    createInitialView: () => cloneValue(defaultThemeKitView),
    createInitialSheet: () => cloneValue(defaultThemeKitSheetState),
    getTabTitle: (doc: ThemeKitDocument) => doc.name.trim() || 'Themebook',
    sections: themeKitSections,
    landing: {
        description:
            'A Theme Kit is a themebook: the blank questionnaire a player fills in to build a theme, with its lettered questions, its selection rules and its five improvements. The filled card is the separate Theme Card. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the page to edit a specific section.',
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ThemeKitViewState) =>
            getCityOfMistThemeKitPreviewWidth(view),
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current themebook data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: ThemeKitDocument
                    fileStem: string
                }) => {
                    try {
                        const toml = exportToTOML(doc)
                        const blob = new Blob([toml], {
                            type: 'text/plain;charset=utf-8',
                        })
                        const url = URL.createObjectURL(blob)
                        const anchor = document.createElement('a')
                        anchor.href = url
                        anchor.download = `${fileStem}.toml`
                        document.body.appendChild(anchor)
                        anchor.click()
                        anchor.remove()
                        URL.revokeObjectURL(url)
                        toast.success('Exported TOML.')
                    } catch (errorAny: any) {
                        toast.error(
                            errorAny?.message || 'Failed to export TOML.'
                        )
                    }
                },
            },
            createImageExportAction({
                description: 'Export the current themebook page as PNG.',
                renderSettings: () => <ThemeKitImageExportSettings />,
            }),
        ],
    },
}

export default themeKitTemplate
