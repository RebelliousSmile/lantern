import type {
    LegendInTheMistStoryTheme as LegendInTheMistStoryThemeData,
    LitmStoryPublicationType as PublicationType,
    LitmStoryThemeMeta as StoryThemeMeta,
    LitmThemeLevel as ThemeLevel,
} from '@/contracts/mist-engine'

export type { PublicationType, StoryThemeMeta, ThemeLevel }

export type LegendInTheMistStoryTheme = {
    title_tag: string
    level: ThemeLevel
    category: string
    power_tags: string[]
    weakness_tags: string[]
    quest: string
    improve: number
    abandon: number
    milestone: boolean
    meta?: StoryThemeMeta
}

export function toLegendInTheMistStoryThemeDocument(
    legendInTheMistStoryTheme: LegendInTheMistStoryThemeData
): LegendInTheMistStoryTheme {
    return {
        title_tag: legendInTheMistStoryTheme.title_tag,
        level: legendInTheMistStoryTheme.level,
        category: legendInTheMistStoryTheme.category ?? '',
        power_tags: legendInTheMistStoryTheme.power_tags ?? [],
        weakness_tags: legendInTheMistStoryTheme.weakness_tags ?? [],
        quest: legendInTheMistStoryTheme.quest ?? '',
        improve: legendInTheMistStoryTheme.improve ?? 0,
        abandon: legendInTheMistStoryTheme.abandon ?? 0,
        milestone: legendInTheMistStoryTheme.milestone ?? false,
        meta: legendInTheMistStoryTheme.meta,
    }
}

// The document keeps every optional field materialized so the editor never has
// to guard against undefined; the TOML layer drops the empty ones on the way
// out, so an untouched field never reaches the exported file.
export function toLegendInTheMistStoryThemePayload(
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        title_tag: legendInTheMistStoryTheme.title_tag,
        level: legendInTheMistStoryTheme.level,
    }

    if (legendInTheMistStoryTheme.category.trim()) {
        payload.category = legendInTheMistStoryTheme.category
    }
    if (legendInTheMistStoryTheme.power_tags.length) {
        payload.power_tags = legendInTheMistStoryTheme.power_tags
    }
    if (legendInTheMistStoryTheme.weakness_tags.length) {
        payload.weakness_tags = legendInTheMistStoryTheme.weakness_tags
    }
    if (legendInTheMistStoryTheme.quest.trim()) {
        payload.quest = legendInTheMistStoryTheme.quest
    }
    if (legendInTheMistStoryTheme.improve > 0) {
        payload.improve = legendInTheMistStoryTheme.improve
    }
    if (legendInTheMistStoryTheme.abandon > 0) {
        payload.abandon = legendInTheMistStoryTheme.abandon
    }
    if (legendInTheMistStoryTheme.milestone) {
        payload.milestone = true
    }
    if (legendInTheMistStoryTheme.meta) {
        payload.meta = legendInTheMistStoryTheme.meta
    }

    return payload
}

export type SectionId =
    | 'category'
    | 'powerTags'
    | 'weaknessTags'
    | 'quest'
    | 'meta'

export type Background = 'parchment' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type LegendInTheMistStoryThemeViewState = {
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

export type LegendInTheMistStoryThemeSheetState = {
    open: boolean
    target: SheetTarget | null
}

// A Story Theme card is a single narrow column, so it sits well below the
// Challenge sheet's width rather than sharing its range.
export const PREVIEW_WIDTH_MIN = 320
export const PREVIEW_WIDTH_MAX = 720
export const PREVIEW_WIDTH_DEFAULT = 420

export const defaultHidden: Record<SectionId, boolean> = {
    category: false,
    powerTags: false,
    weaknessTags: false,
    quest: false,
    meta: false,
}

export const defaultLegendInTheMistStoryThemeView: LegendInTheMistStoryThemeViewState =
    {
        zoom: 1,
        previewWidth: PREVIEW_WIDTH_DEFAULT,
        background: 'parchment',
        autoHideEmpty: false,
        hidden: defaultHidden,
        exportPrefs: {
            scale: 2,
        },
    }

export const defaultLegendInTheMistStoryThemeSheetState: LegendInTheMistStoryThemeSheetState =
    {
        open: false,
        target: null,
    }

export const blankLegendInTheMistStoryTheme =
    (): LegendInTheMistStoryTheme => ({
        title_tag: 'Untitled Story Theme',
        level: 'origin',
        category: '',
        power_tags: [],
        weakness_tags: [],
        quest: '',
        improve: 0,
        abandon: 0,
        milestone: false,
    })
