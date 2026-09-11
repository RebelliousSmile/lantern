import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
import { LoadoutItemAppearancePanel } from './editor/LoadoutItemAppearancePanel'
import { LoadoutItemEditorPanel } from './editor/LoadoutItemEditorPanel'
import { LoadoutItemImageExportSettings } from './editor/LoadoutItemImageExportSettings'
import { getOtherscapeLoadoutItemPreviewWidth } from './hooks'
import { loadoutItemSections } from './metadata'
import {
    blankOtherscapeLoadoutItem,
    defaultOtherscapeLoadoutItemSheetState,
    defaultOtherscapeLoadoutItemView,
    type OtherscapeLoadoutItem,
    type OtherscapeLoadoutItemViewState,
} from './model'
import { LoadoutItemPreview } from './preview/LoadoutItemPreview'
import { getSampleOtherscapeLoadoutItem } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function createImageExportAction(format: 'png') {
    return {
        id: format,
        label: format.toUpperCase(),
        buttonLabel: `Export ${format.toUpperCase()}`,
        description: `Export the current loadout item card as ${format.toUpperCase()}.`,
        renderSettings: () => <LoadoutItemImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: OtherscapeLoadoutItemViewState
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
                    type: format,
                    filename: `${fileStem}@${pixelRatio}x.${format}`,
                })

                toast.success(`Exported ${format.toUpperCase()}.`)
            } catch (errorAny: any) {
                toast.error(
                    errorAny?.message ||
                        `Failed to export ${format.toUpperCase()}.`
                )
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}

const loadoutItemTemplate: AnyTemplateDefinition = {
    id: 'otherscape.loadoutItem',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Loadout Item',
    implemented: true,
    contractKey: 'mist/otherscape/loadout-item',
    createBlank: blankOtherscapeLoadoutItem,
    createExample: getSampleOtherscapeLoadoutItem,
    createInitialView: () => cloneValue(defaultOtherscapeLoadoutItemView),
    createInitialSheet: () =>
        cloneValue(defaultOtherscapeLoadoutItemSheetState),
    getTabTitle: (doc: OtherscapeLoadoutItem) =>
        doc.name.trim() || 'Loadout Item',
    sections: loadoutItemSections,
    landing: {
        description:
            'A Loadout Item is one entry of the Street Catalog: its name, the rubric it is filed under, the prose the catalog prints, the tags it grants, and the one tag it turns against its bearer. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeLoadoutItem, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeLoadoutItem,
                warnings,
                previewName:
                    otherscapeLoadoutItem.name || 'Imported Loadout Item',
            }
        },
        exportToml: (doc: OtherscapeLoadoutItem) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <LoadoutItemPreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <LoadoutItemEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeLoadoutItemViewState) =>
            getOtherscapeLoadoutItemPreviewWidth(view),
        renderPanel: () => <LoadoutItemAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current loadout item data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapeLoadoutItem
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
            createImageExportAction('png'),
        ],
    },
}

export default loadoutItemTemplate
