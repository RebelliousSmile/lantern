import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    ChallengeMeta,
    Limit,
    OtherscapeChallenge,
    OtherscapeChallengeSheetState,
    OtherscapeChallengeViewState,
    SectionId,
    SheetTarget,
    Special,
    Threat,
} from './model'
import {
    blankOtherscapeChallenge,
    defaultHidden,
    defaultOtherscapeChallengeSheetState,
    defaultOtherscapeChallengeView,
} from './model'

type OtherscapeChallengeTab = WorkspaceTab<
    OtherscapeChallenge,
    OtherscapeChallengeViewState,
    OtherscapeChallengeSheetState
>

const TEMPLATE_ID = 'otherscape.challenge'
const fallbackOtherscapeChallenge = blankOtherscapeChallenge()
const fallbackView = cloneValue(defaultOtherscapeChallengeView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrUndefined(v?: string) {
    const trimmed = (v ?? '').trim()
    return trimmed ? trimmed : undefined
}

function strOrFallback(v: string | undefined, fallback: string) {
    const s = (v ?? '').trim()
    return s || fallback
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function normalizeBackground(
    background: OtherscapeChallengeViewState['background'] | undefined
): OtherscapeChallengeViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapeChallengeTab() {
    return useActiveTemplateTab<
        OtherscapeChallenge,
        OtherscapeChallengeViewState,
        OtherscapeChallengeSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeChallengeTab(): OtherscapeChallengeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeChallengeTab
}

export type {
    ChallengeMeta,
    Limit,
    OtherscapeChallenge,
    OtherscapeChallengeSheetState,
    OtherscapeChallengeViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    Special,
    Threat,
} from './model'

// These template-scoped hooks replace the legacy global stores while keeping
// the editor and preview API familiar for the challenge module.
export function useOtherscapeChallengeStore() {
    const tab = useOtherscapeChallengeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeChallenge = tab?.doc ?? fallbackOtherscapeChallenge

    const apply = (
        producer: (current: OtherscapeChallenge) => OtherscapeChallenge
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeChallenge))
        )
    }

    return {
        otherscapeChallenge,
        setOtherscapeChallenge: (update: Partial<OtherscapeChallenge>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapeChallenge: (next: OtherscapeChallenge) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeChallenge: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeChallenge())
        },
        addToken: (token: string) =>
            apply((current) => ({
                ...current,
                tags_and_statuses: [...current.tags_and_statuses, token],
            })),
        removeTokenAt: (index: number) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr.splice(index, 1)
                return { ...current, tags_and_statuses: arr }
            }),
        replaceTokenAt: (index: number, token: string) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr[index] = token
                return { ...current, tags_and_statuses: arr }
            }),
        moveToken: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, tags_and_statuses: arr }
            }),
        addLimit: (limit: Limit) =>
            apply((current) => ({
                ...current,
                limits: [
                    ...current.limits,
                    {
                        name: limit.name.trim(),
                        level: clamp(limit.level, 1, 6),
                        is_polar: !!limit.is_polar,
                        is_progress: !!limit.is_progress,
                        on_max: strOrUndefined(limit.on_max),
                    },
                ],
            })),
        updateLimitAt: (index: number, update: Partial<Limit>) =>
            apply((current) => {
                const arr = [...current.limits]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    level: clamp(update.level ?? prev.level, 1, 6),
                    is_polar: !!(update.is_polar ?? prev.is_polar),
                    is_progress: !!(update.is_progress ?? prev.is_progress),
                    on_max: strOrUndefined(update.on_max ?? prev.on_max),
                }

                return { ...current, limits: arr }
            }),
        removeLimitAt: (index: number) =>
            apply((current) => {
                const arr = [...current.limits]
                arr.splice(index, 1)
                return { ...current, limits: arr }
            }),
        moveLimit: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.limits]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, limits: arr }
            }),
        addThreat: (threat: Threat) =>
            apply((current) => ({
                ...current,
                threats: [
                    ...current.threats,
                    {
                        name: threat.name.trim(),
                        description: strOrFallback(
                            threat.description,
                            'Describe how this threat escalates.'
                        ),
                        consequences: (threat.consequences ?? [])
                            .map((consequence) => consequence.trim())
                            .filter(Boolean),
                    },
                ],
            })),
        updateThreatAt: (index: number, update: Partial<Threat>) =>
            apply((current) => {
                const arr = [...current.threats]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    description: strOrFallback(
                        update.description ?? prev.description,
                        prev.description
                    ),
                    consequences: update.consequences
                        ? update.consequences
                              .map((consequence) => consequence.trim())
                              .filter(Boolean)
                        : [...(prev.consequences ?? [])],
                }

                return { ...current, threats: arr }
            }),
        removeThreatAt: (index: number) =>
            apply((current) => {
                const arr = [...current.threats]
                arr.splice(index, 1)
                return { ...current, threats: arr }
            }),
        moveThreat: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.threats]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, threats: arr }
            }),
        addConsequence: (threatIndex: number, text: string) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const nextText = text.trim()
                if (!nextText) return current

                threats[threatIndex] = {
                    ...threat,
                    consequences: [...(threat.consequences ?? []), nextText],
                }

                return { ...current, threats }
            }),
        updateConsequence: (
            threatIndex: number,
            cIndex: number,
            text: string
        ) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...(threat.consequences ?? [])]
                if (cIndex < 0 || cIndex >= consequences.length) return current

                const nextText = text.trim()
                if (!nextText) return current

                consequences[cIndex] = nextText
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        removeConsequence: (threatIndex: number, cIndex: number) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...(threat.consequences ?? [])]
                consequences.splice(cIndex, 1)
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        moveConsequence: (threatIndex: number, from: number, to: number) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...(threat.consequences ?? [])]
                if (
                    from < 0 ||
                    from >= consequences.length ||
                    to < 0 ||
                    to >= consequences.length
                ) {
                    return current
                }

                const [item] = consequences.splice(from, 1)
                consequences.splice(to, 0, item)
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        addGeneralConsequence: (text: string) =>
            apply((current) => ({
                ...current,
                general_consequences: [...current.general_consequences, text],
            })),
        updateGeneralConsequence: (index: number, text: string) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (index < 0 || index >= arr.length) return current

                arr[index] = text
                return { ...current, general_consequences: arr }
            }),
        removeGeneralConsequence: (index: number) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                arr.splice(index, 1)
                return { ...current, general_consequences: arr }
            }),
        moveGeneralConsequence: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, general_consequences: arr }
            }),
        addSpecial: (special: Special) =>
            apply((current) => ({
                ...current,
                specials: [
                    ...current.specials,
                    {
                        name: special.name.trim(),
                        description: strOrFallback(
                            special.description,
                            'Describe when this Special triggers and what it does.'
                        ),
                    },
                ],
            })),
        updateSpecialAt: (index: number, update: Partial<Special>) =>
            apply((current) => {
                const arr = [...current.specials]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    description: strOrFallback(
                        update.description ?? prev.description,
                        prev.description
                    ),
                }

                return { ...current, specials: arr }
            }),
        removeSpecialAt: (index: number) =>
            apply((current) => {
                const arr = [...current.specials]
                arr.splice(index, 1)
                return { ...current, specials: arr }
            }),
        moveSpecial: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.specials]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, specials: arr }
            }),
        updateMeta: (update: Partial<ChallengeMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    ...current.meta,
                    ...update,
                },
            })),
    }
}

