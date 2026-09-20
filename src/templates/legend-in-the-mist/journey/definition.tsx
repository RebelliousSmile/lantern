import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { JourneyAppearancePanel } from './editor/JourneyAppearancePanel'
import { JourneyEditorPanel } from './editor/JourneyEditorPanel'
import { JourneyImageExportSettings } from './editor/JourneyImageExportSettings'
import { getLegendInTheMistJourneyPreviewWidth } from './hooks'
import { journeySections } from './metadata'
import {
    blankLegendInTheMistJourney,
    defaultLegendInTheMistJourneySheetState,
    defaultLegendInTheMistJourneyView,
    type LegendInTheMistJourney,
    type LegendInTheMistJourneyViewState,
} from './model'
import { JourneyPreview } from './preview/JourneyPreview'
import { getSampleLegendInTheMistJourney } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const journeyTemplate: AnyTemplateDefinition = {
    id: 'legend.journey',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:journey.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/journey',
    createBlank: blankLegendInTheMistJourney,
    createExample: getSampleLegendInTheMistJourney,
    createInitialView: () => cloneValue(defaultLegendInTheMistJourneyView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistJourneySheetState),
    getTabTitle: (doc: LegendInTheMistJourney) => doc.name.trim() || 'Journey',
    sections: journeySections,
    landing: {
        newTitle: 'legend:journey.newTitle',
        description: 'legend:journey.description',
    },
    io: {
        importToml: (tomlText: string) => {
            const { legendInTheMistJourney, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistJourney,
                warnings,
                previewName: legendInTheMistJourney.name || 'Imported Journey',
            }
        },
        exportToml: (doc: LegendInTheMistJourney) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <JourneyPreview />,
    },
    editor: {
        renderPanel: () => <JourneyEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistJourneyViewState) =>
            getLegendInTheMistJourneyPreviewWidth(view),
        renderPanel: () => <JourneyAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'legend:journey.exportToml',
            }),
            createImageExportAction({
                description: 'legend:journey.exportPng',
                renderSettings: () => <JourneyImageExportSettings />,
            }),
        ],
    },
}

export default journeyTemplate
