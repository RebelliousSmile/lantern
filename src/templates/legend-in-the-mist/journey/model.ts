import type {
    JourneyMeta,
    JourneyType,
    LegendInTheMistJourneyData,
    PublicationType,
    Vignette,
} from './schema'

export type { JourneyMeta, JourneyType, PublicationType, Vignette }

// The document keeps every optional field materialized so no form has to guard
// against undefined. `type` is the exception in spirit only: the schema gives
// it no default because none of the three is a neutral starting point, so the
// blank document picks `landscape` and the form makes the choice visible.
export type LegendInTheMistJourney = {
    name: string
    type: JourneyType
    description: string
    tags: string[]
    benefits: string
    consequences: string[]
    vignettes: JourneyVignette[]
    meta?: JourneyMeta
}

// The vignette mirrors the schema shape with its trigger materialized, for the
// same reason the document does.
export type JourneyVignette = {
    name: string
    trigger: string
    consequences: string[]
}

export function toLegendInTheMistJourneyDocument(
    legendInTheMistJourney: LegendInTheMistJourneyData
): LegendInTheMistJourney {
    return {
        name: legendInTheMistJourney.name,
        type: legendInTheMistJourney.type,
        description: legendInTheMistJourney.description ?? '',
        tags: legendInTheMistJourney.tags ?? [],
        benefits: legendInTheMistJourney.benefits ?? '',
        consequences: legendInTheMistJourney.consequences ?? [],
        vignettes: (legendInTheMistJourney.vignettes ?? []).map((vignette) => ({
            name: vignette.name,
            trigger: vignette.trigger ?? '',
            consequences: vignette.consequences,
        })),
        meta: legendInTheMistJourney.meta,
    }
}

// The payload drops the empty fields on the way out, so an untouched field
// never reaches the exported file.
export function toLegendInTheMistJourneyPayload(
    legendInTheMistJourney: LegendInTheMistJourney
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: legendInTheMistJourney.name,
        type: legendInTheMistJourney.type,
    }

    if (legendInTheMistJourney.description.trim()) {
        payload.description = legendInTheMistJourney.description
    }
    if (legendInTheMistJourney.tags.length) {
        payload.tags = legendInTheMistJourney.tags
    }
    if (legendInTheMistJourney.benefits.trim()) {
        payload.benefits = legendInTheMistJourney.benefits
    }
    if (legendInTheMistJourney.consequences.length) {
        payload.consequences = legendInTheMistJourney.consequences
    }
    if (legendInTheMistJourney.vignettes.length) {
        // A vignette carries a name and its own consequences; the trigger only
        // exists when the Narrator spelled one out, so an untouched trigger is
        // dropped rather than written out as an empty string.
        payload.vignettes = legendInTheMistJourney.vignettes.map((vignette) => {
            const entry: Record<string, unknown> = {
                name: vignette.name,
            }
            if (vignette.trigger && vignette.trigger.trim()) {
                entry.trigger = vignette.trigger
            }
            entry.consequences = vignette.consequences
            return entry
        })
    }
    if (legendInTheMistJourney.meta) {
        // Meta is built key by key for the same reason: a source cleared in the
        // form must leave the file rather than be written out as "".
        const meta = legendInTheMistJourney.meta
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

// The title band is not listed: it always renders, since it carries the type
// tint that tells the three kinds of Journey apart.
export type SectionId =
    | 'description'
    | 'tags'
    | 'benefits'
    | 'consequences'
    | 'vignettes'
    | 'meta'

export type Background = 'parchment' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type LegendInTheMistJourneyViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    // The band carries the name, the type and the description as one region:
    // they are the only three fields printed without a heading above them.
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'benefits'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | {
          kind: 'tags'
          mode?: 'create' | 'edit'
          index?: number
      }
    | {
          kind: 'consequences'
          mode?: 'create' | 'edit'
          index?: number
      }
    | {
          kind: 'vignettes'
          mode?: 'create' | 'edit'
          index?: number
      }

export type LegendInTheMistJourneySheetState = {
    open: boolean
    target: SheetTarget | null
}

// The printed Journey is a two-page spread, not a card: a band across the top
// and two columns under it. It needs room the other Legend templates do not,
// so its range starts where the widest of them stops.
export const PREVIEW_WIDTH_MIN = 640
export const PREVIEW_WIDTH_MAX = 1400
export const PREVIEW_WIDTH_DEFAULT = 900

export const defaultHidden: Record<SectionId, boolean> = {
    description: false,
    tags: false,
    benefits: false,
    consequences: false,
    vignettes: false,
    meta: false,
}

export const defaultLegendInTheMistJourneyView: LegendInTheMistJourneyViewState =
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

export const defaultLegendInTheMistJourneySheetState: LegendInTheMistJourneySheetState =
    {
        open: false,
        target: null,
    }

export const blankLegendInTheMistJourney = (): LegendInTheMistJourney => ({
    name: 'Untitled Journey',
    // The schema demands a type and offers no default; a blank sheet has to
    // start somewhere, and a landscape is the kind a table meets first.
    type: 'landscape',
    description: '',
    tags: [],
    benefits: '',
    consequences: [],
    vignettes: [],
})
