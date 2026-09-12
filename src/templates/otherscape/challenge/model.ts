import type {
    OsChallengeMeta as ChallengeMeta,
    OsLimit as Limit,
    OtherscapeChallenge as OtherscapeChallengeData,
    OsChallengePublicationType as PublicationType,
    OsSpecial as Special,
    OsThreat as Threat,
} from '@/contracts/mist-engine'

export type { ChallengeMeta, Limit, PublicationType, Special, Threat }

export type OtherscapeChallenge = {
    name: string
    description: string
    // Absent rather than zero: a Challenge with no printed scale is
    // person-sized, and `null` is what says "nothing printed here".
    scale: number | null
    tags_and_statuses: string[]
    limits: Limit[]
    specials: Special[]
    threats: Threat[]
    general_consequences: string[]
    meta: ChallengeMeta
}

export function toOtherscapeChallengeDocument(
    otherscapeChallenge: OtherscapeChallengeData
): OtherscapeChallenge {
    return {
        name: otherscapeChallenge.name,
        description: otherscapeChallenge.description ?? '',
        scale: otherscapeChallenge.scale ?? null,
        tags_and_statuses: otherscapeChallenge.tags_and_statuses ?? [],
        limits: otherscapeChallenge.limits ?? [],
        specials: otherscapeChallenge.specials ?? [],
        threats: (otherscapeChallenge.threats ?? []).map((threat) => ({
            ...threat,
            consequences: threat.consequences ?? [],
        })),
        general_consequences: otherscapeChallenge.general_consequences ?? [],
        meta: otherscapeChallenge.meta ?? { publication_type: 'homebrew' },
    }
}

/**
 * The document keeps every optional field materialized so the editor never
 * reads an `undefined`; the payload puts them back the way the schema writes
 * them, so an untouched field is absent from the file rather than present and
 * empty.
 */
export function toOtherscapeChallengePayload(
    otherscapeChallenge: OtherscapeChallenge
): Record<string, unknown> {
    const payload: Record<string, unknown> = { name: otherscapeChallenge.name }

    if (otherscapeChallenge.description.trim()) {
        payload.description = otherscapeChallenge.description
    }
    if (otherscapeChallenge.scale !== null) {
        payload.scale = otherscapeChallenge.scale
    }
    if (otherscapeChallenge.tags_and_statuses.length) {
        payload.tags_and_statuses = otherscapeChallenge.tags_and_statuses
    }
    if (otherscapeChallenge.limits.length) {
        payload.limits = otherscapeChallenge.limits.map((limit) => {
            const written: Record<string, unknown> = {
                name: limit.name,
                level: limit.level,
                is_polar: limit.is_polar,
                is_progress: limit.is_progress,
            }
            if (limit.on_max?.trim()) written.on_max = limit.on_max
            return written
        })
    }
    if (otherscapeChallenge.specials.length) {
        payload.specials = otherscapeChallenge.specials
    }
    if (otherscapeChallenge.threats.length) {
        payload.threats = otherscapeChallenge.threats.map((threat) => {
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
    if (otherscapeChallenge.general_consequences.length) {
        payload.general_consequences = otherscapeChallenge.general_consequences
    }

    const meta: Record<string, unknown> = {
        publication_type: otherscapeChallenge.meta.publication_type,
    }
    if (otherscapeChallenge.meta.source?.trim()) {
        meta.source = otherscapeChallenge.meta.source
    }
    if (otherscapeChallenge.meta.authors?.length) {
        meta.authors = otherscapeChallenge.meta.authors
    }
    if (otherscapeChallenge.meta.page != null) {
        meta.page = otherscapeChallenge.meta.page
    }
    // A meta block holding nothing but the default publication type says
    // nothing, so it is not written at all.
    if (
        Object.keys(meta).length > 1 ||
        otherscapeChallenge.meta.publication_type !== 'homebrew'
    ) {
        payload.meta = meta
    }

    return payload
}

export type SectionId =
    | 'description'
    | 'tagsStatuses'
    | 'limits'
    | 'specials'
    | 'threats'
    | 'generalConsequences'
    | 'meta'

export type Background = 'neon' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type OtherscapeChallengeViewState = {
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
    | { kind: 'tags'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'limits'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'specials'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'threats'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'consequences'; mode?: 'create' | 'edit'; index?: number }

export type OtherscapeChallengeSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 700
export const PREVIEW_WIDTH_MAX = 1400
export const PREVIEW_WIDTH_DEFAULT = 1152

export const defaultHidden: Record<SectionId, boolean> = {
    description: false,
    tagsStatuses: false,
    limits: false,
    specials: false,
    threats: false,
    generalConsequences: false,
    meta: false,
}

export const defaultOtherscapeChallengeView: OtherscapeChallengeViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'neon',
    autoHideEmpty: false,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
    },
}

export const defaultOtherscapeChallengeSheetState: OtherscapeChallengeSheetState =
    {
        open: false,
        target: null,
    }

export const blankOtherscapeChallenge = (): OtherscapeChallenge => ({
    name: 'Untitled Challenge',
    description: '',
    scale: null,
    tags_and_statuses: [],
    limits: [],
    specials: [],
    threats: [],
    general_consequences: [],
    meta: { publication_type: 'homebrew' },
})
