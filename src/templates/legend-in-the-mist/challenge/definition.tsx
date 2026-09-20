import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { ChallengeAppearancePanel } from './editor/ChallengeAppearancePanel'
import { ChallengeEditorPanel } from './editor/ChallengeEditorPanel'
import { ChallengeImageExportSettings } from './editor/ChallengeImageExportSettings'
import { getLegendInTheMistChallengePreviewWidth } from './hooks'
import { migrateLegacyChallengeWorkspace } from './legacyWorkspaceMigration'
import { challengeSections } from './metadata'
import {
    blankLegendInTheMistChallenge,
    defaultLegendInTheMistChallengeSheetState,
    defaultLegendInTheMistChallengeView,
    type LegendInTheMistChallenge,
    type LegendInTheMistChallengeViewState,
} from './model'
import { ChallengePreview } from './preview/ChallengePreview'
import { getSampleLegendInTheMistChallenge } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const challengeTemplate: AnyTemplateDefinition = {
    id: 'legend.challenge',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'legend:challenge.label',
    implemented: true,
    contractKey: 'mist/legend-in-the-mist/challenge',
    createBlank: blankLegendInTheMistChallenge,
    createExample: getSampleLegendInTheMistChallenge,
    createInitialView: () => cloneValue(defaultLegendInTheMistChallengeView),
    createInitialSheet: () =>
        cloneValue(defaultLegendInTheMistChallengeSheetState),
    getTabTitle: (doc: LegendInTheMistChallenge) =>
        doc.name.trim() || 'Challenge',
    legacyWorkspaceMigration: {
        storageKey: 'litm:challenge:v2',
        migrate: migrateLegacyChallengeWorkspace,
    },
    sections: challengeSections,
    landing: {
        newTitle: 'legend:challenge.newTitle',
        description: 'landing.chooseStart',
    },
    io: {
        importToml: (tomlText: string) => {
            const { legendInTheMistChallenge, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: legendInTheMistChallenge,
                warnings,
                previewName:
                    legendInTheMistChallenge.name || 'Imported Challenge',
            }
        },
        exportToml: (doc: LegendInTheMistChallenge) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ChallengePreview />,
    },
    editor: {
        renderPanel: () => <ChallengeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: LegendInTheMistChallengeViewState) =>
            getLegendInTheMistChallengePreviewWidth(view),
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
