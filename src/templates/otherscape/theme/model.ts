import type {
    OtherscapeTheme as OtherscapeThemeData,
    OsThemePublicationType as PublicationType,
    OsThemeMeta as ThemeMeta,
    OsThemeType as ThemeType,
} from '@/contracts/mist-engine'

export type { PublicationType, ThemeMeta, ThemeType }

export type OtherscapeTheme = {
    title_tag: string
    theme_type: ThemeType
    category: string
    power_tags: string[]
    weakness_tags: string[]
    quest: string
    // The two tracks stay nullable all the way through the document: a theme
    // whose track was never touched has no track, which is not the same object
    // as a track sitting at zero. Materializing them the way `meta` is
    // materialized would write a zero into every exported file.
    upgrade?: number
    decay?: number
    meta: ThemeMeta
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

/** The two tracks a played theme carries, and how far each one runs. */
export type TrackField = 'upgrade' | 'decay'

export const TRACK_LABEL: Record<TrackField, string> = {
    upgrade: 'Upgrade',
    decay: 'Decay',
}

export const TRACK_MAX = 3

// Meta is materialized rather than forwarded: the schema only defaults
// `publication_type` when the table itself is present, so a file with no
// [meta] would otherwise reach the editor as undefined and every consumer
// would have to guard against it.
function toThemeMeta(meta: ThemeMeta | undefined): ThemeMeta {
    return {
        publication_type: meta?.publication_type ?? 'homebrew',
        source: meta?.source,
        authors: meta?.authors,
        page: meta?.page,
    }
}

export function toOtherscapeThemeDocument(
    otherscapeTheme: OtherscapeThemeData
): OtherscapeTheme {
    return {
        title_tag: otherscapeTheme.title_tag,
        theme_type: otherscapeTheme.theme_type,
        category: otherscapeTheme.category ?? '',
        power_tags: otherscapeTheme.power_tags ?? [],
        weakness_tags: otherscapeTheme.weakness_tags ?? [],
        quest: otherscapeTheme.quest ?? '',
        upgrade: otherscapeTheme.upgrade,
        decay: otherscapeTheme.decay,
        meta: toThemeMeta(otherscapeTheme.meta),
    }
}

// The document keeps every optional field materialized so the editor never has
// to guard against undefined; the payload drops the empty ones on the way out,
// so an untouched field never reaches the exported file.
export function toOtherscapeThemePayload(
    otherscapeTheme: OtherscapeTheme
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        title_tag: otherscapeTheme.title_tag,
        theme_type: otherscapeTheme.theme_type,
    }

    if (otherscapeTheme.category.trim()) {
        payload.category = otherscapeTheme.category
    }
    if (otherscapeTheme.power_tags.length) {
        payload.power_tags = otherscapeTheme.power_tags
    }
    if (otherscapeTheme.weakness_tags.length) {
        payload.weakness_tags = otherscapeTheme.weakness_tags
    }
    if (otherscapeTheme.quest.trim()) {
        payload.quest = otherscapeTheme.quest
    }
    // Tested against null rather than truthiness: an imported `upgrade = 0` is
    // a value the file has to carry back out unchanged, and `0` would fall out
    // of a truthiness test.
    if (otherscapeTheme.upgrade != null) {
        payload.upgrade = otherscapeTheme.upgrade
    }
    if (otherscapeTheme.decay != null) {
        payload.decay = otherscapeTheme.decay
    }

    // Meta is built key by key for the same reason: a source cleared in the
    // form must leave the file rather than be written out as "". A meta
    // holding nothing but the default publication type says nothing the
    // importer would not put back, so it is dropped whole.
    const meta = otherscapeTheme.meta
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

export type SectionId =
    | 'powerTags'
    | 'weaknessTags'
    | 'quest'
    | 'tracks'
    | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeThemeViewState = {
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
    | { kind: 'tracks'; field?: TrackField; mode?: 'edit' }
    | {
          kind: 'tags'
          field: TagField
          mode?: 'create' | 'edit'
          index?: number
      }

export type OtherscapeThemeSheetState = {
    open: boolean
    target: SheetTarget | null
}

// The printed theme is a narrow portrait card, several to a character sheet, so
// it sits below the kit card rather than beside it.
export const PREVIEW_WIDTH_MIN = 320
export const PREVIEW_WIDTH_MAX = 640
export const PREVIEW_WIDTH_DEFAULT = 400

export const defaultHidden: Record<SectionId, boolean> = {
    powerTags: false,
    weaknessTags: false,
    quest: false,
    tracks: false,
    meta: false,
}

export const defaultOtherscapeThemeView: OtherscapeThemeViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'neon',
    autoHideEmpty: false,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultOtherscapeThemeSheetState: OtherscapeThemeSheetState = {
    open: false,
    target: null,
}

export const blankOtherscapeTheme = (): OtherscapeTheme => ({
    title_tag: 'Untitled Theme',
    theme_type: 'self',
    category: '',
    power_tags: [],
    weakness_tags: [],
    quest: '',
    upgrade: undefined,
    decay: undefined,
    meta: { publication_type: 'homebrew' },
})
