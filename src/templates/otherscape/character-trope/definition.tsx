import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { CharacterTropeAppearancePanel } from './editor/CharacterTropeAppearancePanel'
import { CharacterTropeEditorPanel } from './editor/CharacterTropeEditorPanel'
import { CharacterTropeImageExportSettings } from './editor/CharacterTropeImageExportSettings'
import descriptor from './descriptor'
import { getOtherscapeCharacterTropePreviewWidth } from './hooks'
import type { OtherscapeCharacterTrope, OtherscapeCharacterTropeViewState } from './model'
import { CharacterTropePreview } from './preview/CharacterTropePreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const characterTropeTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeCharacterTrope, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeCharacterTrope,
                warnings,
                previewName:
                    otherscapeCharacterTrope.name || 'Imported Character Trope',
            }
        },
        exportToml: (doc: OtherscapeCharacterTrope) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <CharacterTropePreview />,
    },
    editor: {
        renderPanel: () => <CharacterTropeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeCharacterTropeViewState) =>
            getOtherscapeCharacterTropePreviewWidth(view),
        renderPanel: () => <CharacterTropeAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:characterTrope.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:characterTrope.exportPng',
                renderSettings: () => <CharacterTropeImageExportSettings />,
            }),
        ],
    },
}

export default characterTropeTemplate
