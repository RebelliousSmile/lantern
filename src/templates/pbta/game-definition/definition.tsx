import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { GameDefinitionAppearancePanel } from './editor/GameDefinitionAppearancePanel'
import { GameDefinitionEditorPanel } from './editor/GameDefinitionEditorPanel'
import { GameDefinitionImageExportSettings } from './editor/GameDefinitionImageExportSettings'
import { getGameDefinitionPreviewWidth } from './hooks'
import { gameDefinitionSections } from './metadata'
import {
    blankGameDefinition,
    defaultGameDefinitionSheetState,
    defaultGameDefinitionView,
    type GameDefinitionViewState,
    type PbtaGameDefinition,
} from './model'
import { GameDefinitionPreview } from './preview/GameDefinitionPreview'
import { getSamplePbtaGameDefinition } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }
    return JSON.parse(JSON.stringify(value)) as T
}

const gameDefinitionTemplate: AnyTemplateDefinition = {
    id: 'pbta.gameDefinition',
    gameId: 'pbta',
    gameLabel: 'Powered by the Apocalypse',
    label: 'Game Definition',
    implemented: true,
    contractKey: 'pbta/game-definition',
    createBlank: blankGameDefinition,
    createExample: getSamplePbtaGameDefinition,
    createInitialView: () => cloneValue(defaultGameDefinitionView),
    createInitialSheet: () => cloneValue(defaultGameDefinitionSheetState),
    getTabTitle: (doc: PbtaGameDefinition) =>
        doc.name.trim() || 'Game Definition',
    sections: gameDefinitionSections,
    landing: {
        description:
            'A Game Definition is the rulebook a PbtA hack runs on: its stats, its move types, the results a roll can land on, and who gets a character sheet. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { gameDefinition, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: gameDefinition,
                warnings,
                previewName: gameDefinition.name || 'Imported Game Definition',
            }
        },
        exportToml: (doc: PbtaGameDefinition) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <GameDefinitionPreview />,
    },
    editor: {
        emptyState: 'Click on the preview to edit a specific section.',
        renderPanel: () => <GameDefinitionEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: GameDefinitionViewState) =>
            getGameDefinitionPreviewWidth(view),
        renderPanel: () => <GameDefinitionAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current game definition as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: PbtaGameDefinition
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
                description: 'Export the current game definition sheet as PNG.',
                renderSettings: () => <GameDefinitionImageExportSettings />,
            }),
        ],
    },
}

export default gameDefinitionTemplate
