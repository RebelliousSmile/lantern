import type { ReactNode } from 'react'

export type GameId = string

export const CITY_GAME_ID = 'city'
export const LEGEND_GAME_ID = 'legend'
export const OTHERSCAPE_GAME_ID = 'otherscape'

export type TemplateMode = 'landing' | 'editing'

export const DEFAULT_TEMPLATE_PREVIEW_WIDTH = 1152

export type TemplateImportResult<TDoc> = {
    doc: TDoc
    warnings: string[]
    previewName?: string
}

export type TemplateSectionDefinition = {
    id: string
    label: string
}

export type TemplateExportAction<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    id: string
    label: string
    buttonLabel?: string
    description: string
    renderSettings?: () => ReactNode
    run: (context: {
        tabId: string
        title: string
        doc: TDoc
        view: TView
        sheet: TSheet
        getPreviewNode: () => HTMLElement | null
        fileStem: string
    }) => Promise<void> | void
}

export type TemplateDefinition<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    // Template modules own their document/view/sheet contracts, while the app
    // shell owns routing, tab management, layout, and common workflow chrome.
    id: string
    gameId: GameId
    gameLabel: string
    label: string
    implemented: boolean
    comingSoonLabel?: string

    /**
     * The document contract this template edits, as `<contract>/<target>`.
     * Resolved through `documentContracts`, which is what the template's own
     * `toml.ts` reads too, so a typo fails at load rather than at the first export.
     */
    contractKey: string
    createBlank: () => TDoc
    createExample: () => TDoc
    createInitialView: () => TView
    createInitialSheet: () => TSheet
    getTabTitle: (doc: TDoc) => string

    sections: TemplateSectionDefinition[]
    landing: {
        description: string
        exampleLabel?: string
        blankLabel?: string
        importLabel?: string
    }

    io: {
        importToml?: (tomlText: string) => TemplateImportResult<TDoc>
        exportToml?: (doc: TDoc) => string
    }

    preview: {
        getRootSelector: (tabId: string) => string
        render: () => ReactNode
    }

    editor: {
        emptyState: string
        renderPanel: () => ReactNode
    }

    appearance: {
        getPreviewWidth: (view: TView) => number
        renderPanel: () => ReactNode
    }

    export: {
        actions: TemplateExportAction<TDoc, TView, TSheet>[]
    }
}

export type AnyTemplateDefinition = TemplateDefinition<any, any, any>
