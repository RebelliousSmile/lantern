import type {
    CityOfMistThemeCard,
    CityErosion as Erosion,
    CityCardImprovement as Improvement,
    CityCardMotivation as Motivation,
    CityPowerTag as PowerTag,
    CityThemeCardMeta as ThemeCardMeta,
    CityCardThemeType as ThemeType,
    CityTrack as Track,
    CityWeaknessTag as WeaknessTag,
} from '@/contracts/mist-engine'

export type {
    CityErosion as Erosion,
    CityErosionKind as ErosionKind,
    CityCardImprovement as Improvement,
    CityCardMotivation as Motivation,
    CityMotivationKind as MotivationKind,
    CityPowerTag as PowerTag,
    CityCardPublicationType as PublicationType,
    CityThemeCardMeta as ThemeCardMeta,
    CityCardThemeType as ThemeType,
    CityTrack as Track,
    CityWeaknessTag as WeaknessTag,
} from '@/contracts/mist-engine'

export type ThemeCardDocument = {
    themebook: string
    theme_type: ThemeType
    title: string
    motivation?: Motivation
    attention: Track
    erosion?: Erosion
    power_tags: PowerTag[]
    weakness_tags: WeaknessTag[]
    improvements: Improvement[]
    meta: ThemeCardMeta
}

export function toThemeCardDocument(
    themeCard: CityOfMistThemeCard
): ThemeCardDocument {
    return {
        themebook: themeCard.themebook ?? '',
        theme_type: themeCard.theme_type,
        title: themeCard.title,
        motivation: themeCard.motivation,
        attention: themeCard.attention ?? { filled: 0, maximum: 3 },
        erosion: themeCard.erosion,
        power_tags: themeCard.power_tags ?? [],
        weakness_tags: themeCard.weakness_tags ?? [],
        improvements: themeCard.improvements ?? [],
        meta: {
            publication_type: themeCard.meta?.publication_type ?? 'homebrew',
            source: themeCard.meta?.source,
            authors: themeCard.meta?.authors,
            page: themeCard.meta?.page,
        },
    }
}

export function toThemeCardPayload(
    themeCard: ThemeCardDocument
): CityOfMistThemeCard {
    const payload: CityOfMistThemeCard = {
        theme_type: themeCard.theme_type,
        title: themeCard.title,
        attention: themeCard.attention,
        power_tags: themeCard.power_tags,
        weakness_tags: themeCard.weakness_tags,
        improvements: themeCard.improvements,
        meta: themeCard.meta,
    }

    if (themeCard.themebook.trim()) payload.themebook = themeCard.themebook
    if (themeCard.motivation) payload.motivation = themeCard.motivation
    if (themeCard.erosion) payload.erosion = themeCard.erosion

    return payload
}

export type SectionId =
    | 'motivation'
    | 'tracks'
    | 'powerTags'
    | 'weaknessTags'
    | 'improvements'
    | 'meta'

export type Background =
    | 'bg0'
    | 'bg1'
    | 'bg2'
    | 'bg3'
    | 'bg4'
    | 'bg5'
    | 'bg6'
    | 'bg7'

export type TitlePlacement = 'outside' | 'inside'
export type ExportPrefs = { scale: 1 | 2 | 3 }
export type TagField = 'power' | 'weakness'
export type TrackField = 'attention' | 'erosion'

export type ThemeCardViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    titlePlacement: TitlePlacement
    exportPrefs: ExportPrefs
}

type ListSheetTarget = {
    mode?: 'create' | 'edit'
    index?: number
}

export type SheetTarget =
    | { kind: 'identity'; mode?: 'edit' }
    | { kind: 'motivation'; mode?: 'edit' }
    | { kind: 'tracks'; mode?: 'edit' }
    | ({ kind: 'powerTags' } & ListSheetTarget)
    | ({ kind: 'weaknessTags' } & ListSheetTarget)
    | ({ kind: 'improvements' } & ListSheetTarget)
    | { kind: 'meta'; mode?: 'edit' }

export type ThemeCardSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 300
export const PREVIEW_WIDTH_MAX = 620
export const PREVIEW_WIDTH_DEFAULT = 380

export const defaultHidden: Record<SectionId, boolean> = {
    motivation: false,
    tracks: false,
    powerTags: false,
    weaknessTags: false,
    improvements: false,
    meta: false,
}

export const defaultThemeCardView: ThemeCardViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'bg0',
    autoHideEmpty: false,
    hidden: defaultHidden,
    titlePlacement: 'inside',
    exportPrefs: { scale: 2 },
}

export const defaultThemeCardSheetState: ThemeCardSheetState = {
    open: false,
    target: null,
}

export const blankThemeCard = (): ThemeCardDocument => ({
    themebook: '',
    theme_type: 'mythos',
    title: 'Untitled Theme',
    attention: { filled: 0, maximum: 3 },
    erosion: { kind: 'fade', filled: 0, maximum: 3 },
    power_tags: [],
    weakness_tags: [],
    improvements: [],
    meta: { publication_type: 'homebrew' },
})
