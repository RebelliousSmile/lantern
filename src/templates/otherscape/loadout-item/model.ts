import type {
    OsLoadoutItemMeta as LoadoutItemMeta,
    OtherscapeLoadoutItem as OtherscapeLoadoutItemData,
    OsLoadoutPublicationType as PublicationType,
} from '@/contracts/mist-engine'

export type { LoadoutItemMeta, PublicationType }

export type OtherscapeLoadoutItem = {
    name: string
    category: string
    description: string
    feature_tags: string[]
    // A single slot rather than a list: the catalog prints exactly one per
    // specific item, and an array would invite two.
    weakness_tag: string
    meta: LoadoutItemMeta
}

/* The Street Catalog prints the item's own name as its first feature tag, so
   the document holds it twice: once as the record's title, once as a tag that
   gets invoked in play. The card prints the band from the next index on, and
   renaming the item rewrites this slot. */
export const NAME_TAG_INDEX = 0

export function featureTagsAfterName(
    otherscapeLoadoutItem: OtherscapeLoadoutItem
): string[] {
    return otherscapeLoadoutItem.feature_tags.slice(NAME_TAG_INDEX + 1)
}

// Meta is materialized rather than forwarded: the schema only defaults
// `publication_type` when the table itself is present, so a file with no
// [meta] would otherwise reach the editor as undefined and every consumer
// would have to guard against it.
function toLoadoutItemMeta(meta: LoadoutItemMeta | undefined): LoadoutItemMeta {
    return {
        publication_type: meta?.publication_type ?? 'homebrew',
        source: meta?.source,
        authors: meta?.authors,
        page: meta?.page,
    }
}

export function toOtherscapeLoadoutItemDocument(
    otherscapeLoadoutItem: OtherscapeLoadoutItemData
): OtherscapeLoadoutItem {
    return {
        name: otherscapeLoadoutItem.name,
        category: otherscapeLoadoutItem.category ?? '',
        description: otherscapeLoadoutItem.description ?? '',
        feature_tags: otherscapeLoadoutItem.feature_tags ?? [],
        weakness_tag: otherscapeLoadoutItem.weakness_tag ?? '',
        meta: toLoadoutItemMeta(otherscapeLoadoutItem.meta),
    }
}

// The document keeps every optional field materialized so the editor never has
// to guard against undefined; the payload drops the empty ones on the way out,
// so an untouched field never reaches the exported file.
export function toOtherscapeLoadoutItemPayload(
    otherscapeLoadoutItem: OtherscapeLoadoutItem
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: otherscapeLoadoutItem.name,
    }

    if (otherscapeLoadoutItem.category.trim()) {
        payload.category = otherscapeLoadoutItem.category
    }
    if (otherscapeLoadoutItem.description.trim()) {
        payload.description = otherscapeLoadoutItem.description
    }
    if (otherscapeLoadoutItem.feature_tags.length) {
        payload.feature_tags = otherscapeLoadoutItem.feature_tags
    }
    if (otherscapeLoadoutItem.weakness_tag.trim()) {
        payload.weakness_tag = otherscapeLoadoutItem.weakness_tag
    }

    // Meta is built key by key for the same reason: a source cleared in the
    // form must leave the file rather than be written out as "". A meta
    // holding nothing but the default publication type says nothing the
    // importer would not put back, so it is dropped whole.
    const meta = otherscapeLoadoutItem.meta
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

export type SectionId = 'description' | 'featureTags' | 'weaknessTag' | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeLoadoutItemViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

export type TagField = 'feature' | 'weakness'

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | {
          kind: 'tags'
          field: TagField
          mode?: 'create' | 'edit'
          index?: number
      }

export type OtherscapeLoadoutItemSheetState = {
    open: boolean
    target: SheetTarget | null
}

// A catalog entry is a small printed card, narrower than the theme cards it
// sits beside on the same page.
export const PREVIEW_WIDTH_MIN = 280
export const PREVIEW_WIDTH_MAX = 560
export const PREVIEW_WIDTH_DEFAULT = 340

export const defaultHidden: Record<SectionId, boolean> = {
    description: false,
    featureTags: false,
    weaknessTag: false,
    meta: false,
}

export const defaultOtherscapeLoadoutItemView: OtherscapeLoadoutItemViewState =
    {
        zoom: 1,
        previewWidth: PREVIEW_WIDTH_DEFAULT,
        background: 'neon',
        autoHideEmpty: false,
        hidden: defaultHidden,
        exportPrefs: {
            scale: 2,
        },
    }

export const defaultOtherscapeLoadoutItemSheetState: OtherscapeLoadoutItemSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapeLoadoutItem = (): OtherscapeLoadoutItem => ({
    name: 'Untitled Loadout Item',
    category: '',
    description: '',
    // The name occupies the first slot from the start, so the convention holds
    // on a blank card rather than only on an imported one.
    feature_tags: ['Untitled Loadout Item'],
    weakness_tag: '',
    meta: { publication_type: 'homebrew' },
})
