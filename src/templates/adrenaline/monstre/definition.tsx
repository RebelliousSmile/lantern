import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import { downloadToml } from '../shared/export'
import {
    cloneValue,
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
    label: 'Monstre',
    implemented: true,
    contractKey: 'adrenaline/monstre',
    createBlank: blankMonstre,
    createExample: sampleMonstre,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'Monstre',
    sections: [{ id: 'document', label: 'Document' }],
    landing: {
        description:
            'Create an Adrenaline creature card with alternate-state and contagion data.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click a card region to edit it.',
        renderPanel: () => <MonstreEditorPanel />,
    },
    appearance: {
        getPreviewWidth: () => 680,
        renderPanel: () => <AdrenalineAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current monster data as TOML.',
                run: ({ doc, fileStem }) =>
                    downloadToml(exportToTOML(doc), fileStem),
            },
            createImageExportAction({
                description: 'Export the current monster preview as PNG.',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
