import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import { PBTA_GAME_DEFINITION_TEMPLATE_ID } from '../shared/gameDefinition'
import type {
    CharacterSection,
    FrontsSection,
    GameDefinitionSheetState,
    GameDefinitionViewState,
    McSection,
    NpcSection,
    PbtaGameDefinition,
    SectionId,
    SheetTarget,
} from './model'
import {
    blankGameDefinition,
    defaultGameDefinitionSheetState,
    defaultGameDefinitionView,
    defaultHidden,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type GameDefinitionTab = WorkspaceTab<
    PbtaGameDefinition,
    GameDefinitionViewState,
    GameDefinitionSheetState
>

const TEMPLATE_ID = PBTA_GAME_DEFINITION_TEMPLATE_ID
const fallbackGameDefinition = blankGameDefinition()
const fallbackView = cloneValue(defaultGameDefinitionView)

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

function useGameDefinitionTab() {
    return useActiveTemplateTab<
        PbtaGameDefinition,
        GameDefinitionViewState,
        GameDefinitionSheetState
    >(TEMPLATE_ID)
}

function getGameDefinitionTab(): GameDefinitionTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as GameDefinitionTab
}

export type {
    CharacterSection,
    ClockPreset,
    ExportPrefs,
    FrontsSection,
    GameDefinitionSheetState,
    GameDefinitionViewState,
    McSection,
    NpcSection,
    PbtaGameDefinition,
    RollResult,
    SectionId,
    SheetTarget,
    StatToggle,
} from './model'

export function useGameDefinitionStore() {
    const tab = useGameDefinitionTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const gameDefinition = tab?.doc ?? fallbackGameDefinition

    const apply = (
        producer: (current: PbtaGameDefinition) => PbtaGameDefinition
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as PbtaGameDefinition))
        )
    }

    return {
        gameDefinition,
        setGameDefinition: (update: Partial<PbtaGameDefinition>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceGameDefinition: (next: PbtaGameDefinition) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetGameDefinition: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankGameDefinition())
        },
        setCharacter: (update: Partial<CharacterSection>) =>
            apply((current) => ({
                ...current,
                character: { ...current.character, ...update },
            })),
        /* npc/mc/fronts can be absent rather than empty: a definition with no
           MC-facing content prints no MC block at all, so writing a section and
           clearing it are two separate actions. */
        setNpc: (update: Partial<NpcSection>) =>
            apply((current) => ({
                ...current,
                npc: {
                    attributes: current.npc?.attributes ?? {},
                    moveTypes: current.npc?.moveTypes ?? {},
                    equipmentTypes: current.npc?.equipmentTypes ?? {},
                    description: current.npc?.description ?? '',
                    ...update,
                },
            })),
        clearNpc: () => apply((current) => ({ ...current, npc: null })),
        setMc: (update: Partial<McSection>) =>
            apply((current) => ({
                ...current,
                mc: {
                    moveTypes: current.mc?.moveTypes ?? {},
                    description: current.mc?.description ?? '',
                    ...update,
                },
            })),
        clearMc: () => apply((current) => ({ ...current, mc: null })),
        setFronts: (update: Partial<FrontsSection>) =>
            apply((current) => ({
                ...current,
                fronts: {
                    threatTypes: current.fronts?.threatTypes ?? {},
                    impulses: current.fronts?.impulses ?? {},
                    clockPresets: current.fronts?.clockPresets ?? [],
                    ...update,
                },
            })),
        clearFronts: () => apply((current) => ({ ...current, fronts: null })),
    }
}

export function useGameDefinitionViewStore() {
    const tab = useGameDefinitionTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: GameDefinitionViewState = {
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

    const patchView = (patch: Partial<GameDefinitionViewState>) => {
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
        setExportPrefs: (
            partial: Partial<GameDefinitionViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultGameDefinitionView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useGameDefinitionSheetStore() {
    const tab = useGameDefinitionTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultGameDefinitionSheetState

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

            setTabSheet(tab.id, cloneValue(defaultGameDefinitionSheetState))
        },
    }
}

export function getGameDefinitionPreviewWidth(view: GameDefinitionViewState) {
    return view.previewWidth
}

export function isEmptySection(
    gameDefinition: PbtaGameDefinition,
    id: SectionId
) {
    switch (id) {
        case 'roll':
            return (
                Object.keys(gameDefinition.rollResults).length === 0 &&
                gameDefinition.minMod == null &&
                gameDefinition.maxMod == null
            )
        case 'character':
            return (
                Object.keys(gameDefinition.character.stats).length === 0 &&
                Object.keys(gameDefinition.character.attributes).length === 0 &&
                Object.keys(gameDefinition.character.moveTypes).length === 0
            )
        case 'npc':
            return !gameDefinition.npc
        case 'mc':
            return !gameDefinition.mc
        case 'fronts':
            return !gameDefinition.fronts
        default:
            return true
    }
}

export function shouldShow(
    gameDefinition: PbtaGameDefinition,
    id: SectionId,
    view: GameDefinitionViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(gameDefinition, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    gameDefinition: PbtaGameDefinition,
    sectionIds: SectionId[],
    view: GameDefinitionViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(gameDefinition, sectionId, view)
    )
}

export function getLiveGameDefinitionTab() {
    return getGameDefinitionTab()
}
