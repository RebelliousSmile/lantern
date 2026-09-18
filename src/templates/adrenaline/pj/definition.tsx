import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { PjEditorPanel } from './editor/PjEditorPanel'
import { PjPreview } from './preview/PjPreview'
import { blankPj, samplePj } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    id: 'adrenaline.pj',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:pj.label',
    implemented: true,
    contractKey: 'adrenaline/pj',
    createBlank: blankPj,
    createExample: samplePj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PJ',
    sections: [{ id: 'document', label: 'adrenaline:sections.document' }],
    landing: {
        newTitle: 'adrenaline:pj.newTitle',
        description: 'adrenaline:pj.description',
    },
    io: {
        importToml: (source) => {
            const result = importFromTOMLWithWarnings(source)
            return { doc: result.pj, warnings: result.warnings }
        },
        exportToml: (doc) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <PjPreview />,
    },
    editor: {
        renderPanel: () => <PjEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'adrenaline:pj.exportToml',
            }),
            createImageExportAction({
                description: 'adrenaline:pj.exportPng',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
