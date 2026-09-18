import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
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

const gameDefinitionTemplate: AnyTemplateDefinition = {
    id: 'pbta.gameDefinition',
    gameId: 'apocalypse-world',
    gameLabel: 'Apocalypse World',
    label: 'pbta:gameDefinition.label',
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
        newTitle: 'pbta:gameDefinition.newTitle',
        description: 'pbta:gameDefinition.description',
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
        renderPanel: () => <GameDefinitionEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: GameDefinitionViewState) =>
            getGameDefinitionPreviewWidth(view),
        renderPanel: () => <GameDefinitionAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:gameDefinition.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:gameDefinition.exportPng',
                renderSettings: () => <GameDefinitionImageExportSettings />,
            }),
        ],
    },
}

export default gameDefinitionTemplate
