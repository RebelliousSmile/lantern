import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import { setVisibility, toggleVisibility } from '@/templates/shared/visibility'
import { cloneValue } from '@/utils/clone'
import type { ThemeScope } from '../theme/hooks'
import type { OtherscapeTheme, ThemeType } from '../theme/model'
import { defaultOtherscapeThemeSheetState } from '../theme/model'
import type {
    CharacterMeta,
    LoadoutItem,
    OtherscapeCharacter,
    OtherscapeCharacterSheetState,
    OtherscapeCharacterViewState,
    SectionId,
    SheetTarget,
    TagCombo,
} from './model'
import {
    blankCharacterTheme,
    blankOtherscapeCharacter,
    CHARACTER_THEME_TYPES,
    DEFAULT_LOADOUT_ITEM_NAME,
    defaultHidden,
    defaultOtherscapeCharacterSheetState,
    defaultOtherscapeCharacterView,
    MAX_THEMES,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type OtherscapeCharacterTab = WorkspaceTab<
    OtherscapeCharacter,
    OtherscapeCharacterViewState,
    OtherscapeCharacterSheetState
>

const TEMPLATE_ID = 'otherscape.character'
const fallbackOtherscapeCharacter = blankOtherscapeCharacter()
const fallbackView = cloneValue(defaultOtherscapeCharacterView)

function normalizeBackground(
    background: OtherscapeCharacterViewState['background'] | undefined
): OtherscapeCharacterViewState['background'] {
    return background === 'plain' ? 'plain' : 'neon'
}

function normalizeLoadoutItem(item: LoadoutItem): LoadoutItem {
    return {
        ...item,
        name: item.name.trim() || DEFAULT_LOADOUT_ITEM_NAME,
    }
}

function normalizeCombo(combo: TagCombo): TagCombo {
    const power = Number.isFinite(combo.power) ? Math.round(combo.power) : 0
    return { ...combo, power: Math.max(0, power) }
}

function useOtherscapeCharacterTab() {
    return useActiveTemplateTab<
        OtherscapeCharacter,
        OtherscapeCharacterViewState,
        OtherscapeCharacterSheetState
    >(TEMPLATE_ID)
}

function getOtherscapeCharacterTab(): OtherscapeCharacterTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as OtherscapeCharacterTab
}

export type {
    CharacterMeta,
    LoadoutItem,
    OtherscapeCharacter,
    OtherscapeCharacterSheetState,
    OtherscapeCharacterViewState,
    PublicationType,
    SectionId,
    SheetTarget,
    TagCombo,
} from './model'

function moveInList<T>(list: T[], from: number, to: number): T[] | null {
    if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
        return null
    }
    const next = [...list]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
}

// These template-scoped hooks replace the legacy global stores while keeping
// the editor and preview API familiar for the character module.
export function useOtherscapeCharacterStore() {
    const tab = useOtherscapeCharacterTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const otherscapeCharacter = tab?.doc ?? fallbackOtherscapeCharacter

    const apply = (
        producer: (current: OtherscapeCharacter) => OtherscapeCharacter
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as OtherscapeCharacter))
        )
    }

    return {
        otherscapeCharacter,
        setOtherscapeCharacter: (update: Partial<OtherscapeCharacter>) =>
            apply((current) => ({ ...current, ...update })),
        replaceOtherscapeCharacter: (next: OtherscapeCharacter) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetOtherscapeCharacter: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankOtherscapeCharacter())
        },
        setName: (name: string) => apply((current) => ({ ...current, name })),

        /** Adds a blank theme. Returns false, and changes nothing, once the character holds four. */
        addTheme: (type: ThemeType = 'self'): boolean => {
            if (!tab || otherscapeCharacter.themes.length >= MAX_THEMES) {
                return false
            }
            apply((current) => ({
                ...current,
                themes: [...current.themes, blankCharacterTheme(type)].slice(
                    0,
                    MAX_THEMES
                ),
            }))
            return true
        },
        updateThemeAt: (
            index: number,
            producer: (current: OtherscapeTheme) => OtherscapeTheme
        ) =>
            apply((current) => {
                const prev = current.themes[index]
                if (!prev) return current

                const themes = [...current.themes]
                themes[index] = producer(prev)
                return { ...current, themes }
            }),
        removeThemeAt: (index: number) =>
            apply((current) => {
                const themes = [...current.themes]
                themes.splice(index, 1)
                return { ...current, themes }
            }),
        moveTheme: (from: number, to: number) =>
            apply((current) => {
                const themes = moveInList(current.themes, from, to)
                return themes ? { ...current, themes } : current
            }),

        addCombo: (combo: TagCombo) =>
            apply((current) => ({
                ...current,
                tag_combos: [...current.tag_combos, normalizeCombo(combo)],
            })),
        updateComboAt: (index: number, update: Partial<TagCombo>) =>
            apply((current) => {
                const prev = current.tag_combos[index]
                if (!prev) return current

                const tag_combos = [...current.tag_combos]
                tag_combos[index] = normalizeCombo({ ...prev, ...update })
                return { ...current, tag_combos }
            }),
        removeComboAt: (index: number) =>
            apply((current) => {
                const tag_combos = [...current.tag_combos]
                tag_combos.splice(index, 1)
                return { ...current, tag_combos }
            }),
        moveCombo: (from: number, to: number) =>
            apply((current) => {
                const tag_combos = moveInList(current.tag_combos, from, to)
                return tag_combos ? { ...current, tag_combos } : current
            }),

        addLoadoutItem: (item: LoadoutItem) =>
            apply((current) => ({
                ...current,
                loadout: [...current.loadout, normalizeLoadoutItem(item)],
            })),
        updateLoadoutItemAt: (index: number, update: Partial<LoadoutItem>) =>
            apply((current) => {
                const prev = current.loadout[index]
                if (!prev) return current

                const loadout = [...current.loadout]
                loadout[index] = normalizeLoadoutItem({ ...prev, ...update })
                return { ...current, loadout }
            }),
        removeLoadoutItemAt: (index: number) =>
            apply((current) => {
                const loadout = [...current.loadout]
                loadout.splice(index, 1)
                return { ...current, loadout }
            }),
        moveLoadoutItem: (from: number, to: number) =>
            apply((current) => {
                const loadout = moveInList(current.loadout, from, to)
                return loadout ? { ...current, loadout } : current
            }),

        updateMeta: (update: Partial<CharacterMeta>) =>
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

