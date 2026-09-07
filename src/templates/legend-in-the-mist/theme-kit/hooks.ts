import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    LegendInTheMistThemeKit,
    LegendInTheMistThemeKitSheetState,
    LegendInTheMistThemeKitViewState,
    SectionId,
    SheetTarget,
    TagField,
    ThemeKitImprovement,
    ThemeKitMeta,
} from './model'
import {
    blankLegendInTheMistThemeKit,
    defaultHidden,
    defaultLegendInTheMistThemeKitSheetState,
    defaultLegendInTheMistThemeKitView,
} from './model'

type LegendInTheMistThemeKitTab = WorkspaceTab<
    LegendInTheMistThemeKit,
    LegendInTheMistThemeKitViewState,
    LegendInTheMistThemeKitSheetState
>

const TEMPLATE_ID = 'legend.themeKit'

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

const fallbackLegendInTheMistThemeKit = blankLegendInTheMistThemeKit()
const fallbackView = cloneValue(defaultLegendInTheMistThemeKitView)

function normalizeBackground(
    background: LegendInTheMistThemeKitViewState['background'] | undefined
): LegendInTheMistThemeKitViewState['background'] {
    return background === 'plain' ? 'plain' : 'parchment'
}

function useLegendInTheMistThemeKitTab() {
    return useActiveTemplateTab<
        LegendInTheMistThemeKit,
        LegendInTheMistThemeKitViewState,
        LegendInTheMistThemeKitSheetState
    >(TEMPLATE_ID)
}

function getLegendInTheMistThemeKitTab(): LegendInTheMistThemeKitTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as LegendInTheMistThemeKitTab
}

export type {
    LegendInTheMistThemeKit,
    LegendInTheMistThemeKitSheetState,
    LegendInTheMistThemeKitViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    TagField,
    ThemeKitImprovement,
    ThemeKitMeta,
} from './model'

export function useLegendInTheMistThemeKitStore() {
    const tab = useLegendInTheMistThemeKitTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const legendInTheMistThemeKit = tab?.doc ?? fallbackLegendInTheMistThemeKit

    const apply = (
        producer: (current: LegendInTheMistThemeKit) => LegendInTheMistThemeKit
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as LegendInTheMistThemeKit))
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

    const applyToImprovements = (
        producer: (
            improvements: ThemeKitImprovement[]
        ) => ThemeKitImprovement[] | null
    ) =>
        apply((current) => {
            const next = producer([...current.improvements])
            if (!next) return current

            return { ...current, improvements: next }
        })

    return {
        legendInTheMistThemeKit,
        setLegendInTheMistThemeKit: (
            update: Partial<LegendInTheMistThemeKit>
        ) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceLegendInTheMistThemeKit: (next: LegendInTheMistThemeKit) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetLegendInTheMistThemeKit: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankLegendInTheMistThemeKit())
        },
        setName: (name: string) => apply((current) => ({ ...current, name })),
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
        addImprovement: (improvement: ThemeKitImprovement) =>
            applyToImprovements((improvements) => {
                const name = improvement.name.trim()
                if (!name) return null

                const effect = improvement.effect?.trim()
                return [
                    ...improvements,
                    effect ? { name, effect } : { name },
                ]
            }),
        replaceImprovementAt: (
            index: number,
            improvement: ThemeKitImprovement
        ) =>
            applyToImprovements((improvements) => {
                if (index < 0 || index >= improvements.length) return null

                const name = improvement.name.trim()
                if (!name) return null

                const effect = improvement.effect?.trim()
                improvements[index] = effect ? { name, effect } : { name }
                return improvements
            }),
        removeImprovementAt: (index: number) =>
            applyToImprovements((improvements) => {
                if (index < 0 || index >= improvements.length) return null

                improvements.splice(index, 1)
                return improvements
            }),
        moveImprovement: (from: number, to: number) =>
            applyToImprovements((improvements) => {
                if (
                    from < 0 ||
                    from >= improvements.length ||
                    to < 0 ||
                    to >= improvements.length
                ) {
                    return null
                }

                const [item] = improvements.splice(from, 1)
                improvements.splice(to, 0, item)
                return improvements
            }),
        updateMeta: (update: Partial<ThemeKitMeta>) =>
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

export function useLegendInTheMistThemeKitViewStore() {
    const tab = useLegendInTheMistThemeKitTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: LegendInTheMistThemeKitViewState = {
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

    const patchView = (patch: Partial<LegendInTheMistThemeKitViewState>) => {
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
            background: LegendInTheMistThemeKitViewState['background']
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
            partial: Partial<LegendInTheMistThemeKitViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultLegendInTheMistThemeKitView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useLegendInTheMistThemeKitSheetStore() {
    const tab = useLegendInTheMistThemeKitTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultLegendInTheMistThemeKitSheetState

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
                cloneValue(defaultLegendInTheMistThemeKitSheetState)
            )
        },
    }
}

export function isEmptySection(
    legendInTheMistThemeKit: LegendInTheMistThemeKit,
    id: SectionId
) {
    switch (id) {
        case 'powerTags':
            return !legendInTheMistThemeKit.power_tags.length
        case 'weaknessTags':
            return !legendInTheMistThemeKit.weakness_tags.length
        case 'quest':
            return !legendInTheMistThemeKit.quest.trim()
        case 'improvements':
            return !legendInTheMistThemeKit.improvements.length
        case 'meta': {
            const meta = legendInTheMistThemeKit.meta
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
    legendInTheMistThemeKit: LegendInTheMistThemeKit,
    id: SectionId,
    view: LegendInTheMistThemeKitViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(legendInTheMistThemeKit, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    legendInTheMistThemeKit: LegendInTheMistThemeKit,
    sectionIds: SectionId[],
    view: LegendInTheMistThemeKitViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(legendInTheMistThemeKit, sectionId, view)
    )
}

export function getLegendInTheMistThemeKitPreviewWidth(
    view: LegendInTheMistThemeKitViewState
) {
    return view.previewWidth
}

export function getLiveLegendInTheMistThemeKitTab() {
    return getLegendInTheMistThemeKitTab()
}
