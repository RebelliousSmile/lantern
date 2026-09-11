import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
import { CustomMoveAppearancePanel } from './editor/CustomMoveAppearancePanel'
import { CustomMoveEditorPanel } from './editor/CustomMoveEditorPanel'
import { CustomMoveImageExportSettings } from './editor/CustomMoveImageExportSettings'
import { getCityOfMistCustomMovePreviewWidth } from './hooks'
import { customMoveSections } from './metadata'
import {
    blankCityOfMistCustomMove,
    defaultCityOfMistCustomMoveSheetState,
    defaultCityOfMistCustomMoveView,
    type CityOfMistCustomMove,
    type CityOfMistCustomMoveViewState,
} from './model'
import { CustomMovePreview } from './preview/CustomMovePreview'
import { getSampleCityOfMistCustomMove } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

/* PNG is the only image the card exports, so the format is written in rather
   than passed in. */
function createImageExportAction() {
    return {
        id: 'png',
        label: 'PNG',
        buttonLabel: 'Export PNG',
        description: 'Export the current custom move card as PNG.',
        renderSettings: () => <CustomMoveImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: CityOfMistCustomMoveViewState
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

const customMoveTemplate: AnyTemplateDefinition = {
    id: 'city.customMove',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Custom Move',
    implemented: true,
    contractKey: 'mist/city-of-mist/custom-move',
    createBlank: blankCityOfMistCustomMove,
    createExample: getSampleCityOfMistCustomMove,
    createInitialView: () => cloneValue(defaultCityOfMistCustomMoveView),
    createInitialSheet: () => cloneValue(defaultCityOfMistCustomMoveSheetState),
    getTabTitle: (doc: CityOfMistCustomMove) =>
        doc.name.trim() || 'Custom Move',
    sections: customMoveSections,
    landing: {
        description:
            'A Custom Move is a rule the MC writes for one situation: what triggers it, what the players roll if they roll at all, and what each outcome does. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { cityOfMistCustomMove, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistCustomMove,
                warnings,
                previewName:
                    cityOfMistCustomMove.name || 'Imported Custom Move',
            }
        },
        exportToml: (doc: CityOfMistCustomMove) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <CustomMovePreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <CustomMoveEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: CityOfMistCustomMoveViewState) =>
            getCityOfMistCustomMovePreviewWidth(view),
        renderPanel: () => <CustomMoveAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current custom move data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: CityOfMistCustomMove
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

export default customMoveTemplate
