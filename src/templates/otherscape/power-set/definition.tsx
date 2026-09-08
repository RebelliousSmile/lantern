import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
import { PowerSetAppearancePanel } from './editor/PowerSetAppearancePanel'
import { PowerSetEditorPanel } from './editor/PowerSetEditorPanel'
import { PowerSetImageExportSettings } from './editor/PowerSetImageExportSettings'
import { getOtherscapePowerSetPreviewWidth } from './hooks'
import { powerSetSections } from './metadata'
import {
    blankOtherscapePowerSet,
    defaultOtherscapePowerSetSheetState,
    defaultOtherscapePowerSetView,
    type OtherscapePowerSet,
    type OtherscapePowerSetViewState,
} from './model'
import { PowerSetPreview } from './preview/PowerSetPreview'
import { getSampleOtherscapePowerSet } from './sample'
import { OtherscapePowerSetSchema } from './schema'
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
        description: `Export the current power set preview as ${format.toUpperCase()}.`,
        renderSettings: () => <PowerSetImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: OtherscapePowerSetViewState
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

const powerSetTemplate: AnyTemplateDefinition = {
    id: 'otherscape.powerSet',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Power Set',
    implemented: true,
    schema: OtherscapePowerSetSchema,
    createBlank: blankOtherscapePowerSet,
    createExample: getSampleOtherscapePowerSet,
    createInitialView: () => cloneValue(defaultOtherscapePowerSetView),
    createInitialSheet: () => cloneValue(defaultOtherscapePowerSetSheetState),
    getTabTitle: (doc: OtherscapePowerSet) => doc.name.trim() || 'Power Set',
    sections: powerSetSections,
    landing: {
        description:
            'A Power Set is a bundle of Specials, Threats and Consequences drawn from the Self, the Mythos or the Noise, published on its own and grafted onto any Challenge. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { otherscapePowerSet, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapePowerSet,
                warnings,
                previewName: otherscapePowerSet.name || 'Imported Power Set',
            }
        },
        exportToml: (doc: OtherscapePowerSet) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <PowerSetPreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <PowerSetEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapePowerSetViewState) =>
            getOtherscapePowerSetPreviewWidth(view),
        renderPanel: () => <PowerSetAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current power set data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapePowerSet
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

export default powerSetTemplate
