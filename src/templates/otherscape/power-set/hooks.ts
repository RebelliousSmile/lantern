import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    OtherscapePowerSet,
    OtherscapePowerSetSheetState,
    OtherscapePowerSetViewState,
    PowerSetMeta,
    SectionId,
    SheetTarget,
    Special,
    Threat,
} from './model'
import {
    blankOtherscapePowerSet,
    defaultHidden,
    defaultOtherscapePowerSetSheetState,
    defaultOtherscapePowerSetView,
} from './model'

type OtherscapePowerSetTab = WorkspaceTab<
    OtherscapePowerSet,
    OtherscapePowerSetViewState,
    OtherscapePowerSetSheetState
>

const TEMPLATE_ID = 'otherscape.powerSet'
const fallbackOtherscapePowerSet = blankOtherscapePowerSet()
const fallbackView = cloneValue(defaultOtherscapePowerSetView)

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
    background: OtherscapePowerSetViewState['background'] | undefined
): OtherscapePowerSetViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapePowerSetTab() {
    return useActiveTemplateTab<
        OtherscapePowerSet,
        OtherscapePowerSetViewState,
        OtherscapePowerSetSheetState
    >(TEMPLATE_ID)
}

function getOtherscapePowerSetTab(): OtherscapePowerSetTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapePowerSetTab
}

export type {
    OtherscapePowerSet,
    OtherscapePowerSetSheetState,
    OtherscapePowerSetViewState,
    PowerSetMeta,
    PowerSetType,
    PublicationType,
    SectionId,
    SheetTarget,
    Special,
    Threat,
} from './model'

// These template-scoped hooks replace the legacy global stores while keeping
// the editor and preview API familiar for the power set module.
export function useOtherscapePowerSetStore() {
    const tab = useOtherscapePowerSetTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapePowerSet = tab?.doc ?? fallbackOtherscapePowerSet

    const apply = (
        producer: (current: OtherscapePowerSet) => OtherscapePowerSet
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapePowerSet))
        )
    }

    return {
        otherscapePowerSet,
        setOtherscapePowerSet: (update: Partial<OtherscapePowerSet>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapePowerSet: (next: OtherscapePowerSet) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapePowerSet: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapePowerSet())
        },
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
        updateMeta: (update: Partial<PowerSetMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    ...current.meta,
                    ...update,
                },
            })),
    }
}

export function useOtherscapePowerSetViewStore() {
    const tab = useOtherscapePowerSetTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapePowerSetViewState = {
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

    const patchView = (patch: Partial<OtherscapePowerSetViewState>) => {
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
            background: OtherscapePowerSetViewState['background']
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
            partial: Partial<OtherscapePowerSetViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapePowerSetView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapePowerSetSheetStore() {
    const tab = useOtherscapePowerSetTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapePowerSetSheetState

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

            setTabSheet(tab.id, cloneValue(defaultOtherscapePowerSetSheetState))
        },
    }
}

export function isEmptySection(
    otherscapePowerSet: OtherscapePowerSet,
    id: SectionId
) {
    switch (id) {
        case 'description':
            return !otherscapePowerSet.description.trim()
        case 'specials':
            return !otherscapePowerSet.specials.length
        case 'threats':
            return !otherscapePowerSet.threats.length
        case 'generalConsequences':
            return !otherscapePowerSet.general_consequences.length
        case 'meta': {
            const meta = otherscapePowerSet.meta
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
    otherscapePowerSet: OtherscapePowerSet,
    id: SectionId,
    view: OtherscapePowerSetViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapePowerSet, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapePowerSet: OtherscapePowerSet,
    sectionIds: SectionId[],
    view: OtherscapePowerSetViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapePowerSet, sectionId, view)
    )
}

export function getOtherscapePowerSetPreviewWidth(
    view: OtherscapePowerSetViewState
) {
    return view.previewWidth
}

export function getLiveOtherscapePowerSetTab() {
    return getOtherscapePowerSetTab()
}
