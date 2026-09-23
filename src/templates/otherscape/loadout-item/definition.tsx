import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { LoadoutItemAppearancePanel } from './editor/LoadoutItemAppearancePanel'
import { LoadoutItemEditorPanel } from './editor/LoadoutItemEditorPanel'
import { LoadoutItemImageExportSettings } from './editor/LoadoutItemImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapeLoadoutItemPreviewWidth } from './hooks'
import type { OtherscapeLoadoutItem, OtherscapeLoadoutItemViewState } from './model'
import { LoadoutItemPreview } from './preview/LoadoutItemPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const loadoutItemTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeLoadoutItem, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeLoadoutItem,
                warnings,
                previewName:
                    otherscapeLoadoutItem.name || 'Imported Loadout Item',
            }
        },
        exportToml: (doc: OtherscapeLoadoutItem) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <LoadoutItemPreview />,
    },
    editor: {
        renderPanel: () => <LoadoutItemEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeLoadoutItemViewState) =>
            getOtherscapeLoadoutItemPreviewWidth(view),
        renderPanel: () => <LoadoutItemAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:loadoutItem.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:loadoutItem.exportPng',
                renderSettings: () => <LoadoutItemImageExportSettings />,
            }),
        ],
    },
}

export default loadoutItemTemplate
