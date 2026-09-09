import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
import { ThemeCardAppearancePanel } from './editor/ThemeCardAppearancePanel'
import { ThemeCardEditorPanel } from './editor/ThemeCardEditorPanel'
import { ThemeCardImageExportSettings } from './editor/ThemeCardImageExportSettings'
import { getCityOfMistThemeCardPreviewWidth } from './hooks'
import { themeCardSections } from './metadata'
import {
    blankCityOfMistThemeCard,
    defaultCityOfMistThemeCardSheetState,
    defaultCityOfMistThemeCardView,
    type CityOfMistThemeCard,
    type CityOfMistThemeCardViewState,
} from './model'
import { ThemeCardPreview } from './preview/ThemeCardPreview'
import { getSampleCityOfMistThemeCard } from './sample'
import { CityOfMistThemeCardSchema } from './schema'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function createImageExportAction() {
    return {
        id: 'png',
        label: 'PNG',
        buttonLabel: 'Export PNG',
        description: 'Export the current theme card preview as PNG.',
        renderSettings: () => <ThemeCardImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: CityOfMistThemeCardViewState
        }) => {
            const node = getPreviewNode()
            if (!node) {
                toast.error(
                    'Preview not found. Make sure the preview is visible.'
                )
                return
            }

            node.classList.add('exporting')
            try {
                const pixelRatio = Number(view.exportPrefs.scale) || 1
                const snap: CaptureResult = await snapdom(node, {
                    scale: pixelRatio,
                    embedFonts: true,
                })

                await snap.download({
                    type: 'png',
                    filename: `${fileStem}@${pixelRatio}x.png`,
                })
                toast.success('Exported PNG.')
            } catch (errorAny: any) {
                toast.error(errorAny?.message || 'Failed to export PNG.')
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}

const themeCardTemplate: AnyTemplateDefinition = {
    id: 'city.themeCard',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Theme Card',
    implemented: true,
    schema: CityOfMistThemeCardSchema,
    createBlank: blankCityOfMistThemeCard,
    createExample: getSampleCityOfMistThemeCard,
    createInitialView: () => cloneValue(defaultCityOfMistThemeCardView),
    createInitialSheet: () => cloneValue(defaultCityOfMistThemeCardSheetState),
    getTabTitle: (doc: CityOfMistThemeCard) =>
        doc.title.trim() || 'Theme Card',
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
                previewName:
                    cityOfMistThemeCard.title || 'Imported Theme Card',
            }
        },
        exportToml: (doc: CityOfMistThemeCard) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) =>
            `[data-preview-root="${tabId}"]`,
        render: () => <ThemeCardPreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ThemeCardEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: CityOfMistThemeCardViewState) =>
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
                    doc: CityOfMistThemeCard
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
            createImageExportAction(),
        ],
    },
}

export default themeCardTemplate
