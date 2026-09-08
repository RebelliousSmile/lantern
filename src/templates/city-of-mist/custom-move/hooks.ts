import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    CityOfMistCustomMove,
    CityOfMistCustomMoveSheetState,
    CityOfMistCustomMoveViewState,
    CustomMoveMeta,
    Outcome,
    Roll,
    SectionId,
    SheetTarget,
} from './model'
import {
    blankCityOfMistCustomMove,
    defaultCityOfMistCustomMoveSheetState,
    defaultCityOfMistCustomMoveView,
    defaultHidden,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type CityOfMistCustomMoveTab = WorkspaceTab<
    CityOfMistCustomMove,
    CityOfMistCustomMoveViewState,
    CityOfMistCustomMoveSheetState
>

const TEMPLATE_ID = 'city.customMove'
const fallbackCityOfMistCustomMove = blankCityOfMistCustomMove()
const fallbackView = cloneValue(defaultCityOfMistCustomMoveView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrNull(v?: string | null) {
    const s = (v ?? '').trim()
    return s ? s : null
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

function useCityOfMistCustomMoveTab() {
    return useActiveTemplateTab<
        CityOfMistCustomMove,
        CityOfMistCustomMoveViewState,
        CityOfMistCustomMoveSheetState
    >(TEMPLATE_ID)
}

function getCityOfMistCustomMoveTab(): CityOfMistCustomMoveTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as CityOfMistCustomMoveTab
}

export type {
    Background,
    CityOfMistCustomMove,
    CityOfMistCustomMoveSheetState,
    CityOfMistCustomMoveViewState,
    CustomMoveKind,
    CustomMoveMeta,
    ExportPrefs,
    MoveTemplate,
    Outcome,
    OutcomeTier,
    PublicationType,
    Roll,
    RollStat,
    SectionId,
    SheetTarget,
} from './model'

export function useCityOfMistCustomMoveStore() {
    const tab = useCityOfMistCustomMoveTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const cityOfMistCustomMove = tab?.doc ?? fallbackCityOfMistCustomMove

    const apply = (
        producer: (current: CityOfMistCustomMove) => CityOfMistCustomMove
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as CityOfMistCustomMove))
        )
    }

    return {
        cityOfMistCustomMove,
        setCityOfMistCustomMove: (update: Partial<CityOfMistCustomMove>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceCityOfMistCustomMove: (next: CityOfMistCustomMove) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetCityOfMistCustomMove: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankCityOfMistCustomMove())
        },
        /* The roll is the one part of a move that can be absent rather than
           empty: a move without one prints no roll block at all, so writing it
           and clearing it have to be two separate actions. */
        setRoll: (update: Partial<Roll>) =>
            apply((current) => {
                const prev = current.roll
                return {
                    ...current,
                    roll: {
                        stat: update.stat ?? prev?.stat ?? 'power',
                        label: update.label ?? prev?.label,
                        modifier: clamp(
                            update.modifier ?? prev?.modifier ?? 0,
                            -4,
                            4
                        ),
                    },
                }
            }),
        clearRoll: () =>
            apply((current) => ({
                ...current,
                roll: null,
            })),
        addOutcome: (outcome: Outcome) =>
            apply((current) => ({
                ...current,
                outcomes: [
                    ...current.outcomes,
                    {
                        tier: outcome.tier,
                        text: strOrFallback(
                            outcome.text,
                            'Describe what happens.'
                        ),
                        ...(outcome.options?.length
                            ? { options: [...outcome.options] }
                            : {}),
                        ...(outcome.pick_count
                            ? { pick_count: outcome.pick_count }
                            : {}),
                    },
                ],
            })),
        updateOutcomeAt: (index: number, update: Partial<Outcome>) =>
            apply((current) => {
                const arr = [...current.outcomes]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    tier: update.tier ?? prev.tier,
                    text: strOrFallback(update.text ?? prev.text, prev.text),
                }

                return { ...current, outcomes: arr }
            }),
        removeOutcomeAt: (index: number) =>
            apply((current) => {
                const arr = [...current.outcomes]
                arr.splice(index, 1)
                return { ...current, outcomes: arr }
            }),
        moveOutcome: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.outcomes]
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
                return { ...current, outcomes: arr }
            }),
        updateMeta: (update: Partial<CustomMoveMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    publication_type:
                        current.meta?.publication_type || 'homebrew',
                    ...(current.meta || {}),
                    ...update,
                    source:
                        strOrNull(update.source ?? current.meta?.source) ??
                        undefined,
                },
            })),
    }
}

export function useCityOfMistCustomMoveViewStore() {
    const tab = useCityOfMistCustomMoveTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: CityOfMistCustomMoveViewState = {
        ...fallbackView,
        ...tabView,
        hidden: {
            ...fallbackView.hidden,
            ...(tabView?.hidden ?? {}),
        },
        exportPrefs: {
            ...fallbackView.exportPrefs,
            ...(tabView?.exportPrefs ?? {}),
        },
    }

    const patchView = (patch: Partial<CityOfMistCustomMoveViewState>) => {
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
                previewWidth: clamp(
                    previewWidth,
                    PREVIEW_WIDTH_MIN,
                    PREVIEW_WIDTH_MAX
                ),
            }),
        setBackground: (
            background: CityOfMistCustomMoveViewState['background']
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
        setShowSeparators: (showSeparators: boolean) =>
            patchView({ showSeparators }),
        setExportPrefs: (
            partial: Partial<CityOfMistCustomMoveViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultCityOfMistCustomMoveView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useCityOfMistCustomMoveSheetStore() {
    const tab = useCityOfMistCustomMoveTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultCityOfMistCustomMoveSheetState

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
                cloneValue(defaultCityOfMistCustomMoveSheetState)
            )
        },
    }
}

export function getCityOfMistCustomMovePreviewWidth(
    view: CityOfMistCustomMoveViewState
) {
    return view.previewWidth
}

export function isEmptySection(
    cityOfMistCustomMove: CityOfMistCustomMove,
    id: SectionId
) {
    switch (id) {
        case 'trigger':
            return !cityOfMistCustomMove.trigger?.trim()
        case 'roll':
            return !cityOfMistCustomMove.roll
        case 'outcomes':
            return !cityOfMistCustomMove.outcomes.length
        case 'meta': {
            const meta = cityOfMistCustomMove.meta
            if (!meta) return true

            const hasMeta =
                !!meta.publication_type ||
                !!(meta.source && String(meta.source).trim()) ||
                (Array.isArray(meta.authors) && meta.authors.length > 0) ||
                meta.page != null
            return !hasMeta
        }
        default:
            return true
    }
}

export function shouldShow(
    cityOfMistCustomMove: CityOfMistCustomMove,
    id: SectionId,
    view: CityOfMistCustomMoveViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(cityOfMistCustomMove, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    cityOfMistCustomMove: CityOfMistCustomMove,
    sectionIds: SectionId[],
    view: CityOfMistCustomMoveViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(cityOfMistCustomMove, sectionId, view)
    )
}

export function getLiveCityOfMistCustomMoveTab() {
    return getCityOfMistCustomMoveTab()
}
