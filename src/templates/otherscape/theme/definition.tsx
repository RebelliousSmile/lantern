import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
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
import { OtherscapeThemeSchema } from './schema'
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
        description: `Export the current theme card as ${format.toUpperCase()}.`,
        renderSettings: () => <ThemeImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: OtherscapeThemeViewState
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

const themeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.theme',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Theme',
    implemented: true,
    schema: OtherscapeThemeSchema,
    createBlank: blankOtherscapeTheme,
    createExample: getSampleOtherscapeTheme,
    createInitialView: () => cloneValue(defaultOtherscapeThemeView),
    createInitialSheet: () => cloneValue(defaultOtherscapeThemeSheetState),
    getTabTitle: (doc: OtherscapeTheme) => doc.title_tag.trim() || 'Theme',
    sections: themeSections,
    landing: {
        description:
            'A Theme is a card a character has made their own: a title tag, the theme type it belongs to, its power and weakness tags, the quest it sets, and the Upgrade and Decay tracks holding how far it has been played. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ThemeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeThemeViewState) =>
            getOtherscapeThemePreviewWidth(view),
        renderPanel: () => <ThemeAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current theme data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapeTheme
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

export default themeTemplate
