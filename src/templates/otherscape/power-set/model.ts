import type {
    OtherscapePowerSet as OtherscapePowerSetData,
    OsPowerSetMeta as PowerSetMeta,
    OsPowerSetType as PowerSetType,
    OsPowerPublicationType as PublicationType,
    OsPowerSpecial as Special,
    OsPowerThreat as Threat,
} from '@/contracts/mist-engine'

export type { PowerSetMeta, PowerSetType, PublicationType, Special, Threat }

export type OtherscapePowerSet = {
    name: string
    // Required by the schema, so the document always carries one: there is no
    // neutral source a blank Power Set could sit under.
    type: PowerSetType
    description: string
    specials: Special[]
    threats: Threat[]
    general_consequences: string[]
    meta: PowerSetMeta
}

export function toOtherscapePowerSetDocument(
    otherscapePowerSet: OtherscapePowerSetData
): OtherscapePowerSet {
    return {
        name: otherscapePowerSet.name,
        type: otherscapePowerSet.type,
        description: otherscapePowerSet.description ?? '',
        specials: otherscapePowerSet.specials ?? [],
        threats: (otherscapePowerSet.threats ?? []).map((threat) => ({
            ...threat,
            consequences: threat.consequences ?? [],
        })),
        general_consequences: otherscapePowerSet.general_consequences ?? [],
        meta: otherscapePowerSet.meta ?? { publication_type: 'homebrew' },
    }
}

/**
 * The document keeps every optional field materialized so the editor never
 * reads an `undefined`; the payload puts them back the way the schema writes
 * them, so an untouched field is absent from the file rather than present and
 * empty.
 */
export function toOtherscapePowerSetPayload(
    otherscapePowerSet: OtherscapePowerSet
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: otherscapePowerSet.name,
        type: otherscapePowerSet.type,
    }

    if (otherscapePowerSet.description.trim()) {
        payload.description = otherscapePowerSet.description
    }
    if (otherscapePowerSet.specials.length) {
        payload.specials = otherscapePowerSet.specials
    }
    if (otherscapePowerSet.threats.length) {
        payload.threats = otherscapePowerSet.threats.map((threat) => {
            const written: Record<string, unknown> = {
                name: threat.name,
                description: threat.description,
            }
            // A standalone Threat carries no list of its own, and an empty
            // list written out would read back as a deliberate one.
            if (threat.consequences?.length) {
                written.consequences = threat.consequences
            }
            return written
        })
    }
    if (otherscapePowerSet.general_consequences.length) {
        payload.general_consequences = otherscapePowerSet.general_consequences
    }

    const meta: Record<string, unknown> = {
        publication_type: otherscapePowerSet.meta.publication_type,
    }
    if (otherscapePowerSet.meta.source?.trim()) {
        meta.source = otherscapePowerSet.meta.source
    }
    if (otherscapePowerSet.meta.authors?.length) {
        meta.authors = otherscapePowerSet.meta.authors
    }
    if (otherscapePowerSet.meta.page != null) {
        meta.page = otherscapePowerSet.meta.page
    }
    // A meta block holding nothing but the default publication type says
    // nothing, so it is not written at all.
    if (
        Object.keys(meta).length > 1 ||
        otherscapePowerSet.meta.publication_type !== 'homebrew'
    ) {
        payload.meta = meta
    }

    return payload
}

export type SectionId =
    | 'description'
    | 'specials'
    | 'threats'
    | 'generalConsequences'
    | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapePowerSetViewState = {
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
    | { kind: 'specials'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'threats'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'consequences'; mode?: 'create' | 'edit'; index?: number }

export type OtherscapePowerSetSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 700
export const PREVIEW_WIDTH_MAX = 1400
export const PREVIEW_WIDTH_DEFAULT = 1152

export const defaultHidden: Record<SectionId, boolean> = {
    description: false,
    specials: false,
    threats: false,
    generalConsequences: false,
    meta: false,
}

export const defaultOtherscapePowerSetView: OtherscapePowerSetViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'neon',
    autoHideEmpty: false,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultOtherscapePowerSetSheetState: OtherscapePowerSetSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapePowerSet = (): OtherscapePowerSet => ({
    name: 'Untitled Power Set',
    // Self is the one source that asserts nothing about the world outside the
    // person carrying it, so a blank sheet starts there rather than claiming a
    // Mythos or a Noise origin the author has not chosen.
    type: 'self',
    description: '',
    specials: [],
    threats: [],
    general_consequences: [],
    meta: { publication_type: 'homebrew' },
})
