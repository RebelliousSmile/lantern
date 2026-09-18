import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { DangerAppearancePanel } from './editor/DangerAppearancePanel'
import { DangerEditorPanel } from './editor/DangerEditorPanel'
import { DangerImageExportSettings } from './editor/DangerImageExportSettings'
import { getCityOfMistDangerPreviewWidth } from './hooks'
import { dangerSections } from './metadata'
import {
    blankCityOfMistDanger,
    defaultCityOfMistDangerSheetState,
    defaultCityOfMistDangerView,
    type CityOfMistDanger,
    type CityOfMistDangerViewState,
} from './model'
import { DangerPreview } from './preview/DangerPreview'
import { getSampleCityOfMistDanger } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const dangerTemplate: AnyTemplateDefinition = {
    id: 'city.danger',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'city:danger.label',
    implemented: true,
    contractKey: 'mist/city-of-mist/danger',
    createBlank: blankCityOfMistDanger,
    createExample: getSampleCityOfMistDanger,
    createInitialView: () => cloneValue(defaultCityOfMistDangerView),
    createInitialSheet: () => cloneValue(defaultCityOfMistDangerSheetState),
    getTabTitle: (doc: CityOfMistDanger) => doc.name.trim() || 'Danger',
    sections: dangerSections,
    landing: {
        newTitle: 'city:danger.newTitle',
        description: 'landing.chooseStart',
    },
    io: {
        importToml: (tomlText: string) => {
            const { cityOfMistDanger, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistDanger,
                warnings,
                previewName: cityOfMistDanger.name || 'Imported Danger',
            }
        },
        exportToml: (doc: CityOfMistDanger) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <DangerPreview />,
    },
    editor: {
        renderPanel: () => <DangerEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: CityOfMistDangerViewState) =>
            getCityOfMistDangerPreviewWidth(view),
        renderPanel: () => <DangerAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'city:danger.exportToml',
            }),
            createImageExportAction({
                description: 'city:danger.exportPng',
                renderSettings: () => <DangerImageExportSettings />,
            }),
        ],
    },
}

export default dangerTemplate
