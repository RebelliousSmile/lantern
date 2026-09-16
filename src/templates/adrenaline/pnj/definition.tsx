import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import { StructuredDocumentEditor } from '../shared/editor/StructuredDocumentEditor'
import { downloadToml } from '../shared/export'
import {
    cloneValue,
    defaultAdrenalineView,
    emptyAdrenalineSheetState,
} from '../shared/model'
import { AdrenalinePreview } from '../shared/preview/GenericPreview'
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
        render: () => (
            <AdrenalinePreview kind="PNJ" templateId="adrenaline.pnj" />
        ),
    },
    editor: {
        emptyState: 'Open the structured document editor.',
        renderPanel: () => (
            <StructuredDocumentEditor
                contractKey="adrenaline/pnj"
                templateId="adrenaline.pnj"
                title="PNJ"
            />
        ),
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