export function useOtherscapeChallengeViewStore() {
    const tab = useOtherscapeChallengeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeChallengeViewState = {
        ...fallbackView,
        ...tabView,
        background: normalizeBackground(tabView?.background),
        hidden: {
            ...fallbackView.hidden,
            ...(tabView?.hidden ?? {}),
        },
        exportPrefs: {
            ...fallbackView.exportPrefs,
            ...(tabView?.exportPrefs ?? {}),
        },
    }

    const patchView = (patch: Partial<OtherscapeChallengeViewState>) => {
        if (!tab) return
        patchTabView(tab.id, cloneValue(patch) as Record<string, unknown>)
    }

    return {
        ...view,
        setZoom: (zoom: number) =>
            patchView({
                zoom: Math.max(0.5, Math.min(2, zoom)),
            }),
        setPreviewWidth: (previewWidth: number) =>
            patchView({
                previewWidth,
            }),
        setBackground: (
            background: OtherscapeChallengeViewState['background']
        ) => patchView({ background }),
        toggleHidden: (id: SectionId) =>
            patchView({
                hidden: {
                    ...view.hidden,
                    [id]: !view.hidden[id],
                },
            }),
        setHidden: (id: SectionId, value: boolean) =>
            patchView({
                hidden: {
                    ...view.hidden,
                    [id]: value,
                },
            }),
        setAutoHideEmpty: (autoHideEmpty: boolean) =>
            patchView({ autoHideEmpty }),
        setExportPrefs: (
            partial: Partial<OtherscapeChallengeViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeChallengeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeChallengeSheetStore() {
    const tab = useOtherscapeChallengeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeChallengeSheetState

    return {
        ...sheet,
        openSheet: (target: SheetTarget) => {
            if (!tab || tab.mode !== 'editing') return

            setTabSheet(tab.id, {
                open: true,
                target,
            })
        },
        closeSheet: () => {
            if (!tab) return

            setTabSheet(
                tab.id,
                cloneValue(defaultOtherscapeChallengeSheetState)
            )
        },
    }
}

export function isEmptySection(
    otherscapeChallenge: OtherscapeChallenge,
    id: SectionId
) {
    switch (id) {
        case 'description':
            return !otherscapeChallenge.description.trim()
        case 'tagsStatuses':
            return !otherscapeChallenge.tags_and_statuses.length
        case 'limits':
            return !otherscapeChallenge.limits.length
        case 'specials':
            return !otherscapeChallenge.specials.length
        case 'threats':
            return !otherscapeChallenge.threats.length
        case 'generalConsequences':
            return !otherscapeChallenge.general_consequences.length
        case 'meta': {
            const meta = otherscapeChallenge.meta
            const hasMeta =
                !!meta.source?.trim() ||
                !!meta.authors?.length ||
                meta.page != null
            return !hasMeta
        }
        default:
            return true
    }
}

export function shouldShow(
    otherscapeChallenge: OtherscapeChallenge,
    id: SectionId,
    view: OtherscapeChallengeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeChallenge, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapeChallenge: OtherscapeChallenge,
    sectionIds: SectionId[],
    view: OtherscapeChallengeViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapeChallenge, sectionId, view)
    )
}

export function getOtherscapeChallengePreviewWidth(
    view: OtherscapeChallengeViewState
) {
    return view.previewWidth
}

export function getLiveOtherscapeChallengeTab() {
    return getOtherscapeChallengeTab()
}
