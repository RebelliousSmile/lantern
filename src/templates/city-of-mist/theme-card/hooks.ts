import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    Improvement,
    PowerTag,
    SectionId,
    SheetTarget,
    TagField,
    ThemeCardDocument,
    ThemeCardMeta,
    ThemeCardSheetState,
    ThemeCardViewState,
    ThemeType,
    TrackField,
    WeaknessTag,
} from './model'
import {
    blankThemeCard,
    defaultHidden,
    defaultThemeCardSheetState,
    defaultThemeCardView,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type ThemeCardTab = WorkspaceTab<
    ThemeCardDocument,
    ThemeCardViewState,
    ThemeCardSheetState
>

const TEMPLATE_ID = 'city.themeCard'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const fallbackThemeCard = blankThemeCard()
const fallbackView = cloneValue(defaultThemeCardView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrUndefined(value?: string | null) {
    const text = (value ?? '').trim()
    return text ? text : undefined
}

function useThemeCardTab() {
    return useActiveTemplateTab<
        ThemeCardDocument,
        ThemeCardViewState,
        ThemeCardSheetState
    >(TEMPLATE_ID)
}

export type {
    Background,
    ErosionKind,
    ExportPrefs,
    Improvement,
    Motivation,
    MotivationKind,
    PowerTag,
    PublicationType,
    SectionId,
    SheetTarget,
    TagField,
    ThemeCardDocument,
    ThemeCardMeta,
    ThemeCardSheetState,
    ThemeCardViewState,
    ThemeType,
    TitlePlacement,
    Track,
    TrackField,
    WeaknessTag,
} from './model'

/* The preview gates the card header on a section id the appearance panel does
   not list: the identity is always printed, it just needs a name to be gated
   by. */
export type PreviewSectionId = SectionId | 'identity'

export function useCityOfMistThemeCardStore() {
    const tab = useThemeCardTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const cityOfMistThemeCard = tab?.doc ?? fallbackThemeCard

    const apply = (
        producer: (current: ThemeCardDocument) => ThemeCardDocument
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as ThemeCardDocument))
        )
    }

    const tagsOf = (current: ThemeCardDocument, field: TagField) =>
        field === 'power' ? current.power_tags : current.weakness_tags

    const withTags = (
        current: ThemeCardDocument,
        field: TagField,
        tags: (PowerTag | WeaknessTag)[]
    ): ThemeCardDocument =>
        field === 'power'
            ? { ...current, power_tags: tags as PowerTag[] }
            : { ...current, weakness_tags: tags as WeaknessTag[] }

    return {
        cityOfMistThemeCard,
        setCityOfMistThemeCard: (update: Partial<ThemeCardDocument>) =>
            apply((current) => ({ ...current, ...update })),
        replaceCityOfMistThemeCard: (next: ThemeCardDocument) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetCityOfMistThemeCard: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankThemeCard())
        },
        /* Switching family swaps the erosion track rather than resetting it: a
           Mythos fades, a Logos cracks, and an Extra or a Crew card carries no
           erosion at all. The filled boxes survive the swap. */
        setThemeType: (theme_type: ThemeType) =>
            apply((current) => {
                if (theme_type === 'extra' || theme_type === 'crew') {
                    const next = { ...current, theme_type }
                    delete next.erosion
                    return next
                }

                const previous = current.erosion

                return {
                    ...current,
                    theme_type,
                    erosion: {
                        kind: theme_type === 'mythos' ? 'fade' : 'crack',
                        filled: previous?.filled ?? 0,
                        maximum: previous?.maximum ?? 3,
                    },
                    ...(current.motivation
                        ? {
                              motivation: {
                                  ...current.motivation,
                                  kind:
                                      theme_type === 'mythos'
                                          ? ('mystery' as const)
                                          : ('identity' as const),
                              },
                          }
                        : {}),
                }
            }),
        setTrack: (field: TrackField, filled: number) =>
            apply((current) => {
                if (field === 'attention') {
                    const track = current.attention
                    return {
                        ...current,
                        attention: {
                            ...track,
                            filled: clamp(filled, 0, track.maximum),
                        },
                    }
                }

                const erosion = current.erosion
                if (!erosion) return current

                return {
                    ...current,
                    erosion: {
                        ...erosion,
                        filled: clamp(filled, 0, erosion.maximum),
                    },
                }
            }),
        addTag: (field: TagField, tag: PowerTag | WeaknessTag) =>
            apply((current) =>
                withTags(current, field, [...tagsOf(current, field), tag])
            ),
        updateTagAt: (
            field: TagField,
            index: number,
            update: Record<string, unknown>
        ) =>
            apply((current) => {
                const tags = [...tagsOf(current, field)]
                const previous = tags[index]
                if (!previous) return current

                tags[index] = { ...previous, ...update } as
                    | PowerTag
                    | WeaknessTag
                return withTags(current, field, tags)
            }),
        removeTagAt: (field: TagField, index: number) =>
            apply((current) => {
                const tags = [...tagsOf(current, field)]
                tags.splice(index, 1)
                return withTags(current, field, tags)
            }),
        moveTag: (field: TagField, from: number, to: number) =>
            apply((current) => {
                const tags = [...tagsOf(current, field)]
                if (
                    from < 0 ||
                    from >= tags.length ||
                    to < 0 ||
                    to >= tags.length
                ) {
                    return current
                }

                const [item] = tags.splice(from, 1)
                tags.splice(to, 0, item)
                return withTags(current, field, tags)
            }),
        addImprovement: (improvement: Improvement) =>
            apply((current) => ({
                ...current,
                improvements: [...current.improvements, { ...improvement }],
            })),
        updateImprovementAt: (index: number, update: Partial<Improvement>) =>
            apply((current) => {
                const improvements = [...current.improvements]
                const previous = improvements[index]
                if (!previous) return current

                improvements[index] = { ...previous, ...update }
                return { ...current, improvements }
            }),
        removeImprovementAt: (index: number) =>
            apply((current) => {
                const improvements = [...current.improvements]
                improvements.splice(index, 1)
                return { ...current, improvements }
            }),
        moveImprovement: (from: number, to: number) =>
            apply((current) => {
                const improvements = [...current.improvements]
                if (
                    from < 0 ||
                    from >= improvements.length ||
                    to < 0 ||
                    to >= improvements.length
                ) {
                    return current
                }

                const [item] = improvements.splice(from, 1)
                improvements.splice(to, 0, item)
                return { ...current, improvements }
            }),
        updateMeta: (update: Partial<ThemeCardMeta>) =>
            apply((current) => {
                const meta: ThemeCardMeta = {
                    ...current.meta,
                    ...update,
                    publication_type:
                        update.publication_type ??
                        current.meta.publication_type ??
                        'homebrew',
                }

                meta.source = strOrUndefined(meta.source)
                if (!meta.authors?.length) delete meta.authors

                return { ...current, meta }
            }),
    }
}

