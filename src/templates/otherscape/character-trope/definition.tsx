import type { AnyTemplateDefinition } from '@/core/templates/types'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { toast } from 'sonner'
import { CharacterTropeAppearancePanel } from './editor/CharacterTropeAppearancePanel'
import { CharacterTropeEditorPanel } from './editor/CharacterTropeEditorPanel'
import { CharacterTropeImageExportSettings } from './editor/CharacterTropeImageExportSettings'
import { getOtherscapeCharacterTropePreviewWidth } from './hooks'
import { characterTropeSections } from './metadata'
import {
    blankOtherscapeCharacterTrope,
    defaultOtherscapeCharacterTropeSheetState,
    defaultOtherscapeCharacterTropeView,
    type OtherscapeCharacterTrope,
    type OtherscapeCharacterTropeViewState,
} from './model'
import { CharacterTropePreview } from './preview/CharacterTropePreview'
import { getSampleOtherscapeCharacterTrope } from './sample'
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
        description: `Export the current character trope preview as ${format.toUpperCase()}.`,
        renderSettings: () => <CharacterTropeImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: OtherscapeCharacterTropeViewState
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

const characterTropeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.characterTrope',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Character Trope',
    implemented: true,
    contractKey: 'mist/otherscape/character-trope',
    createBlank: blankOtherscapeCharacterTrope,
    createExample: getSampleOtherscapeCharacterTrope,
    createInitialView: () => cloneValue(defaultOtherscapeCharacterTropeView),
    createInitialSheet: () =>
        cloneValue(defaultOtherscapeCharacterTropeSheetState),
    getTabTitle: (doc: OtherscapeCharacterTrope) =>
        doc.name.trim() || 'Character Trope',
    sections: characterTropeSections,
    landing: {
        description:
            'A Character Trope is a ready-made character package: the theme kits it grants, the kits it offers a pick between, and the gear it starts with. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeCharacterTrope, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeCharacterTrope,
                warnings,
                previewName:
                    otherscapeCharacterTrope.name || 'Imported Character Trope',
            }
        },
        exportToml: (doc: OtherscapeCharacterTrope) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <CharacterTropePreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <CharacterTropeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeCharacterTropeViewState) =>
            getOtherscapeCharacterTropePreviewWidth(view),
        renderPanel: () => <CharacterTropeAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current character trope data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapeCharacterTrope
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

export default characterTropeTemplate
