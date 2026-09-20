import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { MonsterheartsPlaybookAppearancePanel } from './editor/MonsterheartsPlaybookAppearancePanel'
import { MonsterheartsPlaybookEditorPanel } from './editor/MonsterheartsPlaybookEditorPanel'
import { MonsterheartsPlaybookImageExportSettings } from './editor/MonsterheartsPlaybookImageExportSettings'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    sections,
    type MonsterheartsPlaybook,
} from './model'
import { MonsterheartsPlaybookPreview } from './preview/MonsterheartsPlaybookPreview'
import { getSampleMonsterheartsPlaybook } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'
const clone = <T,>(x: T): T => structuredClone(x)
const template: AnyTemplateDefinition = {
    id: 'monsterhearts.playbook',
    gameId: 'monsterhearts',
    gameLabel: 'Monsterhearts',
    label: 'pbta:monsterhearts.label',
    implemented: true,
    contractKey: 'pbta/monsterhearts-playbook',
    createBlank: blankPlaybook,
    createExample: getSampleMonsterheartsPlaybook,
    createInitialView: () => clone(defaultView),
    createInitialSheet: () => clone(defaultSheet),
    getTabTitle: (d: MonsterheartsPlaybook) => d.name,
    sections,
    landing: {
        newTitle: 'pbta:monsterhearts.newTitle',
        description: 'pbta:monsterhearts.description',
    },
    io: {
        importToml: (t) => {
            const { playbook, warnings } = importFromTOMLWithWarnings(t)
            return { doc: playbook, warnings, previewName: playbook.name }
        },
        exportToml: exportToTOML,
    },
    preview: {
        getRootSelector: (id) => `[data-preview-root="${id}"]`,
        render: () => <MonsterheartsPlaybookPreview />,
    },
    editor: {
        renderPanel: () => <MonsterheartsPlaybookEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 1123,
        renderPanel: () => <MonsterheartsPlaybookAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'pbta:monsterhearts.exportToml',
            }),
            createImageExportAction({
                description: 'pbta:monsterhearts.exportPng',
                renderSettings: () => (
                    <MonsterheartsPlaybookImageExportSettings />
                ),
            }),
        ],
    },
}
export default template
