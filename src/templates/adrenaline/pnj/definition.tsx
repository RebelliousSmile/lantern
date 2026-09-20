import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { PnjEditorPanel } from './editor/PnjEditorPanel'
import { PnjPreview } from './preview/PnjPreview'
import { blankPnj, samplePnj } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    id: 'adrenaline.pnj',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:pnj.label',
    implemented: true,
    contractKey: 'adrenaline/pnj',
    createBlank: blankPnj,
    createExample: samplePnj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PNJ',
    sections: [{ id: 'document', label: 'adrenaline:sections.document' }],
    landing: {
        newTitle: 'adrenaline:pnj.newTitle',
        description: 'adrenaline:pnj.description',
    },
    io: {
        importToml: (source) => {
            const result = importFromTOMLWithWarnings(source)
            return { doc: result.pnj, warnings: result.warnings }
        },
        exportToml: (doc) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <PnjPreview />,
    },
    editor: {
        renderPanel: () => <PnjEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'adrenaline:pnj.exportToml',
            }),
            createImageExportAction({
                description: 'adrenaline:pnj.exportPng',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
