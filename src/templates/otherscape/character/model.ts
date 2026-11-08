import {
    hasCanonicalSource,
    overlayCanonicalSource,
} from '@/contracts/canonicalSource'
import type {
    OsCharacterMeta as CharacterMeta,
    OsCharacterLoadoutItem as LoadoutItemData,
    OtherscapeCharacter as OtherscapeCharacterData,
    OsCharacterPublicationType as PublicationType,
    OsTagCombo as TagComboData,
} from '@/contracts/mist-engine'
import {
    blankOtherscapeTheme,
    toOtherscapeThemeDocument,
    toOtherscapeThemePayload,
    type OtherscapeTheme,
    type SheetTarget as ThemeSheetTarget,
    type ThemeType,
} from '../theme/model'

export type { CharacterMeta, PublicationType }

/** A character holds at most four themes: the sheet prints four cards, and the schema refuses a fifth. */
export const MAX_THEMES = 4

/** The three types a character's themes take; a Crew theme belongs to the crew. */
export const CHARACTER_THEME_TYPES: ThemeType[] = ['self', 'mythos', 'noise']

export const DEFAULT_LOADOUT_ITEM_NAME = 'Untitled Loadout Item'
export const DEFAULT_TAG_COMBO_POWER = 2

export type TagCombo = {
    label: string
    tags: string[]
    power: number
    effect: string
}

export type LoadoutItem = {
    name: string
    feature_tags: string[]
    weakness_tag: string
    // Three states, kept apart: a file that never says whether the item is
    // loaded (read as not loaded) is not the file that says it is not.
    loaded?: boolean
}

export type OtherscapeCharacter = {
    name: string
    themes: OtherscapeTheme[]
    tag_combos: TagCombo[]
    loadout: LoadoutItem[]
    meta: CharacterMeta
}

function toTagCombo(combo: TagComboData): TagCombo {
    return {
        label: combo.label,
        tags: combo.tags,
        power: combo.power,
        effect: combo.effect,
    }
}

function toLoadoutItem(item: LoadoutItemData): LoadoutItem {
    return {
        name: item.name,
        feature_tags: item.feature_tags ?? [],
        weakness_tag: item.weakness_tag ?? '',
        loaded: item.loaded,
    }
}

export function toOtherscapeCharacterDocument(
    otherscapeCharacter: OtherscapeCharacterData
): OtherscapeCharacter {
    return {
        name: otherscapeCharacter.name,
        // A character's theme is the theme document itself, so the import
        // reuses the theme's own materialization.
        themes: (otherscapeCharacter.themes ?? []).map((theme) =>
            toOtherscapeThemeDocument(theme)
        ),
        tag_combos: (otherscapeCharacter.tag_combos ?? []).map(toTagCombo),
        loadout: (otherscapeCharacter.loadout ?? []).map(toLoadoutItem),
        meta: otherscapeCharacter.meta ?? { publication_type: 'homebrew' },
    }
}

/** A combo the schema accepts: a label, an effect, and at least one tag. */
export function isCompleteCombo(combo: TagCombo) {
    return (
        !!combo.label.trim() &&
        !!combo.effect.trim() &&
        combo.tags.some((tag) => tag.trim())
    )
}

function toComboPayload(combo: TagCombo) {
    return {
        label: combo.label.trim(),
        tags: combo.tags.map((tag) => tag.trim()).filter(Boolean),
        power: Math.max(0, Math.round(combo.power)),
        effect: combo.effect.trim(),
    }
}

function toLoadoutPayload(item: LoadoutItem) {
    const payload: Record<string, unknown> = {
        name: item.name.trim() || DEFAULT_LOADOUT_ITEM_NAME,
    }
    const tags = item.feature_tags.map((tag) => tag.trim()).filter(Boolean)
    if (tags.length) payload.feature_tags = tags
    if (item.weakness_tag.trim()) {
        payload.weakness_tag = item.weakness_tag.trim()
    }
    if (item.loaded !== undefined) payload.loaded = item.loaded
    return payload
}

/**
 * The document keeps every optional field materialized so the editor never
 * reads an `undefined`; the payload puts them back the way the schema writes
 * them, so an untouched field is absent from the file rather than present and
 * empty.
 *
 * On an imported document the payload is overlaid onto the import's canonical
 * source, which re-injects any key this function left out. A list the author
 * emptied is therefore written as `[]` when the source held it, instead of being
 * left out and coming back.
 */
