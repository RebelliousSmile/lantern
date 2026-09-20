import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { LoadoutItemAppearancePanel } from './editor/LoadoutItemAppearancePanel'
import { LoadoutItemEditorPanel } from './editor/LoadoutItemEditorPanel'
import { LoadoutItemImageExportSettings } from './editor/LoadoutItemImageExportSettings'
import { getOtherscapeLoadoutItemPreviewWidth } from './hooks'
import { loadoutItemSections } from './metadata'
import {
    blankOtherscapeLoadoutItem,
    defaultOtherscapeLoadoutItemSheetState,
    defaultOtherscapeLoadoutItemView,
    type OtherscapeLoadoutItem,
    type OtherscapeLoadoutItemViewState,
} from './model'
import { LoadoutItemPreview } from './preview/LoadoutItemPreview'
import { getSampleOtherscapeLoadoutItem } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const loadoutItemTemplate: AnyTemplateDefinition = {
    id: 'otherscape.loadoutItem',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:loadoutItem.label',
    implemented: true,
    contractKey: 'mist/otherscape/loadout-item',
    createBlank: blankOtherscapeLoadoutItem,
    createExample: getSampleOtherscapeLoadoutItem,
    createInitialView: () => cloneValue(defaultOtherscapeLoadoutItemView),
    createInitialSheet: () =>
        cloneValue(defaultOtherscapeLoadoutItemSheetState),
    getTabTitle: (doc: OtherscapeLoadoutItem) =>
        doc.name.trim() || 'Loadout Item',
    sections: loadoutItemSections,
    landing: {
        newTitle: 'otherscape:loadoutItem.newTitle',
        description: 'otherscape:loadoutItem.description',
    },
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
