import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { storyThemeDescriptor } from './descriptor'
import { StoryThemeAppearancePanel } from './editor/StoryThemeAppearancePanel'
import { StoryThemeEditorPanel } from './editor/StoryThemeEditorPanel'
import { StoryThemeImageExportSettings } from './editor/StoryThemeImageExportSettings'
import { getLegendInTheMistStoryThemePreviewWidth } from './hooks'
import { StoryThemePreview } from './preview/StoryThemePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const storyThemeTemplate: AnyTemplateDefinition = {
    ...storyThemeDescriptor,
    io: {
        importToml: (tomlText) => {
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
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <StoryThemePreview />,
    },
    editor: { renderPanel: () => <StoryThemeEditorPanel /> },
    appearance: {
        getPreviewWidth: getLegendInTheMistStoryThemePreviewWidth,
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
