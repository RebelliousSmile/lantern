import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    OtherscapeThemeKit,
    OtherscapeThemeKitSheetState,
    OtherscapeThemeKitViewState,
    SectionId,
    SheetTarget,
    TagField,
    ThemeKitMeta,
    ThemeType,
} from './model'
import {
    blankOtherscapeThemeKit,
    defaultHidden,
    defaultOtherscapeThemeKitSheetState,
    defaultOtherscapeThemeKitView,
} from './model'

type OtherscapeThemeKitTab = WorkspaceTab<
    OtherscapeThemeKit,
    OtherscapeThemeKitViewState,
    OtherscapeThemeKitSheetState
>

const TEMPLATE_ID = 'otherscape.themeKit'

/** The two tag fields map onto the two document keys holding them. */
const TAG_KEY: Record<TagField, 'power_tags' | 'weakness_tags'> = {
    power: 'power_tags',
    weakness: 'weakness_tags',
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const fallbackOtherscapeThemeKit = blankOtherscapeThemeKit()
const fallbackView = cloneValue(defaultOtherscapeThemeKitView)

function normalizeBackground(
    background: OtherscapeThemeKitViewState['background'] | undefined
): OtherscapeThemeKitViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapeThemeKitTab() {
    return useActiveTemplateTab<
        OtherscapeThemeKit,
        OtherscapeThemeKitViewState,
        OtherscapeThemeKitSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeThemeKitTab(): OtherscapeThemeKitTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeThemeKitTab
}

export type {
    OtherscapeThemeKit,
    OtherscapeThemeKitSheetState,
    OtherscapeThemeKitViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    TagField,
    ThemeKitMeta,
    ThemeType,
} from './model'

export function useOtherscapeThemeKitStore() {
    const tab = useOtherscapeThemeKitTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeThemeKit = tab?.doc ?? fallbackOtherscapeThemeKit

    const apply = (
        producer: (current: OtherscapeThemeKit) => OtherscapeThemeKit
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeThemeKit))
        )
    }

    const applyToTags = (
        field: TagField,
        producer: (tags: string[]) => string[] | null
    ) =>
        apply((current) => {
            const key = TAG_KEY[field]
            const next = producer([...current[key]])
            if (!next) return current

            return { ...current, [key]: next }
        })

    return {
        otherscapeThemeKit,
        setOtherscapeThemeKit: (update: Partial<OtherscapeThemeKit>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapeThemeKit: (next: OtherscapeThemeKit) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeThemeKit: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeThemeKit())
        },
        setTitleTag: (title_tag: string) =>
            apply((current) => ({ ...current, title_tag })),
        setThemeType: (theme_type: ThemeType) =>
            apply((current) => ({ ...current, theme_type })),
        setCategory: (category: string) =>
            apply((current) => ({ ...current, category })),
        setQuest: (quest: string) =>
            apply((current) => ({ ...current, quest })),
        addTag: (field: TagField, tag: string) =>
            applyToTags(field, (tags) => {
                const next = tag.trim()
                return next ? [...tags, next] : null
            }),
        replaceTagAt: (field: TagField, index: number, tag: string) =>
            applyToTags(field, (tags) => {
                if (index < 0 || index >= tags.length) return null

                const next = tag.trim()
                if (!next) return null

                tags[index] = next
                return tags
            }),
        removeTagAt: (field: TagField, index: number) =>
            applyToTags(field, (tags) => {
                if (index < 0 || index >= tags.length) return null

                tags.splice(index, 1)
                return tags
            }),
        moveTag: (field: TagField, from: number, to: number) =>
            applyToTags(field, (tags) => {
                if (
                    from < 0 ||
                    from >= tags.length ||
                    to < 0 ||
                    to >= tags.length
                ) {
                    return null
                }

                const [item] = tags.splice(from, 1)
                tags.splice(to, 0, item)
                return tags
            }),
        updateMeta: (update: Partial<ThemeKitMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    ...current.meta,
                    ...update,
                    publication_type:
                        update.publication_type ??
                        current.meta.publication_type ??
                        'homebrew',
                },
            })),
    }
}

export function useOtherscapeThemeKitViewStore() {
    const tab = useOtherscapeThemeKitTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeThemeKitViewState = {
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

    const patchView = (patch: Partial<OtherscapeThemeKitViewState>) => {
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
            background: OtherscapeThemeKitViewState['background']
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
            partial: Partial<OtherscapeThemeKitViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeThemeKitView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeThemeKitSheetStore() {
    const tab = useOtherscapeThemeKitTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeThemeKitSheetState

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

            setTabSheet(tab.id, cloneValue(defaultOtherscapeThemeKitSheetState))
        },
    }
}

export function isEmptySection(
    otherscapeThemeKit: OtherscapeThemeKit,
    id: SectionId
) {
    switch (id) {
        case 'powerTags':
            return !otherscapeThemeKit.power_tags.length
        case 'weaknessTags':
            return !otherscapeThemeKit.weakness_tags.length
        case 'quest':
            return !otherscapeThemeKit.quest.trim()
        case 'meta': {
            // `publication_type` is always set, since the document materializes
            // it, so it cannot be what makes the footer worth printing: a kit
            // that credits no one and names no source has an empty footer.
            const meta = otherscapeThemeKit.meta
            const hasMeta =
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
    otherscapeThemeKit: OtherscapeThemeKit,
    id: SectionId,
    view: OtherscapeThemeKitViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeThemeKit, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapeThemeKit: OtherscapeThemeKit,
    sectionIds: SectionId[],
    view: OtherscapeThemeKitViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapeThemeKit, sectionId, view)
    )
}

export function getOtherscapeThemeKitPreviewWidth(
    view: OtherscapeThemeKitViewState
) {
    return view.previewWidth
}

export function getLiveOtherscapeThemeKitTab() {
    return getOtherscapeThemeKitTab()
}
