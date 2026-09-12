import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    ChoiceSet,
    CreationEntry,
    GearEntry,
    MoveEntry,
    PbtaPlaybook,
    PlaybookAttributeValue,
    PlaybookSheetState,
    PlaybookViewState,
    SectionId,
    SheetTarget,
} from './model'
import {
    blankPlaybook,
    defaultHidden,
    defaultPlaybookSheetState,
    defaultPlaybookView,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type PlaybookTab = WorkspaceTab<
    PbtaPlaybook,
    PlaybookViewState,
    PlaybookSheetState
>

const TEMPLATE_ID = 'pbta.playbook'
const fallbackPlaybook = blankPlaybook()
const fallbackView = cloneValue(defaultPlaybookView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function usePlaybookTab() {
    return useActiveTemplateTab<
        PbtaPlaybook,
        PlaybookViewState,
        PlaybookSheetState
    >(TEMPLATE_ID)
}

function getPlaybookTab(): PlaybookTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as PlaybookTab
}

export type {
    ChoiceEntry,
    ChoiceSet,
    CreationEntry,
    ExportPrefs,
    GearEntry,
    MoveEntry,
    MoveInline,
    MoveResult,
    MoveRollConfig,
    PbtaPlaybook,
    PlaybookAttributeValue,
    PlaybookSheetState,
    PlaybookViewState,
    SectionId,
    SheetTarget,
} from './model'

export function usePlaybookStore() {
    const tab = usePlaybookTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const playbook = tab?.doc ?? fallbackPlaybook

    const apply = (producer: (current: PbtaPlaybook) => PbtaPlaybook) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as PbtaPlaybook))
        )
    }

    return {
        playbook,
        setPlaybook: (update: Partial<PbtaPlaybook>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replacePlaybook: (next: PbtaPlaybook) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetPlaybook: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankPlaybook())
        },
        setStats: (stats: Record<string, number>) =>
            apply((current) => ({ ...current, stats })),
        setAttributes: (attributes: Record<string, PlaybookAttributeValue>) =>
            apply((current) => ({ ...current, attributes })),
        setMoves: (moves: MoveEntry[]) =>
            apply((current) => ({ ...current, moves })),
        setStartingMoves: (startingMoves: string[]) =>
            apply((current) => ({ ...current, startingMoves })),
        setChoiceSets: (choiceSets: ChoiceSet[]) =>
            apply((current) => ({ ...current, choiceSets })),
        setAdvancement: (advancement: string[]) =>
            apply((current) => ({ ...current, advancement })),
        setCreation: (creation: CreationEntry[]) =>
            apply((current) => ({ ...current, creation })),
        setGear: (gear: GearEntry[]) =>
            apply((current) => ({ ...current, gear })),
    }
}

export function usePlaybookViewStore() {
    const tab = usePlaybookTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: PlaybookViewState = {
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

    const patchView = (patch: Partial<PlaybookViewState>) => {
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
        setExportPrefs: (partial: Partial<PlaybookViewState['exportPrefs']>) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultPlaybookView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function usePlaybookSheetStore() {
    const tab = usePlaybookTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultPlaybookSheetState

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

            setTabSheet(tab.id, cloneValue(defaultPlaybookSheetState))
        },
    }
}

export function getPlaybookPreviewWidth(view: PlaybookViewState) {
    return view.previewWidth
}

export function isEmptySection(playbook: PbtaPlaybook, id: SectionId) {
    switch (id) {
        case 'stats':
            return (
                Object.keys(playbook.stats).length === 0 &&
                !playbook.statsDetail.trim()
            )
        case 'moves':
            return playbook.moves.length === 0
        case 'choiceSets':
            return playbook.choiceSets.length === 0
        case 'advancement':
            return playbook.advancement.length === 0
        case 'creation':
            return playbook.creation.length === 0
        case 'gear':
            return playbook.gear.length === 0
        default:
            return true
    }
}

export function shouldShow(
    playbook: PbtaPlaybook,
    id: SectionId,
    view: PlaybookViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(playbook, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    playbook: PbtaPlaybook,
    sectionIds: SectionId[],
    view: PlaybookViewState
) {
    return sectionIds.some((sectionId) => shouldShow(playbook, sectionId, view))
}

export function getLivePlaybookTab() {
    return getPlaybookTab()
}
