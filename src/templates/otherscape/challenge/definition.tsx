import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { ChallengeAppearancePanel } from './editor/ChallengeAppearancePanel'
import { ChallengeEditorPanel } from './editor/ChallengeEditorPanel'
import { ChallengeImageExportSettings } from './editor/ChallengeImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapeChallengePreviewWidth } from './hooks'
import type { OtherscapeChallenge, OtherscapeChallengeViewState } from './model'
import { ChallengePreview } from './preview/ChallengePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const challengeTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeChallenge, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeChallenge,
                warnings,
                previewName: otherscapeChallenge.name || 'Imported Challenge',
            }
        },
        exportToml: (doc: OtherscapeChallenge) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ChallengePreview />,
    },
    editor: {
        renderPanel: () => <ChallengeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeChallengeViewState) =>
            getOtherscapeChallengePreviewWidth(view),
        renderPanel: () => <ChallengeAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:challenge.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:challenge.exportPng',
                renderSettings: () => <ChallengeImageExportSettings />,
            }),
        ],
    },
}

export default challengeTemplate
