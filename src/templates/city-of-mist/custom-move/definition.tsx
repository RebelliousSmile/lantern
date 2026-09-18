import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
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

const customMoveTemplate: AnyTemplateDefinition = {
    id: 'city.customMove',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:customMove.label',
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
        newTitle: 'city:customMove.newTitle',
        description: 'city:customMove.description',
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
        renderPanel: () => <CustomMoveEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: CityOfMistCustomMoveViewState) =>
            getCityOfMistCustomMovePreviewWidth(view),
        renderPanel: () => <CustomMoveAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:customMove.exportToml',
            }),
            createImageExportAction({
                description: 'city:customMove.exportPng',
                renderSettings: () => <CustomMoveImageExportSettings />,
            }),
        ],
    },
}

export default customMoveTemplate
