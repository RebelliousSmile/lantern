import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { UrbanShadowsPlaybookAppearancePanel } from './editor/UrbanShadowsPlaybookAppearancePanel'
import { UrbanShadowsPlaybookEditorPanel } from './editor/UrbanShadowsPlaybookEditorPanel'
import { UrbanShadowsPlaybookImageExportSettings } from './editor/UrbanShadowsPlaybookImageExportSettings'
import { getUrbanShadowsPreviewWidth } from './hooks'
import { urbanShadowsSections } from './metadata'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type UrbanShadowsPlaybook,
    type ViewState,
} from './model'
import { UrbanShadowsPlaybookPreview } from './preview/UrbanShadowsPlaybookPreview'
import { getSampleUrbanShadowsPlaybook } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'
const clone = <T,>(x: T): T => structuredClone(x)
const template: AnyTemplateDefinition = {
    id: 'urban-shadows.playbook',
    gameId: 'urban-shadows',
    gameLabel: 'Urban Shadows',
    label: 'Playbook',
    implemented: true,
    contractKey: 'pbta/urban-shadows-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleUrbanShadowsPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (doc: UrbanShadowsPlaybook) =>
        doc.name || 'Urban Shadows Playbook',
    sections: urbanShadowsSections,
    landing: {
        description:
            'Create an original Urban Shadows playbook as one TOML document.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (text) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(text)
            return { doc: playbook, warnings, previewName: playbook.name }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (id) => `[data-preview-root="${id}"]`,
        render: () => <UrbanShadowsPlaybookPreview />,
    },
    editor: {
        emptyState: 'Click a sheet section to edit it.',
        renderPanel: () => <UrbanShadowsPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getUrbanShadowsPreviewWidth(view),
        renderPanel: () => <UrbanShadowsPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export this playbook as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: UrbanShadowsPlaybook
                    fileStem: string
                }) => {
                    try {
                        const url = URL.createObjectURL(
                            new Blob([exportToTOML(doc)], {
                                type: 'text/plain',
                            })
                        )
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${fileStem}.toml`
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success('Exported TOML.')
                    } catch (error: any) {
                        toast.error(error?.message || 'Failed to export TOML.')
                    }
                },
            },
            createImageExportAction({
                description:
                    'Export the current Urban Shadows playbook as PNG.',
                renderSettings: () => (
                    <UrbanShadowsPlaybookImageExportSettings />
                ),
            }),
        ],
    },
}
export default template
