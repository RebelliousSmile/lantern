import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
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

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const journeyTemplate: AnyTemplateDefinition = {
    id: 'legend.journey',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Journey',
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
        description:
            'A Journey is the stretch of story between two places: a road crossed, an occasion lived through, or a task carried out. It carries the tags it offers, what the heroes gain by making it through, what it can cost anywhere along the way, and the vignettes it breaks down into. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the spread to edit a specific section.',
        renderPanel: () => <JourneyEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistJourneyViewState) =>
            getLegendInTheMistJourneyPreviewWidth(view),
        renderPanel: () => <JourneyAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current journey data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: LegendInTheMistJourney
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
                description: 'Export the current journey spread as PNG.',
                renderSettings: () => <JourneyImageExportSettings />,
            }),
        ],
    },
}

export default journeyTemplate
