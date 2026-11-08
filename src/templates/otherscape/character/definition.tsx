import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import descriptor from './descriptor'
import { CharacterAppearancePanel } from './editor/CharacterAppearancePanel'
import { CharacterEditorPanel } from './editor/CharacterEditorPanel'
import { CharacterImageExportSettings } from './editor/CharacterImageExportSettings'
import { getOtherscapeCharacterPreviewWidth } from './hooks'
import type { OtherscapeCharacter, OtherscapeCharacterViewState } from './model'
import { CharacterPreview } from './preview/CharacterPreview'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const characterTemplate: AnyTemplateDefinition = {
    ...descriptor,
    io: {
        importToml: (tomlText: string) => {
            const { otherscapeCharacter, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: otherscapeCharacter,
                warnings,
                previewName: otherscapeCharacter.name || 'Imported Character',
            }
        },
        exportToml: (doc: OtherscapeCharacter) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <CharacterPreview />,
    },
    editor: {
        renderPanel: () => <CharacterEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapeCharacterViewState) =>
            getOtherscapeCharacterPreviewWidth(view),
        renderPanel: () => <CharacterAppearancePanel />,
    },
    export: {
        actions: [
            createTomlExportAction({
                exportToml: exportToTOML,
                description: 'otherscape:character.exportToml',
            }),
            createImageExportAction({
                description: 'otherscape:character.exportPng',
                renderSettings: () => <CharacterImageExportSettings />,
            }),
        ],
    },
}

export default characterTemplate
