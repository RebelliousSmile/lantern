import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    LoadoutItemMeta,
    OtherscapeLoadoutItem,
    OtherscapeLoadoutItemSheetState,
    OtherscapeLoadoutItemViewState,
    SectionId,
    SheetTarget,
} from './model'
import {
    NAME_TAG_INDEX,
    blankOtherscapeLoadoutItem,
    defaultHidden,
    defaultOtherscapeLoadoutItemSheetState,
    defaultOtherscapeLoadoutItemView,
    featureTagsAfterName,
} from './model'

type OtherscapeLoadoutItemTab = WorkspaceTab<
    OtherscapeLoadoutItem,
    OtherscapeLoadoutItemViewState,
    OtherscapeLoadoutItemSheetState
>

const TEMPLATE_ID = 'otherscape.loadoutItem'

/* Only one of the two tag fields is a list. The weakness is a single slot, so
   it is written through `setWeaknessTag` rather than through the list
   mutators, and the list mutators take the feature field alone. */

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const fallbackOtherscapeLoadoutItem = blankOtherscapeLoadoutItem()
const fallbackView = cloneValue(defaultOtherscapeLoadoutItemView)

function normalizeBackground(
    background: OtherscapeLoadoutItemViewState['background'] | undefined
): OtherscapeLoadoutItemViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapeLoadoutItemTab() {
    return useActiveTemplateTab<
        OtherscapeLoadoutItem,
        OtherscapeLoadoutItemViewState,
        OtherscapeLoadoutItemSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeLoadoutItemTab(): OtherscapeLoadoutItemTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeLoadoutItemTab
}

export type {
    LoadoutItemMeta,
    OtherscapeLoadoutItem,
    OtherscapeLoadoutItemSheetState,
    OtherscapeLoadoutItemViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    TagField,
} from './model'

export function useOtherscapeLoadoutItemStore() {
    const tab = useOtherscapeLoadoutItemTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeLoadoutItem = tab?.doc ?? fallbackOtherscapeLoadoutItem

    const apply = (
        producer: (current: OtherscapeLoadoutItem) => OtherscapeLoadoutItem
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeLoadoutItem))
        )
    }

    const applyToFeatureTags = (
        producer: (tags: string[]) => string[] | null
    ) =>
        apply((current) => {
            const next = producer([...current.feature_tags])
            if (!next) return current

            return { ...current, feature_tags: next }
        })

    return {
        otherscapeLoadoutItem,
        setOtherscapeLoadoutItem: (update: Partial<OtherscapeLoadoutItem>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapeLoadoutItem: (next: OtherscapeLoadoutItem) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeLoadoutItem: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeLoadoutItem())
        },
        /* Renaming rewrites the first feature tag with it: the Street
           Catalog convention is that the two hold the same string, and a
           rename that left the tag behind would print the old name on the
           card while the header showed the new one. */
        setName: (name: string) =>
            apply((current) => {
                const feature_tags = [...current.feature_tags]
                feature_tags[NAME_TAG_INDEX] = name
                return { ...current, name, feature_tags }
            }),
        setCategory: (category: string) =>
            apply((current) => ({ ...current, category })),
        setDescription: (description: string) =>
            apply((current) => ({ ...current, description })),
        setWeaknessTag: (weakness_tag: string) =>
            apply((current) => ({ ...current, weakness_tag })),
        addTag: (tag: string) =>
            applyToFeatureTags((tags) => {
                const next = tag.trim()
                return next ? [...tags, next] : null
            }),
        replaceTagAt: (index: number, tag: string) =>
            applyToFeatureTags((tags) => {
                if (index < 0 || index >= tags.length) return null

                const next = tag.trim()
                if (!next) return null

                tags[index] = next
                return tags
            }),
        removeTagAt: (index: number) =>
            applyToFeatureTags((tags) => {
                if (index < 0 || index >= tags.length) return null

                tags.splice(index, 1)
                return tags
            }),
        moveTag: (from: number, to: number) =>
            applyToFeatureTags((tags) => {
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
        updateMeta: (update: Partial<LoadoutItemMeta>) =>
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

export function useOtherscapeLoadoutItemViewStore() {
    const tab = useOtherscapeLoadoutItemTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeLoadoutItemViewState = {
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

    const patchView = (patch: Partial<OtherscapeLoadoutItemViewState>) => {
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
            background: OtherscapeLoadoutItemViewState['background']
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
            partial: Partial<OtherscapeLoadoutItemViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeLoadoutItemView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeLoadoutItemSheetStore() {
    const tab = useOtherscapeLoadoutItemTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeLoadoutItemSheetState

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
                cloneValue(defaultOtherscapeLoadoutItemSheetState)
            )
        },
    }
}

export function isEmptySection(
    otherscapeLoadoutItem: OtherscapeLoadoutItem,
    id: SectionId
) {
    switch (id) {
        case 'description':
            return !otherscapeLoadoutItem.description.trim()
        case 'featureTags':
            /* The first tag is the name, which the header already prints, so
               a list holding nothing else leaves the band with nothing of its
               own to say. */
            return featureTagsAfterName(otherscapeLoadoutItem).length === 0
        case 'weaknessTag':
            return !otherscapeLoadoutItem.weakness_tag.trim()
        case 'meta': {
            // `publication_type` is always set, since the document materializes
            // it, so it cannot be what makes the footer worth printing: a kit
            // that credits no one and names no source has an empty footer.
            const meta = otherscapeLoadoutItem.meta
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
    otherscapeLoadoutItem: OtherscapeLoadoutItem,
    id: SectionId,
    view: OtherscapeLoadoutItemViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeLoadoutItem, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapeLoadoutItem: OtherscapeLoadoutItem,
    sectionIds: SectionId[],
    view: OtherscapeLoadoutItemViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapeLoadoutItem, sectionId, view)
    )
}

export function getOtherscapeLoadoutItemPreviewWidth(
    view: OtherscapeLoadoutItemViewState
) {
    return view.previewWidth
}

export function getLiveOtherscapeLoadoutItemTab() {
    return getOtherscapeLoadoutItemTab()
}
