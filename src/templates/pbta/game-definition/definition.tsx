import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { GameDefinitionAppearancePanel } from './editor/GameDefinitionAppearancePanel'
import { GameDefinitionEditorPanel } from './editor/GameDefinitionEditorPanel'
import { GameDefinitionImageExportSettings } from './editor/GameDefinitionImageExportSettings'
import { getGameDefinitionPreviewWidth } from './hooks'
import type { GameDefinitionViewState } from './model'
import { GameDefinitionPreview } from './preview/GameDefinitionPreview'
import staticDefinition from './static'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const gameDefinitionTemplate: AnyTemplateDefinition = {
    ...staticDefinition,
    io: {
        importToml: (tomlText) => {
            const { gameDefinition, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: gameDefinition,
                warnings,
                previewName: gameDefinition.name || 'Imported Game Definition',
            }
        },
        exportToml: exportToTOML,
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
