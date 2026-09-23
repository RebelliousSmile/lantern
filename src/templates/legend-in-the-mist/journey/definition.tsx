import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { journeyDescriptor } from './descriptor'
import { JourneyAppearancePanel } from './editor/JourneyAppearancePanel'
import { JourneyEditorPanel } from './editor/JourneyEditorPanel'
import { JourneyImageExportSettings } from './editor/JourneyImageExportSettings'
import { getLegendInTheMistJourneyPreviewWidth } from './hooks'
import { JourneyPreview } from './preview/JourneyPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const journeyTemplate: AnyTemplateDefinition = {
    ...journeyDescriptor,
    io: {
        importToml: (tomlText) => {
            const { legendInTheMistJourney, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistJourney,
                warnings,
                previewName: legendInTheMistJourney.name || 'Imported Journey',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <JourneyPreview />,
    },
    editor: { renderPanel: () => <JourneyEditorPanel /> },
    appearance: {
        getPreviewWidth: getLegendInTheMistJourneyPreviewWidth,
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
