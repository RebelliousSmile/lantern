import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
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

const storyThemeTemplate: AnyTemplateDefinition = {
    id: 'legend.storyTheme',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:storyTheme.label',
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
        newTitle: 'legend:storyTheme.newTitle',
        description: 'landing.chooseStart',
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
        renderPanel: () => <StoryThemeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistStoryThemeViewState) =>
            getLegendInTheMistStoryThemePreviewWidth(view),
        renderPanel: () => <StoryThemeAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'legend:storyTheme.exportToml',
            }),
            createImageExportAction({
                description: 'legend:storyTheme.exportPng',
                renderSettings: () => <StoryThemeImageExportSettings />,
            }),
        ],
    },
}

export default storyThemeTemplate