export function useCityOfMistThemeCardViewStore() {
    const tab = useThemeCardTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: ThemeCardViewState = {
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

    const patchView = (patch: Partial<ThemeCardViewState>) => {
        if (!tab) return
        patchTabView(tab.id, cloneValue(patch) as Record<string, unknown>)
    }

    return {
        ...view,
        setZoom: (zoom: number) =>
            patchView({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
        setPreviewWidth: (previewWidth: number) =>
            patchView({
                previewWidth: clamp(
                    previewWidth,
                    PREVIEW_WIDTH_MIN,
                    PREVIEW_WIDTH_MAX
                ),
            }),
        setBackground: (background: ThemeCardViewState['background']) =>
            patchView({ background }),
        toggleHidden: (id: SectionId) =>
            patchView({ hidden: { ...view.hidden, [id]: !view.hidden[id] } }),
        setHidden: (id: SectionId, value: boolean) =>
            patchView({ hidden: { ...view.hidden, [id]: value } }),
        setAutoHideEmpty: (autoHideEmpty: boolean) =>
            patchView({ autoHideEmpty }),
        setTitlePlacement: (
            titlePlacement: ThemeCardViewState['titlePlacement']
        ) => patchView({ titlePlacement }),
        setExportPrefs: (partial: Partial<ThemeCardViewState['exportPrefs']>) =>
            patchView({
                exportPrefs: { ...view.exportPrefs, ...partial },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultThemeCardView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useCityOfMistThemeCardSheetStore() {
    const tab = useThemeCardTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultThemeCardSheetState

    return {
        ...sheet,
        openSheet: (target: SheetTarget) => {
            if (!tab || tab.mode !== 'editing') return

            setTabSheet(tab.id, { open: true, target })
        },
        closeSheet: () => {
            if (!tab) return

            setTabSheet(tab.id, cloneValue(defaultThemeCardSheetState))
        },
    }
}

export function getCityOfMistThemeCardPreviewWidth(view: ThemeCardViewState) {
    return view.previewWidth
}

export function isEmptySection(
    cityOfMistThemeCard: ThemeCardDocument,
    id: PreviewSectionId
) {
    switch (id) {
        case 'identity':
            return (
                !cityOfMistThemeCard.title.trim() &&
                !cityOfMistThemeCard.themebook.trim()
            )
        case 'motivation':
            return !cityOfMistThemeCard.motivation?.text?.trim()
        case 'tracks':
            return (
                !cityOfMistThemeCard.attention && !cityOfMistThemeCard.erosion
            )
        case 'powerTags':
            return !cityOfMistThemeCard.power_tags.length
        case 'weaknessTags':
            return !cityOfMistThemeCard.weakness_tags.length
        case 'improvements':
            return !cityOfMistThemeCard.improvements.length
        case 'meta': {
            const meta = cityOfMistThemeCard.meta
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
    cityOfMistThemeCard: ThemeCardDocument,
    id: PreviewSectionId,
    view: ThemeCardViewState
) {
    if (id !== 'identity' && view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(cityOfMistThemeCard, id)) {
        return false
    }
    return true
}

export function getLiveCityOfMistThemeCardTab(): ThemeCardTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as ThemeCardTab
}
