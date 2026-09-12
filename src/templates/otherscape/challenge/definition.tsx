import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
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

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const challengeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.challenge',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Challenge',
    implemented: true,
    contractKey: 'mist/otherscape/challenge',
    createBlank: blankOtherscapeChallenge,
    createExample: getSampleOtherscapeChallenge,
    createInitialView: () => cloneValue(defaultOtherscapeChallengeView),
    createInitialSheet: () => cloneValue(defaultOtherscapeChallengeSheetState),
    getTabTitle: (doc: OtherscapeChallenge) => doc.name.trim() || 'Challenge',
    sections: challengeSections,
    landing: {
        description:
            'A Challenge is anything the Crew has to get through: its scale, the tags and statuses on it, the Limits that stop it, the Specials it breaks the rules with, and the Threats it answers with. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <ChallengeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeChallengeViewState) =>
            getOtherscapeChallengePreviewWidth(view),
        renderPanel: () => <ChallengeAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current challenge data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapeChallenge
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
                description: 'Export the current challenge preview as PNG.',
                renderSettings: () => <ChallengeImageExportSettings />,
            }),
        ],
    },
}

export default challengeTemplate
