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
        render: () => (
            <AdrenalinePreview kind="PJ" templateId="adrenaline.pj" />
        ),
    },
    editor: {
        emptyState: 'Open the structured document editor.',
        renderPanel: () => (
            <StructuredDocumentEditor
                contractKey="adrenaline/pj"
                templateId="adrenaline.pj"
                title="PJ"
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
