import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    LegendInTheMistStoryTheme,
    LegendInTheMistStoryThemeSheetState,
    LegendInTheMistStoryThemeViewState,
    SectionId,
    SheetTarget,
    StoryThemeMeta,
    TagField,
    ThemeLevel,
} from './model'
import {
    blankLegendInTheMistStoryTheme,
    defaultHidden,
    defaultLegendInTheMistStoryThemeSheetState,
    defaultLegendInTheMistStoryThemeView,
} from './model'

type LegendInTheMistStoryThemeTab = WorkspaceTab<
    LegendInTheMistStoryTheme,
    LegendInTheMistStoryThemeViewState,
    LegendInTheMistStoryThemeSheetState
>

const TEMPLATE_ID = 'legend.storyTheme'

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

const fallbackLegendInTheMistStoryTheme = blankLegendInTheMistStoryTheme()
const fallbackView = cloneValue(defaultLegendInTheMistStoryThemeView)

/** Tracks count upwards with no ceiling of their own, so only the floor matters. */
function clampTrack(n: number) {
    return Math.max(0, Math.floor(Number(n) || 0))
}

function normalizeBackground(
    background: LegendInTheMistStoryThemeViewState['background'] | undefined
): LegendInTheMistStoryThemeViewState['background'] {
    return background === 'plain' ? 'plain' : 'parchment'
}

function useLegendInTheMistStoryThemeTab() {
    return useActiveTemplateTab<
        LegendInTheMistStoryTheme,
        LegendInTheMistStoryThemeViewState,
        LegendInTheMistStoryThemeSheetState
    >(TEMPLATE_ID)
}

function getLegendInTheMistStoryThemeTab(): LegendInTheMistStoryThemeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as LegendInTheMistStoryThemeTab
}

export type {
    LegendInTheMistStoryTheme,
    LegendInTheMistStoryThemeSheetState,
    LegendInTheMistStoryThemeViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    StoryThemeMeta,
    TagField,
    ThemeLevel,
} from './model'

export function useLegendInTheMistStoryThemeStore() {
    const tab = useLegendInTheMistStoryThemeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const legendInTheMistStoryTheme =
        tab?.doc ?? fallbackLegendInTheMistStoryTheme

    const apply = (
        producer: (
            current: LegendInTheMistStoryTheme
        ) => LegendInTheMistStoryTheme
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as LegendInTheMistStoryTheme))
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
        legendInTheMistStoryTheme,
        setLegendInTheMistStoryTheme: (
            update: Partial<LegendInTheMistStoryTheme>
        ) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceLegendInTheMistStoryTheme: (next: LegendInTheMistStoryTheme) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetLegendInTheMistStoryTheme: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankLegendInTheMistStoryTheme())
        },
        setTitleTag: (title_tag: string) =>
            apply((current) => ({ ...current, title_tag })),
        setLevel: (level: ThemeLevel) =>
            apply((current) => ({ ...current, level })),
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
        setImprove: (improve: number) =>
            apply((current) => ({ ...current, improve: clampTrack(improve) })),
        setAbandon: (abandon: number) =>
            apply((current) => ({ ...current, abandon: clampTrack(abandon) })),
        setMilestone: (milestone: boolean) =>
            apply((current) => ({ ...current, milestone: !!milestone })),
        toggleMilestone: () =>
            apply((current) => ({ ...current, milestone: !current.milestone })),
        updateMeta: (update: Partial<StoryThemeMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    publication_type:
                        current.meta?.publication_type || 'homebrew',
                    ...(current.meta || {}),
                    ...update,
                },
            })),
    }
}

export function useLegendInTheMistStoryThemeViewStore() {
    const tab = useLegendInTheMistStoryThemeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: LegendInTheMistStoryThemeViewState = {
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

    const patchView = (patch: Partial<LegendInTheMistStoryThemeViewState>) => {
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
            background: LegendInTheMistStoryThemeViewState['background']
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
            partial: Partial<LegendInTheMistStoryThemeViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultLegendInTheMistStoryThemeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useLegendInTheMistStoryThemeSheetStore() {
    const tab = useLegendInTheMistStoryThemeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultLegendInTheMistStoryThemeSheetState

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
                cloneValue(defaultLegendInTheMistStoryThemeSheetState)
            )
        },
    }
}

export function isEmptySection(
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme,
    id: SectionId
) {
    switch (id) {
        case 'category':
            return !legendInTheMistStoryTheme.category.trim()
        case 'powerTags':
            return !legendInTheMistStoryTheme.power_tags.length
        case 'weaknessTags':
            return !legendInTheMistStoryTheme.weakness_tags.length
        // The tracks live in this section too, so a theme that has marked
        // progress keeps its boxes on the card even with the quest unwritten.
        case 'quest':
            return (
                !legendInTheMistStoryTheme.quest.trim() &&
                legendInTheMistStoryTheme.improve === 0 &&
                legendInTheMistStoryTheme.abandon === 0 &&
                !legendInTheMistStoryTheme.milestone
            )
        case 'meta': {
            const meta = legendInTheMistStoryTheme.meta
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
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme,
    id: SectionId,
    view: LegendInTheMistStoryThemeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(legendInTheMistStoryTheme, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme,
    sectionIds: SectionId[],
    view: LegendInTheMistStoryThemeViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(legendInTheMistStoryTheme, sectionId, view)
    )
}

export function getLegendInTheMistStoryThemePreviewWidth(
    view: LegendInTheMistStoryThemeViewState
) {
    return view.previewWidth
}

export function getLiveLegendInTheMistStoryThemeTab() {
    return getLegendInTheMistStoryThemeTab()
}
