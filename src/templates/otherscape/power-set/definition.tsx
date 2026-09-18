import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { PowerSetAppearancePanel } from './editor/PowerSetAppearancePanel'
import { PowerSetEditorPanel } from './editor/PowerSetEditorPanel'
import { PowerSetImageExportSettings } from './editor/PowerSetImageExportSettings'
import { getOtherscapePowerSetPreviewWidth } from './hooks'
import { powerSetSections } from './metadata'
import {
    blankOtherscapePowerSet,
    defaultOtherscapePowerSetSheetState,
    defaultOtherscapePowerSetView,
    type OtherscapePowerSet,
    type OtherscapePowerSetViewState,
} from './model'
import { PowerSetPreview } from './preview/PowerSetPreview'
import { getSampleOtherscapePowerSet } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const powerSetTemplate: AnyTemplateDefinition = {
    id: 'otherscape.powerSet',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:powerSet.label',
    implemented: true,
    contractKey: 'mist/otherscape/power-set',
    createBlank: blankOtherscapePowerSet,
    createExample: getSampleOtherscapePowerSet,
    createInitialView: () => cloneValue(defaultOtherscapePowerSetView),
    createInitialSheet: () => cloneValue(defaultOtherscapePowerSetSheetState),
    getTabTitle: (doc: OtherscapePowerSet) => doc.name.trim() || 'Power Set',
    sections: powerSetSections,
    landing: {
        newTitle: 'otherscape:powerSet.newTitle',
        description: 'otherscape:powerSet.description',
    },
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
