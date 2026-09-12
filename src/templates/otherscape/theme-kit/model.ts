import type {
    OtherscapeThemeKit as OtherscapeThemeKitData,
    OsKitPublicationType as PublicationType,
    OsThemeKitMeta as ThemeKitMeta,
    OsKitThemeType as ThemeType,
} from '@/contracts/mist-engine'

export type { PublicationType, ThemeKitMeta, ThemeType }

export type OtherscapeThemeKit = {
    title_tag: string
    theme_type: ThemeType
    category: string
    power_tags: string[]
    weakness_tags: string[]
    quest: string
    meta: ThemeKitMeta
}

// The sheet labels the single quest line differently depending on the theme
// type, so the card reads the label from `theme_type` rather than the document
// carrying one field per label. A crew theme prints a motivation instead.
export const QUEST_LABEL: Record<ThemeType, string> = {
    self: 'Identity',
    mythos: 'Ritual',
    noise: 'Itch',
    crew: 'Motivation',
}

export const THEME_TYPE_LABEL: Record<ThemeType, string> = {
    self: 'Self',
    mythos: 'Mythos',
    noise: 'Noise',
    crew: 'Crew',
}

// Meta is materialized rather than forwarded: the schema only defaults
// `publication_type` when the table itself is present, so a file with no
// [meta] would otherwise reach the editor as undefined and every consumer
// would have to guard against it.
function toThemeKitMeta(meta: ThemeKitMeta | undefined): ThemeKitMeta {
    return {
        publication_type: meta?.publication_type ?? 'homebrew',
        source: meta?.source,
        authors: meta?.authors,
        page: meta?.page,
    }
}

export function toOtherscapeThemeKitDocument(
    otherscapeThemeKit: OtherscapeThemeKitData
): OtherscapeThemeKit {
    return {
        title_tag: otherscapeThemeKit.title_tag,
        theme_type: otherscapeThemeKit.theme_type,
        category: otherscapeThemeKit.category ?? '',
        power_tags: otherscapeThemeKit.power_tags ?? [],
        weakness_tags: otherscapeThemeKit.weakness_tags ?? [],
        quest: otherscapeThemeKit.quest ?? '',
        meta: toThemeKitMeta(otherscapeThemeKit.meta),
    }
}

// The document keeps every optional field materialized so the editor never has
// to guard against undefined; the payload drops the empty ones on the way out,
// so an untouched field never reaches the exported file.
export function toOtherscapeThemeKitPayload(
    otherscapeThemeKit: OtherscapeThemeKit
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        title_tag: otherscapeThemeKit.title_tag,
        theme_type: otherscapeThemeKit.theme_type,
    }

    if (otherscapeThemeKit.category.trim()) {
        payload.category = otherscapeThemeKit.category
    }
    if (otherscapeThemeKit.power_tags.length) {
        payload.power_tags = otherscapeThemeKit.power_tags
    }
    if (otherscapeThemeKit.weakness_tags.length) {
        payload.weakness_tags = otherscapeThemeKit.weakness_tags
    }
    if (otherscapeThemeKit.quest.trim()) {
        payload.quest = otherscapeThemeKit.quest
    }

    // Meta is built key by key for the same reason: a source cleared in the
    // form must leave the file rather than be written out as "". A meta
    // holding nothing but the default publication type says nothing the
    // importer would not put back, so it is dropped whole.
    const meta = otherscapeThemeKit.meta
    const metaPayload: Record<string, unknown> = {
        publication_type: meta.publication_type || 'homebrew',
    }
    let metaCarriesSomething = metaPayload.publication_type !== 'homebrew'

    if (meta.source && meta.source.trim()) {
        metaPayload.source = meta.source
        metaCarriesSomething = true
    }
    if (meta.authors?.length) {
        metaPayload.authors = meta.authors
        metaCarriesSomething = true
    }
    if (meta.page != null) {
        metaPayload.page = meta.page
        metaCarriesSomething = true
    }
    if (metaCarriesSomething) {
        payload.meta = metaPayload
    }

    return payload
}

export type SectionId = 'powerTags' | 'weaknessTags' | 'quest' | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeThemeKitViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

export type TagField = 'power' | 'weakness'

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | { kind: 'quest'; mode?: 'edit' }
    | {
          kind: 'tags'
          field: TagField
          mode?: 'create' | 'edit'
          index?: number
      }

export type OtherscapeThemeKitSheetState = {
    open: boolean
    target: SheetTarget | null
}

// The printed kit is a narrow portrait card, tiled several to a page, so it
// sits below the theme card rather than beside it.
export const PREVIEW_WIDTH_MIN = 320
export const PREVIEW_WIDTH_MAX = 640
export const PREVIEW_WIDTH_DEFAULT = 400

export const defaultHidden: Record<SectionId, boolean> = {
    powerTags: false,
    weaknessTags: false,
    quest: false,
    meta: false,
}

export const defaultOtherscapeThemeKitView: OtherscapeThemeKitViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'neon',
    autoHideEmpty: false,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultOtherscapeThemeKitSheetState: OtherscapeThemeKitSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapeThemeKit = (): OtherscapeThemeKit => ({
    title_tag: 'Untitled Theme Kit',
    theme_type: 'self',
    category: '',
    power_tags: [],
    weakness_tags: [],
    quest: '',
    meta: { publication_type: 'homebrew' },
})
