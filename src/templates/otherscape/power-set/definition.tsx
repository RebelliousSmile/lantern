import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
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

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const powerSetTemplate: AnyTemplateDefinition = {
    id: 'otherscape.powerSet',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Power Set',
    implemented: true,
    contractKey: 'mist/otherscape/power-set',
    createBlank: blankOtherscapePowerSet,
    createExample: getSampleOtherscapePowerSet,
    createInitialView: () => cloneValue(defaultOtherscapePowerSetView),
    createInitialSheet: () => cloneValue(defaultOtherscapePowerSetSheetState),
    getTabTitle: (doc: OtherscapePowerSet) => doc.name.trim() || 'Power Set',
    sections: powerSetSections,
    landing: {
        description:
            'A Power Set is a bundle of Specials, Threats and Consequences drawn from the Self, the Mythos or the Noise, published on its own and grafted onto any Challenge. Start blank, open the example, or import a TOML file.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
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
        emptyState: 'Click on the card to edit a specific section.',
        renderPanel: () => <PowerSetEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: OtherscapePowerSetViewState) =>
            getOtherscapePowerSetPreviewWidth(view),
        renderPanel: () => <PowerSetAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current power set data as TOML.',
                run: ({
                    doc,
                    fileStem,
                }: {
                    doc: OtherscapePowerSet
                    fileStem: string
                }) => {
                    try {
                        const toml = exportToTOML(doc)
                        const blob = new Blob([toml], {
                            type: 'text/plain;charset=utf-8',
                        })
                        const url = URL.createObjectURL(blob)
                        const anchor = document.createElement('a')
                        anchor.href = url
                        anchor.download = `${fileStem}.toml`
                        document.body.appendChild(anchor)
                        anchor.click()
                        anchor.remove()
                        URL.revokeObjectURL(url)
                        toast.success('Exported TOML.')
                    } catch (errorAny: any) {
                        toast.error(
                            errorAny?.message || 'Failed to export TOML.'
                        )
                    }
                },
            },
            createImageExportAction({
                description: 'Export the current power set preview as PNG.',
                renderSettings: () => <PowerSetImageExportSettings />,
            }),
        ],
    },
}

export default powerSetTemplate
