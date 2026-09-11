import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
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
        description: `Export the current theme kit card as ${format.toUpperCase()}.`,
        renderSettings: () => <ThemeKitImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: OtherscapeThemeKitViewState
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

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'otherscape.themeKit',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Theme Kit',
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
        description:
            'A Theme Kit is the card a themebook offers a character: a title tag, the theme type it belongs to, the power and weakness tags it suggests, and the quest it sets. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeThemeKitViewState) =>
            getOtherscapeThemeKitPreviewWidth(view),
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current theme kit data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapeThemeKit
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

export default themeKitTemplate
