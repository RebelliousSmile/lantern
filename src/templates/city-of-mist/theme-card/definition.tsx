import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
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

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const themeCardTemplate: AnyTemplateDefinition = {
    id: 'city.themeCard',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Theme Card',
    implemented: true,
    contractKey: 'mist/city-of-mist/theme-card',
    createBlank: blankThemeCard,
    createExample: getSampleThemeCard,
    createInitialView: () => cloneValue(defaultThemeCardView),
    createInitialSheet: () => cloneValue(defaultThemeCardSheetState),
    getTabTitle: (doc: ThemeCardDocument) => doc.title.trim() || 'Theme Card',
    sections: themeCardSections,
    landing: {
        description:
            'Choose how to start this theme card: blank, example, or import from TOML.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ThemeCardEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ThemeCardViewState) =>
            getCityOfMistThemeCardPreviewWidth(view),
        renderPanel: () => <ThemeCardAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current theme card data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: ThemeCardDocument
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
                description: 'Export the current theme card preview as PNG.',
                renderSettings: () => <ThemeCardImageExportSettings />,
            }),
        ],
    },
}

export default themeCardTemplate
