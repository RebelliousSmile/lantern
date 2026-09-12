import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { PlaybookAppearancePanel } from './editor/PlaybookAppearancePanel'
import { PlaybookEditorPanel } from './editor/PlaybookEditorPanel'
import { PlaybookImageExportSettings } from './editor/PlaybookImageExportSettings'
import { getPlaybookPreviewWidth } from './hooks'
import { playbookSections } from './metadata'
import {
    blankPlaybook,
    defaultPlaybookSheetState,
    defaultPlaybookView,
    type PbtaPlaybook,
    type PlaybookViewState,
} from './model'
import { PlaybookPreview } from './preview/PlaybookPreview'
import { getSamplePbtaPlaybook } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }
    return JSON.parse(JSON.stringify(value)) as T
}

const playbookTemplate: AnyTemplateDefinition = {
    id: 'pbta.playbook',
    gameId: 'pbta',
    gameLabel: 'Powered by the Apocalypse',
    label: 'Playbook',
    implemented: true,
    contractKey: 'pbta/playbook',
    createBlank: blankPlaybook,
    createExample: getSamplePbtaPlaybook,
    createInitialView: () => cloneValue(defaultPlaybookView),
    createInitialSheet: () => cloneValue(defaultPlaybookSheetState),
    getTabTitle: (doc: PbtaPlaybook) => doc.name.trim() || 'Playbook',
    sections: playbookSections,
    landing: {
        description:
            'A Playbook is a PbtA character type: its stats, its moves, the choices made at creation, and the gear it starts with. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(tomlText)
            return {
                doc: playbook,
                warnings,
                previewName: playbook.name || 'Imported Playbook',
            }
        },
        exportToml: (doc: PbtaPlaybook) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <PlaybookPreview />,
    },
    editor: {
        emptyState: 'Click on the preview to edit a specific section.',
        renderPanel: () => <PlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: PlaybookViewState) =>
            getPlaybookPreviewWidth(view),
        renderPanel: () => <PlaybookAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current playbook as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: PbtaPlaybook
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
                description: 'Export the current playbook sheet as PNG.',
                renderSettings: () => <PlaybookImageExportSettings />,
            }),
        ],
    },
}

export default playbookTemplate
