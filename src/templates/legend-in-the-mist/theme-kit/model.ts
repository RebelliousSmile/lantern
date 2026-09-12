import type {
    LegendInTheMistThemeKit as LegendInTheMistThemeKitData,
    LitmKitPublicationType as PublicationType,
    LitmKitImprovement as ThemeKitImprovement,
    LitmThemeKitMeta as ThemeKitMeta,
} from '@/contracts/mist-engine'

export type { PublicationType, ThemeKitImprovement, ThemeKitMeta }

export type LegendInTheMistThemeKit = {
    name: string
    category: string
    power_tags: string[]
    weakness_tags: string[]
    quest: string
    improvements: ThemeKitImprovement[]
    meta?: ThemeKitMeta
}

export function toLegendInTheMistThemeKitDocument(
    legendInTheMistThemeKit: LegendInTheMistThemeKitData
): LegendInTheMistThemeKit {
    return {
        name: legendInTheMistThemeKit.name,
        category: legendInTheMistThemeKit.category ?? '',
        power_tags: legendInTheMistThemeKit.power_tags ?? [],
        weakness_tags: legendInTheMistThemeKit.weakness_tags ?? [],
        quest: legendInTheMistThemeKit.quest ?? '',
        improvements: legendInTheMistThemeKit.improvements ?? [],
        meta: legendInTheMistThemeKit.meta,
    }
}

// The document keeps every optional field materialized so the editor never has
// to guard against undefined; the payload drops the empty ones on the way out,
// so an untouched field never reaches the exported file.
export function toLegendInTheMistThemeKitPayload(
    legendInTheMistThemeKit: LegendInTheMistThemeKit
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: legendInTheMistThemeKit.name,
    }

    if (legendInTheMistThemeKit.category.trim()) {
        payload.category = legendInTheMistThemeKit.category
    }
    if (legendInTheMistThemeKit.power_tags.length) {
        payload.power_tags = legendInTheMistThemeKit.power_tags
    }
    if (legendInTheMistThemeKit.weakness_tags.length) {
        payload.weakness_tags = legendInTheMistThemeKit.weakness_tags
    }
    if (legendInTheMistThemeKit.quest.trim()) {
        payload.quest = legendInTheMistThemeKit.quest
    }
    if (legendInTheMistThemeKit.improvements.length) {
        // An improvement carries a name and, only when the themebook spells it
        // out, an effect: an untouched effect is dropped rather than written
        // out as an empty string.
        payload.improvements = legendInTheMistThemeKit.improvements.map(
            (improvement) => {
                const entry: Record<string, unknown> = {
                    name: improvement.name,
                }
                if (improvement.effect && improvement.effect.trim()) {
                    entry.effect = improvement.effect
                }
                return entry
            }
        )
    }
    if (legendInTheMistThemeKit.meta) {
        // Meta is built key by key for the same reason: a source cleared in the
        // form must leave the file rather than be written out as "".
        const meta = legendInTheMistThemeKit.meta
        const metaPayload: Record<string, unknown> = {
            publication_type: meta.publication_type || 'homebrew',
        }

        if (meta.source && meta.source.trim()) {
            metaPayload.source = meta.source
        }
        if (meta.authors?.length) {
            metaPayload.authors = meta.authors
        }
        if (meta.page != null) {
            metaPayload.page = meta.page
        }

        payload.meta = metaPayload
    }

    return payload
}

export type SectionId =
    | 'powerTags'
    | 'weaknessTags'
    | 'quest'
    | 'improvements'
    | 'meta'

export type Background = 'parchment' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type LegendInTheMistThemeKitViewState = {
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
    | {
          kind: 'improvements'
          mode?: 'create' | 'edit'
          index?: number
      }

export type LegendInTheMistThemeKitSheetState = {
    open: boolean
    target: SheetTarget | null
}

// The printed kit is a narrow portrait card, about 2.4 inches wide and tiled
// three to a row, so it sits below the Story Theme card rather than beside it.
// The plugin's own 28rem cap falls inside this range, at the width its design
// was drawn against.
export const PREVIEW_WIDTH_MIN = 320
export const PREVIEW_WIDTH_MAX = 640
export const PREVIEW_WIDTH_DEFAULT = 400

export const defaultHidden: Record<SectionId, boolean> = {
    powerTags: false,
    weaknessTags: false,
    quest: false,
    improvements: false,
    meta: false,
}

export const defaultLegendInTheMistThemeKitView: LegendInTheMistThemeKitViewState =
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

export const defaultLegendInTheMistThemeKitSheetState: LegendInTheMistThemeKitSheetState =
    {
        open: false,
        target: null,
    }

export const blankLegendInTheMistThemeKit = (): LegendInTheMistThemeKit => ({
    name: 'Untitled Theme Kit',
    category: '',
    power_tags: [],
    weakness_tags: [],
    quest: '',
    improvements: [],
})
