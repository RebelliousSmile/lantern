import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { ThemeKitAppearancePanel } from './editor/ThemeKitAppearancePanel'
import { ThemeKitEditorPanel } from './editor/ThemeKitEditorPanel'
import { ThemeKitImageExportSettings } from './editor/ThemeKitImageExportSettings'
import { getLegendInTheMistThemeKitPreviewWidth } from './hooks'
import { themeKitSections } from './metadata'
import {
    blankLegendInTheMistThemeKit,
    defaultLegendInTheMistThemeKitSheetState,
    defaultLegendInTheMistThemeKitView,
    type LegendInTheMistThemeKit,
    type LegendInTheMistThemeKitViewState,
} from './model'
import { ThemeKitPreview } from './preview/ThemeKitPreview'
import { getSampleLegendInTheMistThemeKit } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const themeKitTemplate: AnyTemplateDefinition = {
    id: 'legend.themeKit',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Theme Kit',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/theme-kit',
    createBlank: blankLegendInTheMistThemeKit,
    createExample: getSampleLegendInTheMistThemeKit,
    createInitialView: () => cloneValue(defaultLegendInTheMistThemeKitView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistThemeKitSheetState),
    getTabTitle: (doc: LegendInTheMistThemeKit) =>
        doc.name.trim() || 'Theme Kit',
    sections: themeKitSections,
    landing: {
        description:
            'A Theme Kit is the card a themebook offers a Hero: a name, the power and weakness tags it suggests, the quest it points at, and the improvements it opens up. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { legendInTheMistThemeKit, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistThemeKit,
                warnings,
                previewName:
                    legendInTheMistThemeKit.name || 'Imported Theme Kit',
            }
        },
        exportToml: (doc: LegendInTheMistThemeKit) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ThemeKitPreview />,
    },
    editor: {
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ThemeKitEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistThemeKitViewState) =>
            getLegendInTheMistThemeKitPreviewWidth(view),
        renderPanel: () => <ThemeKitAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current theme kit data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: LegendInTheMistThemeKit
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
                description: 'Export the current theme kit card as PNG.',
                renderSettings: () => <ThemeKitImageExportSettings />,
            }),
        ],
    },
}

export default themeKitTemplate
