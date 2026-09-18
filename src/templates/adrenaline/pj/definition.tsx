import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import { downloadToml } from '../shared/export'
import {
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { cloneValue } from '@/utils/clone'
import { PjEditorPanel } from './editor/PjEditorPanel'
import { PjPreview } from './preview/PjPreview'
import { blankPj, samplePj } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    id: 'adrenaline.pj',
    gameId: 'adrenaline',
    gameLabel: 'Adrenaline',
    label: 'PJ',
    implemented: true,
    contractKey: 'adrenaline/pj',
    createBlank: blankPj,
    createExample: samplePj,
    createInitialView: () => cloneValue(defaultAdrenalineView),
    createInitialSheet: () => cloneValue(emptyAdrenalineSheetState),
    getTabTitle: (doc) => (doc as { nom?: string }).nom?.trim() || 'PJ',
    sections: [{ id: 'document', label: 'Document' }],
    landing: {
        description:
            'Create a page-one Adrenaline player-character sheet, then exchange it as validated TOML.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click a region of the sheet to edit it.',
        renderPanel: () => <PjEditorPanel />,
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
                description: 'Export the current PJ data as TOML.',
                run: ({ doc, fileStem }) =>
                    downloadToml(exportToTOML(doc), fileStem),
            },
            createImageExportAction({
                description: 'Export the current PJ preview as PNG.',
                renderSettings: () => null,
            }),
        ],
    },
}

export default template
