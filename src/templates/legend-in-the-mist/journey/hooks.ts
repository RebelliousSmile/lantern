import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    JourneyMeta,
    JourneyType,
    JourneyVignette,
    LegendInTheMistJourney,
    LegendInTheMistJourneySheetState,
    LegendInTheMistJourneyViewState,
    SectionId,
    SheetTarget,
} from './model'
import {
    blankLegendInTheMistJourney,
    defaultHidden,
    defaultLegendInTheMistJourneySheetState,
    defaultLegendInTheMistJourneyView,
} from './model'

type LegendInTheMistJourneyTab = WorkspaceTab<
    LegendInTheMistJourney,
    LegendInTheMistJourneyViewState,
    LegendInTheMistJourneySheetState
>

const TEMPLATE_ID = 'legend.journey'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const fallbackLegendInTheMistJourney = blankLegendInTheMistJourney()
const fallbackView = cloneValue(defaultLegendInTheMistJourneyView)

function normalizeBackground(
    background: LegendInTheMistJourneyViewState['background'] | undefined
): LegendInTheMistJourneyViewState['background'] {
    return background === 'plain' ? 'plain' : 'parchment'
}

function useLegendInTheMistJourneyTab() {
    return useActiveTemplateTab<
        LegendInTheMistJourney,
        LegendInTheMistJourneyViewState,
        LegendInTheMistJourneySheetState
    >(TEMPLATE_ID)
}

function getLegendInTheMistJourneyTab(): LegendInTheMistJourneyTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as LegendInTheMistJourneyTab
}

export type {
    JourneyMeta,
    JourneyType,
    JourneyVignette,
    LegendInTheMistJourney,
    LegendInTheMistJourneySheetState,
    LegendInTheMistJourneyViewState,
    PublicationType,
    SectionId,
    SheetTarget,
} from './model'

/** Move an item inside a list, or refuse when either end is out of range. */
function moveWithin<T>(list: T[], from: number, to: number): T[] | null {
    if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
        return null
    }

    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    return list
}

