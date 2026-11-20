import type { TemplateEditorSchema } from '@/core/editor-schema/types'
import type { TranslationKey, TranslationValues, UiText } from '@/i18n/text'
import type { ReactNode } from 'react'

export type GameId = string

export const CITY_GAME_ID = 'city'
export const LEGEND_GAME_ID = 'legend'
export const OTHERSCAPE_GAME_ID = 'otherscape'

export type TemplateMode = 'landing' | 'editing'

export const DEFAULT_TEMPLATE_PREVIEW_WIDTH = 1152

/** A lossy-import notice as data: the codec names what happened, the UI words it. */
export type ImportWarning = {
    key: TranslationKey
    values?: TranslationValues
}

export type TemplateImportResult<TDoc> = {
    doc: TDoc
    warnings: ImportWarning[]
    previewName?: string
}

export type TemplateSectionDefinition = {
    id: string
    label: UiText
}

export type LegacyWorkspaceMigration<TDoc = unknown> = {
    storageKey: string
    migrate: (raw: unknown) => TDoc | null
}

/**
 * One page of a sheet, as the published presentation declares it. The preview marks the node of
 * each page with `data-export-page="<id>"`; a template that declares none exports its whole preview.
 */
export type TemplateExportPage = {
    id: string
    label: UiText
    /** The page of session notes: always last, and left out of an export when the player unticks it. */
    notes?: boolean
}

/** What the player chose in the export panel, resolved before an action runs. */
export type TemplateExportSelection = {
    /** The pages to export, in sheet order. Empty when the template declares no pages (the whole preview). */
    pages: TemplateExportPage[]
    /** All the selected pages in one archive (PNG) rather than the single chosen one. */
    archive: boolean
}

export type TemplateExportAction<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    id: string
    label: UiText
    buttonLabel?: UiText
    description: UiText
    renderSettings?: () => ReactNode
    run: (context: {
        tabId: string
        title: string
        doc: TDoc
        view: TView
        sheet: TSheet
        getPreviewNode: () => HTMLElement | null
        selection: TemplateExportSelection
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
    /** The template's name, translated; `gameLabel` stays a proper noun. */
    label: UiText
    implemented: boolean
    comingSoonLabel?: UiText

    /**
     * The document contract this template edits, as `<contract>/<target>`.
     * Resolved through `documentContracts`, which is what the template's own
     * `toml.ts` reads too, so a typo fails at load rather than at the first export.
     */
    contractKey: string
    createBlank: () => TDoc
    /** Brings a document kept by an older version up to the published contract, when it is restored. */
    upgradeDocument?: (doc: unknown) => unknown
    createExample: () => TDoc
    createInitialView: () => TView
    createInitialSheet: () => TSheet
    getTabTitle: (doc: TDoc) => string
    legacyWorkspaceMigration?: LegacyWorkspaceMigration<TDoc>

    sections: TemplateSectionDefinition[]
    landing: {
        /** A whole sentence per template: French agreement differs per noun. */
        newTitle: UiText
        description: UiText
        exampleLabel?: UiText
        blankLabel?: UiText
        importLabel?: UiText
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
        renderPanel: () => ReactNode
        schema?: TemplateEditorSchema
    }

    appearance: {
        getPreviewWidth: (view: TView) => number
        renderPanel: () => ReactNode
    }

    export: {
        actions: TemplateExportAction<TDoc, TView, TSheet>[]
        /** The pages of the sheet; absent for a template that is one page. */
        pages?: (doc: TDoc) => TemplateExportPage[]
        /** The document without its session notes, for an export the player wants to share. */
        withoutNotes?: (doc: TDoc) => TDoc
    }
}

export type AnyTemplateDefinition = TemplateDefinition<any, any, any>

/**
 * The part of a template needed before its editor and preview code load. It is
 * intentionally free of React factories so the sidebar and workspace can stay
 * in the entry chunk.
 */
export type StaticTemplateDefinition<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = Omit<
    TemplateDefinition<TDoc, TView, TSheet>,
    'preview' | 'editor' | 'appearance' | 'export' | 'io'
> & {
    /** The editor schema is data and belongs with the entry-chunk descriptor. */
    editorSchema?: TemplateEditorSchema
}

export type AnyStaticTemplateDefinition = StaticTemplateDefinition<
    any,
    any,
    any
>

/** Render factories supplied by a lazily imported template module. */
export type TemplateRenderDefinition<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = Pick<
    TemplateDefinition<TDoc, TView, TSheet>,
    'preview' | 'editor' | 'appearance' | 'export'
>