export function useOtherscapeCharacterViewStore() {
    const tab = useOtherscapeCharacterTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: OtherscapeCharacterViewState = {
        ...fallbackView,
        ...tabView,
        previewWidth: Math.min(
            PREVIEW_WIDTH_MAX,
            Math.max(
                PREVIEW_WIDTH_MIN,
                tabView?.previewWidth ?? fallbackView.previewWidth
            )
        ),
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

    const patchView = (patch: Partial<OtherscapeCharacterViewState>) => {
        if (!tab) return
        patchTabView(tab.id, cloneValue(patch) as Record<string, unknown>)
    }

    return {
        ...view,
        setZoom: (zoom: number) =>
            patchView({
                zoom: Math.max(0.5, Math.min(2, zoom)),
            }),
        setPreviewWidth: (previewWidth: number) => patchView({ previewWidth }),
        setBackground: (
            background: OtherscapeCharacterViewState['background']
        ) => patchView({ background }),
        toggleHidden: (id: SectionId) =>
            patchView({
                hidden: toggleVisibility(view.hidden, id),
            }),
        setHidden: (id: SectionId, value: boolean) =>
            patchView({
                hidden: setVisibility(view.hidden, id, value),
            }),
        setAutoHideEmpty: (autoHideEmpty: boolean) =>
            patchView({ autoHideEmpty }),
        setExportPrefs: (
            partial: Partial<OtherscapeCharacterViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultOtherscapeCharacterView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useOtherscapeCharacterSheetStore() {
    const tab = useOtherscapeCharacterTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultOtherscapeCharacterSheetState

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
                cloneValue(defaultOtherscapeCharacterSheetState)
            )
        },
    }
}

/**
 * The scope one of the character's themes is edited and drawn in: the theme's own cards and forms
 * run unchanged on `themes[index]`, and a click inside one opens that theme's zone in this
 * character's sheet. Null when the character holds no theme at that index.
 */
export function useCharacterThemeScope(index: number): ThemeScope | null {
    const { otherscapeCharacter, updateThemeAt } = useOtherscapeCharacterStore()
    const { open, target, openSheet, closeSheet } =
        useOtherscapeCharacterSheetStore()

    const theme = otherscapeCharacter.themes[index]
    if (!theme) return null

    const themeSheet =
        open && target?.kind === 'theme' && target.index === index
            ? { open: true, target: target.zone }
            : defaultOtherscapeThemeSheetState

    return {
        theme,
        update: (producer) => updateThemeAt(index, producer),
        sheet: themeSheet,
        openSheet: (zone) => openSheet({ kind: 'theme', index, zone }),
        closeSheet,
        themeTypes: CHARACTER_THEME_TYPES,
    }
}

/** Whether the character holds the four themes the sheet prints. */
export function isThemeLimitReached(
    otherscapeCharacter: OtherscapeCharacter
): boolean {
    return otherscapeCharacter.themes.length >= MAX_THEMES
}

export function isEmptySection(
    otherscapeCharacter: OtherscapeCharacter,
    id: SectionId
) {
    switch (id) {
        case 'upgrades':
            // The rule is the same for every character: it prints whatever the
            // document holds.
            return false
        case 'combos':
            return !otherscapeCharacter.tag_combos.length
        case 'loadout':
            return !otherscapeCharacter.loadout.length
        case 'themes':
            return !otherscapeCharacter.themes.length
        case 'meta': {
            const meta = otherscapeCharacter.meta
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
    otherscapeCharacter: OtherscapeCharacter,
    id: SectionId,
    view: OtherscapeCharacterViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(otherscapeCharacter, id)) {
        return false
    }
    return true
}

export function getOtherscapeCharacterPreviewWidth(
    view: OtherscapeCharacterViewState
) {
    return Math.min(
        PREVIEW_WIDTH_MAX,
        Math.max(PREVIEW_WIDTH_MIN, view.previewWidth)
    )
}

export function getLiveOtherscapeCharacterTab() {
    return getOtherscapeCharacterTab()
}
