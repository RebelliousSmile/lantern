import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { CharacterTropeAppearancePanel } from './editor/CharacterTropeAppearancePanel'
import { CharacterTropeEditorPanel } from './editor/CharacterTropeEditorPanel'
import { CharacterTropeImageExportSettings } from './editor/CharacterTropeImageExportSettings'
import { getOtherscapeCharacterTropePreviewWidth } from './hooks'
import { characterTropeSections } from './metadata'
import {
    blankOtherscapeCharacterTrope,
    defaultOtherscapeCharacterTropeSheetState,
    defaultOtherscapeCharacterTropeView,
    type OtherscapeCharacterTrope,
    type OtherscapeCharacterTropeViewState,
} from './model'
import { CharacterTropePreview } from './preview/CharacterTropePreview'
import { getSampleOtherscapeCharacterTrope } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'

const characterTropeTemplate: AnyTemplateDefinition = {
    id: 'otherscape.characterTrope',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'otherscape:characterTrope.label',
    implemented: true,
    contractKey: 'mist/otherscape/character-trope',
    createBlank: blankOtherscapeCharacterTrope,
    createExample: getSampleOtherscapeCharacterTrope,
    createInitialView: () => cloneValue(defaultOtherscapeCharacterTropeView),
    createInitialSheet: () =>
        cloneValue(defaultOtherscapeCharacterTropeSheetState),
    getTabTitle: (doc: OtherscapeCharacterTrope) =>
        doc.name.trim() || 'Character Trope',
    sections: characterTropeSections,
    landing: {
        newTitle: 'otherscape:characterTrope.newTitle',
        description: 'otherscape:characterTrope.description',
    },
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
