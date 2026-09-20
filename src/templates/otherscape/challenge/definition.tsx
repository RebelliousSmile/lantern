import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ChallengeAppearancePanel } from './editor/ChallengeAppearancePanel'
import { ChallengeEditorPanel } from './editor/ChallengeEditorPanel'
import { ChallengeImageExportSettings } from './editor/ChallengeImageExportSettings'
import { getOtherscapeChallengePreviewWidth } from './hooks'
import { challengeSections } from './metadata'
import {
    blankOtherscapeChallenge,
    defaultOtherscapeChallengeSheetState,
    defaultOtherscapeChallengeView,
    type OtherscapeChallenge,
    type OtherscapeChallengeViewState,
} from './model'
import { ChallengePreview } from './preview/ChallengePreview'
import { getSampleOtherscapeChallenge } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const challengeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.challenge',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:challenge.label',
    implemented: true,
    contractKey: 'mist/otherscape/challenge',
    createBlank: blankOtherscapeChallenge,
    createExample: getSampleOtherscapeChallenge,
    createInitialView: () => cloneValue(defaultOtherscapeChallengeView),
    createInitialSheet: () => cloneValue(defaultOtherscapeChallengeSheetState),
    getTabTitle: (doc: OtherscapeChallenge) => doc.name.trim() || 'Challenge',
    sections: challengeSections,
    landing: {
        newTitle: 'otherscape:challenge.newTitle',
        description: 'otherscape:challenge.description',
    },
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
