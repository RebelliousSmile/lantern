import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import i18n from '@/i18n'
import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'
import { AdrenalineAppearancePanel } from '../shared/editor/AdrenalineAppearancePanel'
import descriptor from './descriptor'
import { PjEditorPanel } from './editor/PjEditorPanel'
import { PjPreview } from './preview/PjPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const template: AnyTemplateDefinition = {
    ...descriptor,
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
        /* The pages are the ones the published presentation declares: the notes sit in the identity. */
        pages: () =>
            PJ_PRESENTATION.pages.map((page) => ({
                id: page.id,
                label: {
                    text: i18n.language.startsWith('fr')
                        ? page.label.fr
                        : page.label.en,
                },
            })),
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
