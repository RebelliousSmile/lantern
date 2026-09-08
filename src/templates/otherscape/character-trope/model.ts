import type {
    CharacterTropeMeta,
    OtherscapeCharacterTropeData,
    PublicationType,
    ThemeKitRef,
} from './schema'

export type { CharacterTropeMeta, PublicationType, ThemeKitRef }

export type OtherscapeCharacterTrope = {
    name: string
    category: string
    description: string
    // Two lists of the same entry shape, kept apart because they say different
    // things: what the trope hands over, and what it asks the player to pick.
    theme_kits: ThemeKitRef[]
    choices: ThemeKitRef[]
    // Prose about starting gear, not catalog keys: an entry here is never
    // resolved against a loadout item record.
    loadout: string[]
    meta: CharacterTropeMeta
}

export function toOtherscapeCharacterTropeDocument(
    otherscapeCharacterTrope: OtherscapeCharacterTropeData
): OtherscapeCharacterTrope {
    return {
        name: otherscapeCharacterTrope.name,
        category: otherscapeCharacterTrope.category ?? '',
        description: otherscapeCharacterTrope.description ?? '',
        theme_kits: otherscapeCharacterTrope.theme_kits ?? [],
        choices: otherscapeCharacterTrope.choices ?? [],
        loadout: otherscapeCharacterTrope.loadout ?? [],
        meta: otherscapeCharacterTrope.meta ?? { publication_type: 'homebrew' },
    }
}

/**
 * The document keeps every optional field materialized so the editor never
 * reads an `undefined`; the payload puts them back the way the schema writes
 * them, so an untouched field is absent from the file rather than present and
 * empty.
 */
export function toOtherscapeCharacterTropePayload(
    otherscapeCharacterTrope: OtherscapeCharacterTrope
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: otherscapeCharacterTrope.name,
    }

    if (otherscapeCharacterTrope.category.trim()) {
        payload.category = otherscapeCharacterTrope.category
    }
    if (otherscapeCharacterTrope.description.trim()) {
        payload.description = otherscapeCharacterTrope.description
    }
    if (otherscapeCharacterTrope.loadout.length) {
        payload.loadout = otherscapeCharacterTrope.loadout
    }
    if (otherscapeCharacterTrope.theme_kits.length) {
        payload.theme_kits = otherscapeCharacterTrope.theme_kits
    }
    if (otherscapeCharacterTrope.choices.length) {
        payload.choices = otherscapeCharacterTrope.choices
    }

    const meta: Record<string, unknown> = {
        publication_type: otherscapeCharacterTrope.meta.publication_type,
    }
    if (otherscapeCharacterTrope.meta.source?.trim()) {
        meta.source = otherscapeCharacterTrope.meta.source
    }
    if (otherscapeCharacterTrope.meta.authors?.length) {
        meta.authors = otherscapeCharacterTrope.meta.authors
    }
    if (otherscapeCharacterTrope.meta.page != null) {
        meta.page = otherscapeCharacterTrope.meta.page
    }
    // A meta block holding nothing but the default publication type says
    // nothing, so it is not written at all.
    if (
        Object.keys(meta).length > 1 ||
        otherscapeCharacterTrope.meta.publication_type !== 'homebrew'
    ) {
        payload.meta = meta
    }

    return payload
}

export type SectionId =
    | 'description'
    | 'themeKits'
    | 'choices'
    | 'loadout'
    | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeCharacterTropeViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | { kind: 'themeKits'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'choices'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'loadout'; mode?: 'create' | 'edit'; index?: number }

export type OtherscapeCharacterTropeSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 700
export const PREVIEW_WIDTH_MAX = 1400
export const PREVIEW_WIDTH_DEFAULT = 1152

export const defaultHidden: Record<SectionId, boolean> = {
    description: false,
    themeKits: false,
    choices: false,
    loadout: false,
    meta: false,
}

export const defaultOtherscapeCharacterTropeView: OtherscapeCharacterTropeViewState =
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

export const defaultOtherscapeCharacterTropeSheetState: OtherscapeCharacterTropeSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapeCharacterTrope = (): OtherscapeCharacterTrope => ({
    name: 'Untitled Character Trope',
    category: '',
    description: '',
    theme_kits: [],
    choices: [],
    loadout: [],
    meta: { publication_type: 'homebrew' },
})
