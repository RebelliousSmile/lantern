import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { PowerSetAppearancePanel } from './editor/PowerSetAppearancePanel'
import { PowerSetEditorPanel } from './editor/PowerSetEditorPanel'
import { PowerSetImageExportSettings } from './editor/PowerSetImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapePowerSetPreviewWidth } from './hooks'
import type { OtherscapePowerSet, OtherscapePowerSetViewState } from './model'
import { PowerSetPreview } from './preview/PowerSetPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const powerSetTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapePowerSet, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapePowerSet,
                warnings,
                previewName: otherscapePowerSet.name || 'Imported Power Set',
            }
        },
        exportToml: (doc: OtherscapePowerSet) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <PowerSetPreview />,
    },
    editor: {
        renderPanel: () => <PowerSetEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapePowerSetViewState) =>
            getOtherscapePowerSetPreviewWidth(view),
        renderPanel: () => <PowerSetAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:powerSet.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:powerSet.exportPng',
                renderSettings: () => <PowerSetImageExportSettings />,
            }),
        ],
    },
}

export default powerSetTemplate
