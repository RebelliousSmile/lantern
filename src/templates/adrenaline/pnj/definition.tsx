import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import { downloadToml } from '../shared/export'
import {
    cloneValue,
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
    label: 'PNJ',
    implemented: true,
    contractKey: 'adrenaline/pnj',
    createBlank: blankPnj,
    createExample: samplePnj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PNJ',
    sections: [{ id: 'document', label: 'Document' }],
    landing: {
        description:
            'Create an Adrenaline non-player character card, from a walk-on to a complete major NPC.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click a card region to edit it.',
        renderPanel: () => <PnjEditorPanel />,
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
                description: 'Export the current PNJ data as TOML.',
                run: ({ doc, fileStem }) =>
                    downloadToml(exportToTOML(doc), fileStem),
            },
            createImageExportAction({
                description: 'Export the current PNJ preview as PNG.',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
