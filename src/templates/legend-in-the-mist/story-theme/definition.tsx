import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { StoryThemeAppearancePanel } from './editor/StoryThemeAppearancePanel'
import { StoryThemeEditorPanel } from './editor/StoryThemeEditorPanel'
import { StoryThemeImageExportSettings } from './editor/StoryThemeImageExportSettings'
import { getLegendInTheMistStoryThemePreviewWidth } from './hooks'
import { storyThemeSections } from './metadata'
import {
    blankLegendInTheMistStoryTheme,
    defaultLegendInTheMistStoryThemeSheetState,
    defaultLegendInTheMistStoryThemeView,
    type LegendInTheMistStoryTheme,
    type LegendInTheMistStoryThemeViewState,
} from './model'
import { StoryThemePreview } from './preview/StoryThemePreview'
import { getSampleLegendInTheMistStoryTheme } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const storyThemeTemplate: AnyTemplateDefinition = {
    id: 'legend.storyTheme',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Story Theme',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/story-theme',
    createBlank: blankLegendInTheMistStoryTheme,
    createExample: getSampleLegendInTheMistStoryTheme,
    createInitialView: () => cloneValue(defaultLegendInTheMistStoryThemeView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistStoryThemeSheetState),
    getTabTitle: (doc: LegendInTheMistStoryTheme) =>
        doc.title_tag.trim() || 'Story Theme',
    sections: storyThemeSections,
    landing: {
        description:
            'Choose how to start this template: blank, example, or import from TOML.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { legendInTheMistStoryTheme, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistStoryTheme,
                warnings,
                previewName:
                    legendInTheMistStoryTheme.title_tag ||
                    'Imported Story Theme',
            }
        },
        exportToml: (doc: LegendInTheMistStoryTheme) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <StoryThemePreview />,
    },
    editor: {
        emptyState: 'Click on the preview to edit a specific section.',
        renderPanel: () => <StoryThemeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistStoryThemeViewState) =>
            getLegendInTheMistStoryThemePreviewWidth(view),
        renderPanel: () => <StoryThemeAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current story theme data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: LegendInTheMistStoryTheme
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
                description: 'Export the current story theme preview as PNG.',
                renderSettings: () => <StoryThemeImageExportSettings />,
            }),
        ],
    },
}

export default storyThemeTemplate
