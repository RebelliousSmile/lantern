import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    CharacterTropeMeta,
    OtherscapeCharacterTrope,
    OtherscapeCharacterTropeSheetState,
    OtherscapeCharacterTropeViewState,
    SectionId,
    SheetTarget,
    ThemeKitRef,
} from './model'
import {
    blankOtherscapeCharacterTrope,
    defaultHidden,
    defaultOtherscapeCharacterTropeSheetState,
    defaultOtherscapeCharacterTropeView,
} from './model'

type OtherscapeCharacterTropeTab = WorkspaceTab<
    OtherscapeCharacterTrope,
    OtherscapeCharacterTropeViewState,
    OtherscapeCharacterTropeSheetState
>

const TEMPLATE_ID = 'otherscape.characterTrope'
const fallbackOtherscapeCharacterTrope = blankOtherscapeCharacterTrope()
const fallbackView = cloneValue(defaultOtherscapeCharacterTropeView)

function strOrFallback(v: string | undefined, fallback: string) {
    const s = (v ?? '').trim()
    return s || fallback
}

function normalizeThemeKitRef(kit: ThemeKitRef): ThemeKitRef {
    return {
        title_tag: strOrFallback(kit.title_tag, 'Untitled Theme Kit'),
        category: strOrFallback(kit.category, 'UNFILED'),
    }
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function normalizeBackground(
    background: OtherscapeCharacterTropeViewState['background'] | undefined
): OtherscapeCharacterTropeViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapeCharacterTropeTab() {
    return useActiveTemplateTab<
        OtherscapeCharacterTrope,
        OtherscapeCharacterTropeViewState,
        OtherscapeCharacterTropeSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeCharacterTropeTab(): OtherscapeCharacterTropeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeCharacterTropeTab
}

export type {
    CharacterTropeMeta,
    OtherscapeCharacterTrope,
    OtherscapeCharacterTropeSheetState,
    OtherscapeCharacterTropeViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    ThemeKitRef,
} from './model'

// These template-scoped hooks replace the legacy global stores while keeping
// the editor and preview API familiar for the character trope module.
export function useOtherscapeCharacterTropeStore() {
    const tab = useOtherscapeCharacterTropeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeCharacterTrope =
        tab?.doc ?? fallbackOtherscapeCharacterTrope

    const apply = (
        producer: (
            current: OtherscapeCharacterTrope
        ) => OtherscapeCharacterTrope
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeCharacterTrope))
        )
    }

    return {
        otherscapeCharacterTrope,
        setOtherscapeCharacterTrope: (
            update: Partial<OtherscapeCharacterTrope>
        ) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapeCharacterTrope: (next: OtherscapeCharacterTrope) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeCharacterTrope: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeCharacterTrope())
        },
        addThemeKit: (kit: ThemeKitRef) =>
            apply((current) => ({
                ...current,
                theme_kits: [...current.theme_kits, normalizeThemeKitRef(kit)],
            })),
        updateThemeKitAt: (index: number, update: Partial<ThemeKitRef>) =>
            apply((current) => {
                const arr = [...current.theme_kits]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = normalizeThemeKitRef({ ...prev, ...update })
                return { ...current, theme_kits: arr }
            }),
        removeThemeKitAt: (index: number) =>
            apply((current) => {
                const arr = [...current.theme_kits]
                arr.splice(index, 1)
                return { ...current, theme_kits: arr }
            }),
        moveThemeKit: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.theme_kits]
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
                return { ...current, theme_kits: arr }
            }),
        // The choice list is edited on its own, despite sharing the entry
        // shape: what a trope grants and what it asks the player to pick are
        // two different statements about the character.
        addChoice: (choice: ThemeKitRef) =>
            apply((current) => ({
                ...current,
                choices: [...current.choices, normalizeThemeKitRef(choice)],
            })),
        updateChoiceAt: (index: number, update: Partial<ThemeKitRef>) =>
            apply((current) => {
                const arr = [...current.choices]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = normalizeThemeKitRef({ ...prev, ...update })
                return { ...current, choices: arr }
            }),
        removeChoiceAt: (index: number) =>
            apply((current) => {
                const arr = [...current.choices]
                arr.splice(index, 1)
                return { ...current, choices: arr }
            }),
        moveChoice: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.choices]
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
                return { ...current, choices: arr }
            }),
        addLoadoutEntry: (text: string) =>
            apply((current) => ({
                ...current,
                loadout: [...current.loadout, text],
            })),
        updateLoadoutEntry: (index: number, text: string) =>
            apply((current) => {
                const arr = [...current.loadout]
                if (index < 0 || index >= arr.length) return current

                arr[index] = text
                return { ...current, loadout: arr }
            }),
        removeLoadoutEntry: (index: number) =>
            apply((current) => {
                const arr = [...current.loadout]
                arr.splice(index, 1)
                return { ...current, loadout: arr }
            }),
        moveLoadoutEntry: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.loadout]
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
                return { ...current, loadout: arr }
            }),
        updateMeta: (update: Partial<CharacterTropeMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    ...current.meta,
                    ...update,
                },
            })),
    }
}

export function useOtherscapeCharacterTropeViewStore() {
    const tab = useOtherscapeCharacterTropeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeCharacterTropeViewState = {
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

    const patchView = (patch: Partial<OtherscapeCharacterTropeViewState>) => {
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
            background: OtherscapeCharacterTropeViewState['background']
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
            partial: Partial<OtherscapeCharacterTropeViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeCharacterTropeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeCharacterTropeSheetStore() {
    const tab = useOtherscapeCharacterTropeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeCharacterTropeSheetState

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
                cloneValue(defaultOtherscapeCharacterTropeSheetState)
            )
        },
    }
}

export function isEmptySection(
    otherscapeCharacterTrope: OtherscapeCharacterTrope,
    id: SectionId
) {
    switch (id) {
        case 'description':
            return !otherscapeCharacterTrope.description.trim()
        case 'themeKits':
            return !otherscapeCharacterTrope.theme_kits.length
        case 'choices':
            return !otherscapeCharacterTrope.choices.length
        case 'loadout':
            return !otherscapeCharacterTrope.loadout.length
        case 'meta': {
            const meta = otherscapeCharacterTrope.meta
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
    otherscapeCharacterTrope: OtherscapeCharacterTrope,
    id: SectionId,
    view: OtherscapeCharacterTropeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeCharacterTrope, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapeCharacterTrope: OtherscapeCharacterTrope,
    sectionIds: SectionId[],
    view: OtherscapeCharacterTropeViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapeCharacterTrope, sectionId, view)
    )
}

export function getOtherscapeCharacterTropePreviewWidth(
    view: OtherscapeCharacterTropeViewState
) {
    return view.previewWidth
}

export function getLiveOtherscapeCharacterTropeTab() {
    return getOtherscapeCharacterTropeTab()
}