export function toOtherscapeCharacterPayload(
    otherscapeCharacter: OtherscapeCharacter
): Record<string, unknown> {
    const source: Record<string, unknown> = hasCanonicalSource(
        otherscapeCharacter
    )
        ? overlayCanonicalSource(otherscapeCharacter, {})
        : {}
    const sourceHas = (key: string) => {
        const value = source[key]
        return Array.isArray(value) ? value.length > 0 : value != null
    }

    const payload: Record<string, unknown> = {
        name: otherscapeCharacter.name,
    }

    const themes = otherscapeCharacter.themes
        .slice(0, MAX_THEMES)
        .map(toOtherscapeThemePayload)
    if (themes.length) payload.themes = themes
    else if (sourceHas('themes')) payload.themes = []

    const combos = otherscapeCharacter.tag_combos
        .filter(isCompleteCombo)
        .map(toComboPayload)
    if (combos.length) payload.tag_combos = combos
    else if (sourceHas('tag_combos')) payload.tag_combos = []

    const loadout = otherscapeCharacter.loadout.map(toLoadoutPayload)
    if (loadout.length) payload.loadout = loadout
    else if (sourceHas('loadout')) payload.loadout = []

    const metaSource = otherscapeCharacter.meta
    const meta: Record<string, unknown> = {
        publication_type: metaSource.publication_type || 'homebrew',
    }
    if (metaSource.source?.trim()) meta.source = metaSource.source
    if (metaSource.authors?.length) meta.authors = metaSource.authors
    if (metaSource.page != null) meta.page = metaSource.page
    // A meta holding nothing but the default publication type says nothing the
    // importer would not put back, so it is dropped whole, unless the import
    // held one that would otherwise come back.
    if (
        Object.keys(meta).length > 1 ||
        meta.publication_type !== 'homebrew' ||
        sourceHas('meta')
    ) {
        payload.meta = meta
    }

    return payload
}

export type SectionId = 'upgrades' | 'combos' | 'loadout' | 'themes' | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeCharacterViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

/**
 * What a click on the sheet opens. A zone is one small form: the name, one tag
 * combo, the loadout, or one theme (which opens the theme's own zone).
 */
export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'upgrades'; mode?: 'edit' }
    | { kind: 'combo'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'loadout'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'themes'; mode?: 'edit' }
    | {
          kind: 'theme'
          index: number
          zone: ThemeSheetTarget
          mode?: 'edit'
      }
    | { kind: 'meta'; mode?: 'edit' }

export type OtherscapeCharacterSheetState = {
    open: boolean
    target: SheetTarget | null
}

// The sheet is four theme cards side by side under the bands, so it runs wider
// than any other Otherscape card.
export const PREVIEW_WIDTH_MIN = 640
export const PREVIEW_WIDTH_MAX = 1600
export const PREVIEW_WIDTH_DEFAULT = 1200
/** Below this width the four cards wrap two by two. */
export const PREVIEW_WIDTH_FOUR_COLUMNS = 1000

export const defaultHidden: Record<SectionId, boolean> = {
    upgrades: false,
    combos: false,
    loadout: false,
    themes: false,
    meta: false,
}

export const defaultOtherscapeCharacterView: OtherscapeCharacterViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'neon',
    autoHideEmpty: false,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultOtherscapeCharacterSheetState: OtherscapeCharacterSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapeCharacter = (): OtherscapeCharacter => ({
    name: 'Untitled Character',
    themes: [],
    tag_combos: [],
    loadout: [],
    meta: { publication_type: 'homebrew' },
})

/** A theme added to a character: blank, and of a type a character may hold. */
export function blankCharacterTheme(type: ThemeType = 'self'): OtherscapeTheme {
    return { ...blankOtherscapeTheme(), theme_type: type }
}

export const blankTagCombo = (): TagCombo => ({
    label: '',
    tags: [],
    power: DEFAULT_TAG_COMBO_POWER,
    effect: '',
})

export const blankLoadoutItem = (): LoadoutItem => ({
    name: DEFAULT_LOADOUT_ITEM_NAME,
    feature_tags: [],
    weakness_tag: '',
    loaded: false,
})
