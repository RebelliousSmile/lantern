import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
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
    label: 'pbta:playbook.label',
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
        newTitle: 'pbta:playbook.newTitle',
        description: {
            key: 'pbta:specialized.description',
            values: { game: 'Urban Shadows' },
        },
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
        renderPanel: () => <UrbanShadowsPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ViewState) => getUrbanShadowsPreviewWidth(view),
        renderPanel: () => <UrbanShadowsPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:playbook.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:playbook.exportPng',
                renderSettings: () => (
                    <UrbanShadowsPlaybookImageExportSettings />
                ),
            }),
        ],
    },
}
export default template
