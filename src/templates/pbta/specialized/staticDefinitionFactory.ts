import type { StaticTemplateDefinition } from '@/core/templates/types'
import { translateEnglish, type UiText } from '@/i18n/text'

export type SpecializedPlaybookDocument = Record<string, unknown>
export type SpecializedPlaybookView = {
    hidden: Record<string, boolean>
    previewWidth: number
}
export type SpecializedPlaybookSheet = {
    open: boolean
    target: string | 'basic' | null
}

export type SpecializedPlaybookConfig = {
    id: string
    gameId: string
    gameLabel: string
    label: UiText
    newTitle: UiText
    contractKey: string
    sections: Array<{ id: string; label: UiText }>
    blank: SpecializedPlaybookDocument
}

export function createSpecializedPlaybookStaticDefinition(
    config: SpecializedPlaybookConfig
): StaticTemplateDefinition<
    SpecializedPlaybookDocument,
    SpecializedPlaybookView,
    SpecializedPlaybookSheet
> {
    const clone = <T>(value: T): T => structuredClone(value)
    const sections = config.sections
    const printedLabel = () => translateEnglish(config.label)
    const createInitialView = (): SpecializedPlaybookView => ({
        previewWidth: 1123,
        hidden: Object.fromEntries(sections.map(({ id }) => [id, false])),
    })
    const createInitialSheet = (): SpecializedPlaybookSheet => ({
        open: false,
        target: null,
    })
    return {
        id: config.id,
        gameId: config.gameId,
        gameLabel: config.gameLabel,
        label: config.label,
        implemented: true,
        contractKey: config.contractKey,
        createBlank: () => clone(config.blank),
        createExample: () => clone(config.blank),
        createInitialView,
        createInitialSheet,
        getTabTitle: (doc) => String(doc.name || printedLabel()),
        sections,
        landing: {
            newTitle: config.newTitle,
            description: {
                key: 'pbta:specialized.description',
                values: { game: config.gameLabel },
            },
        },
    }
}
