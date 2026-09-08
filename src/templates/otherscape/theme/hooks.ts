import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    OtherscapeTheme,
    OtherscapeThemeSheetState,
    OtherscapeThemeViewState,
    SectionId,
    SheetTarget,
    TagField,
    ThemeMeta,
    ThemeType,
    TrackField,
} from './model'
import {
    blankOtherscapeTheme,
    defaultHidden,
    defaultOtherscapeThemeSheetState,
    defaultOtherscapeThemeView,
    TRACK_MAX,
} from './model'

type OtherscapeThemeTab = WorkspaceTab<
    OtherscapeTheme,
    OtherscapeThemeViewState,
    OtherscapeThemeSheetState
>

const TEMPLATE_ID = 'otherscape.theme'

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

const fallbackOtherscapeTheme = blankOtherscapeTheme()
const fallbackView = cloneValue(defaultOtherscapeThemeView)

function normalizeBackground(
    background: OtherscapeThemeViewState['background'] | undefined
): OtherscapeThemeViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function useOtherscapeThemeTab() {
    return useActiveTemplateTab<
        OtherscapeTheme,
        OtherscapeThemeViewState,
        OtherscapeThemeSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeThemeTab(): OtherscapeThemeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeThemeTab
}

export type {
    OtherscapeTheme,
    OtherscapeThemeSheetState,
    OtherscapeThemeViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    TagField,
    ThemeMeta,
    ThemeType,
    TrackField,
} from './model'

export function useOtherscapeThemeStore() {
    const tab = useOtherscapeThemeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeTheme = tab?.doc ?? fallbackOtherscapeTheme

    const apply = (producer: (current: OtherscapeTheme) => OtherscapeTheme) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeTheme))
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
        otherscapeTheme,
        setOtherscapeTheme: (update: Partial<OtherscapeTheme>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceOtherscapeTheme: (next: OtherscapeTheme) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeTheme: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeTheme())
        },
        setTitleTag: (title_tag: string) =>
            apply((current) => ({ ...current, title_tag })),
        setThemeType: (theme_type: ThemeType) =>
            apply((current) => ({ ...current, theme_type })),
        setCategory: (category: string) =>
            apply((current) => ({ ...current, category })),
        setQuest: (quest: string) =>
            apply((current) => ({ ...current, quest })),
        // `undefined` clears the track rather than writing a zero: an untouched
        // track and a track marked back down to nothing are different states,
        // and only the second one belongs in the exported file.
        setTrack: (field: TrackField, value: number | undefined) =>
            apply((current) => ({
                ...current,
                [field]:
                    value == null
                        ? undefined
                        : Math.max(0, Math.min(TRACK_MAX, Math.round(value))),
            })),
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
        updateMeta: (update: Partial<ThemeMeta>) =>
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

export function useOtherscapeThemeViewStore() {
    const tab = useOtherscapeThemeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeThemeViewState = {
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

    const patchView = (patch: Partial<OtherscapeThemeViewState>) => {
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
        setBackground: (background: OtherscapeThemeViewState['background']) =>
            patchView({ background }),
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
            partial: Partial<OtherscapeThemeViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeThemeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeThemeSheetStore() {
    const tab = useOtherscapeThemeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeThemeSheetState

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

            setTabSheet(tab.id, cloneValue(defaultOtherscapeThemeSheetState))
        },
    }
}

export function isEmptySection(
    otherscapeTheme: OtherscapeTheme,
    id: SectionId
) {
    switch (id) {
        case 'powerTags':
            return !otherscapeTheme.power_tags.length
        case 'weaknessTags':
            return !otherscapeTheme.weakness_tags.length
        case 'quest':
            return !otherscapeTheme.quest.trim()
        case 'tracks':
            // A track sitting at zero is still a track a player has taken and
            // cleared, so it prints; only a theme carrying neither has an empty
            // band.
            return (
                otherscapeTheme.upgrade == null && otherscapeTheme.decay == null
            )
        case 'meta': {
            // `publication_type` is always set, since the document materializes
            // it, so it cannot be what makes the footer worth printing: a theme
            // that credits no one and names no source has an empty footer.
            const meta = otherscapeTheme.meta
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
    otherscapeTheme: OtherscapeTheme,
    id: SectionId,
    view: OtherscapeThemeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeTheme, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    otherscapeTheme: OtherscapeTheme,
    sectionIds: SectionId[],
    view: OtherscapeThemeViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(otherscapeTheme, sectionId, view)
    )
}

export function getOtherscapeThemePreviewWidth(view: OtherscapeThemeViewState) {
    return view.previewWidth
}

export function getLiveOtherscapeThemeTab() {
    return getOtherscapeThemeTab()
}
