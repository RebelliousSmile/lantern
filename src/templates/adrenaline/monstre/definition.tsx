import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { MonstreEditorPanel } from './editor/MonstreEditorPanel'
import { MonstrePreview } from './preview/MonstrePreview'
import { blankMonstre, sampleMonstre } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    id: 'adrenaline.monstre',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'adrenaline:monstre.label',
    implemented: true,
    contractKey: 'adrenaline/monstre',
    createBlank: blankMonstre,
    createExample: sampleMonstre,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'Monstre',
    sections: [{ id: 'document', label: 'adrenaline:sections.document' }],
    landing: {
        newTitle: 'adrenaline:monstre.newTitle',
        description: 'adrenaline:monstre.description',
    },
    io: {
        importToml: (source) => {
            const result = importFromTOMLWithWarnings(source)
            return { doc: result.monstre, warnings: result.warnings }
        },
        exportToml: (doc) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
        render: () => <MonstrePreview />,
    },
    editor: {
        renderPanel: () => <MonstreEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'adrenaline:monstre.exportToml',
            }),
            createImageExportAction({
                description: 'adrenaline:monstre.exportPng',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
