import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { challengeDescriptor } from './descriptor'
import { ChallengeAppearancePanel } from './editor/ChallengeAppearancePanel'
import { ChallengeEditorPanel } from './editor/ChallengeEditorPanel'
import { ChallengeImageExportSettings } from './editor/ChallengeImageExportSettings'
import { getLegendInTheMistChallengePreviewWidth } from './hooks'
import { ChallengePreview } from './preview/ChallengePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const challengeTemplate: AnyTemplateDefinition = {
    ...challengeDescriptor,
    io: {
        importToml: (tomlText) => {
            const { legendInTheMistChallenge, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistChallenge,
                warnings,
                previewName:
                    legendInTheMistChallenge.name || 'Imported Challenge',
            }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <ChallengePreview />,
    },
    editor: { renderPanel: () => <ChallengeEditorPanel /> },
    appearance: {
        getPreviewWidth: getLegendInTheMistChallengePreviewWidth,
        renderPanel: () => <ChallengeAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'legend:challenge.exportToml',
            }),
            createImageExportAction({
                description: 'legend:challenge.exportPng',
                renderSettings: () => <ChallengeImageExportSettings />,
            }),
        ],
    },
}

export default challengeTemplate