export function useLegendInTheMistJourneyStore() {
    const tab = useLegendInTheMistJourneyTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const legendInTheMistJourney = tab?.doc ?? fallbackLegendInTheMistJourney

    const apply = (
        producer: (current: LegendInTheMistJourney) => LegendInTheMistJourney
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as LegendInTheMistJourney))
        )
    }

    const applyToTags = (producer: (tags: string[]) => string[] | null) =>
        apply((current) => {
            const next = producer([...current.tags])
            if (!next) return current

            return { ...current, tags: next }
        })

    const applyToConsequences = (
        producer: (consequences: string[]) => string[] | null
    ) =>
        apply((current) => {
            const next = producer([...current.consequences])
            if (!next) return current

            return { ...current, consequences: next }
        })

    const applyToVignettes = (
        producer: (vignettes: JourneyVignette[]) => JourneyVignette[] | null
    ) =>
        apply((current) => {
            const next = producer([...current.vignettes])
            if (!next) return current

            return { ...current, vignettes: next }
        })

    /**
     * Edit the Consequence list of one vignette, addressed by its index. The
     * surrounding list is rebuilt around a fresh copy of that vignette alone,
     * so a neighbour is never rewritten by a change made here.
     */
    const applyToVignetteConsequences = (
        vignetteIndex: number,
        producer: (consequences: string[]) => string[] | null
    ) =>
        applyToVignettes((vignettes) => {
            if (vignetteIndex < 0 || vignetteIndex >= vignettes.length) {
                return null
            }

            const vignette = vignettes[vignetteIndex]
            const next = producer([...vignette.consequences])
            if (!next) return null

            vignettes[vignetteIndex] = { ...vignette, consequences: next }
            return vignettes
        })

    return {
        legendInTheMistJourney,
        setLegendInTheMistJourney: (update: Partial<LegendInTheMistJourney>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceLegendInTheMistJourney: (next: LegendInTheMistJourney) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetLegendInTheMistJourney: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankLegendInTheMistJourney())
        },
        setName: (name: string) => apply((current) => ({ ...current, name })),
        setType: (type: JourneyType) =>
            apply((current) => ({ ...current, type })),
        setDescription: (description: string) =>
            apply((current) => ({ ...current, description })),
        setBenefits: (benefits: string) =>
            apply((current) => ({ ...current, benefits })),

        addTag: (tag: string) =>
            applyToTags((tags) => {
                const next = tag.trim()
                return next ? [...tags, next] : null
            }),
        replaceTagAt: (index: number, tag: string) =>
            applyToTags((tags) => {
                if (index < 0 || index >= tags.length) return null

                const next = tag.trim()
                if (!next) return null

                tags[index] = next
                return tags
            }),
        removeTagAt: (index: number) =>
            applyToTags((tags) => {
                if (index < 0 || index >= tags.length) return null

                tags.splice(index, 1)
                return tags
            }),
        moveTag: (from: number, to: number) =>
            applyToTags((tags) => moveWithin(tags, from, to)),

        addConsequence: (consequence: string) =>
            applyToConsequences((consequences) => {
                const next = consequence.trim()
                return next ? [...consequences, next] : null
            }),
        replaceConsequenceAt: (index: number, consequence: string) =>
            applyToConsequences((consequences) => {
                if (index < 0 || index >= consequences.length) return null

                const next = consequence.trim()
                if (!next) return null

                consequences[index] = next
                return consequences
            }),
        removeConsequenceAt: (index: number) =>
            applyToConsequences((consequences) => {
                if (index < 0 || index >= consequences.length) return null

                consequences.splice(index, 1)
                return consequences
            }),
        moveConsequence: (from: number, to: number) =>
            applyToConsequences((consequences) =>
                moveWithin(consequences, from, to)
            ),

        addVignette: (vignette: JourneyVignette) =>
            applyToVignettes((vignettes) => {
                const name = vignette.name.trim()
                if (!name) return null

                return [
                    ...vignettes,
                    {
                        name,
                        trigger: vignette.trigger?.trim() ?? '',
                        consequences: [...(vignette.consequences ?? [])],
                    },
                ]
            }),
        replaceVignetteAt: (index: number, vignette: JourneyVignette) =>
            applyToVignettes((vignettes) => {
                if (index < 0 || index >= vignettes.length) return null

                const name = vignette.name.trim()
                if (!name) return null

                vignettes[index] = {
                    name,
                    trigger: vignette.trigger?.trim() ?? '',
                    consequences: [...(vignette.consequences ?? [])],
                }
                return vignettes
            }),
        removeVignetteAt: (index: number) =>
            applyToVignettes((vignettes) => {
                if (index < 0 || index >= vignettes.length) return null

                vignettes.splice(index, 1)
                return vignettes
            }),
        moveVignette: (from: number, to: number) =>
            applyToVignettes((vignettes) => moveWithin(vignettes, from, to)),

        addVignetteConsequence: (vignetteIndex: number, consequence: string) =>
            applyToVignetteConsequences(vignetteIndex, (consequences) => {
                const next = consequence.trim()
                return next ? [...consequences, next] : null
            }),
        replaceVignetteConsequenceAt: (
            vignetteIndex: number,
            index: number,
            consequence: string
        ) =>
            applyToVignetteConsequences(vignetteIndex, (consequences) => {
                if (index < 0 || index >= consequences.length) return null

                const next = consequence.trim()
                if (!next) return null

                consequences[index] = next
                return consequences
            }),
        removeVignetteConsequenceAt: (vignetteIndex: number, index: number) =>
            applyToVignetteConsequences(vignetteIndex, (consequences) => {
                if (index < 0 || index >= consequences.length) return null

                consequences.splice(index, 1)
                return consequences
            }),
        moveVignetteConsequence: (
            vignetteIndex: number,
            from: number,
            to: number
        ) =>
            applyToVignetteConsequences(vignetteIndex, (consequences) =>
                moveWithin(consequences, from, to)
            ),

        updateMeta: (update: Partial<JourneyMeta>) =>
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

export function useLegendInTheMistJourneyViewStore() {
    const tab = useLegendInTheMistJourneyTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: LegendInTheMistJourneyViewState = {
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

    const patchView = (patch: Partial<LegendInTheMistJourneyViewState>) => {
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
            background: LegendInTheMistJourneyViewState['background']
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
            partial: Partial<LegendInTheMistJourneyViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultLegendInTheMistJourneyView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useLegendInTheMistJourneySheetStore() {
    const tab = useLegendInTheMistJourneyTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultLegendInTheMistJourneySheetState

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
                cloneValue(defaultLegendInTheMistJourneySheetState)
            )
        },
    }
}

export function isEmptySection(
    legendInTheMistJourney: LegendInTheMistJourney,
    id: SectionId
) {
    switch (id) {
        case 'description':
            return !legendInTheMistJourney.description.trim()
        case 'tags':
            return !legendInTheMistJourney.tags.length
        case 'benefits':
            return !legendInTheMistJourney.benefits.trim()
        case 'consequences':
            return !legendInTheMistJourney.consequences.length
        case 'vignettes':
            return !legendInTheMistJourney.vignettes.length
        case 'meta': {
            const meta = legendInTheMistJourney.meta
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
    legendInTheMistJourney: LegendInTheMistJourney,
    id: SectionId,
    view: LegendInTheMistJourneyViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(legendInTheMistJourney, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    legendInTheMistJourney: LegendInTheMistJourney,
    sectionIds: SectionId[],
    view: LegendInTheMistJourneyViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(legendInTheMistJourney, sectionId, view)
    )
}

export function getLegendInTheMistJourneyPreviewWidth(
    view: LegendInTheMistJourneyViewState
) {
    return view.previewWidth
}

export function getLiveLegendInTheMistJourneyTab() {
    return getLegendInTheMistJourneyTab()
}
