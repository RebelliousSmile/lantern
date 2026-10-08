import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { setVisibility } from '@/templates/shared/visibility'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type MonsterheartsPlaybook,
    type SheetState,
    type ViewState,
} from './model'
const id = 'monsterhearts.playbook'
const clone = <T>(x: T): T => structuredClone(x)
const useTab = () =>
    useActiveTemplateTab<MonsterheartsPlaybook, ViewState, SheetState>(id)
export function useMonsterheartsStore() {
    const tab = useTab()
    const update = useWorkspaceStore((s) => s.updateTabDoc)
    return {
        playbook: tab?.doc ?? blankPlaybook(),
        setPlaybook: (patch: Partial<MonsterheartsPlaybook>) =>
            tab &&
            update(tab.id, (current) => ({
                ...clone(current as MonsterheartsPlaybook),
                ...patch,
            })),
    }
}
export function useMonsterheartsView() {
    const tab = useTab()
    const patch = useWorkspaceStore((s) => s.patchTabView)
    /* Documents saved while the pack still had a second variant carry an
       `appearanceVariant`; the pack now has only `base`, so it is dropped. */
    const { appearanceVariant: _retired, ...stored } = (tab?.view ??
        {}) as Partial<ViewState> & { appearanceVariant?: unknown }
    void _retired
    const view = {
        ...defaultView,
        ...stored,
        statBounds: {
            ...defaultView.statBounds,
            ...(stored.statBounds ?? {}),
        },
        hidden: { ...defaultView.hidden, ...(stored.hidden ?? {}) },
        exportPrefs: {
            ...defaultView.exportPrefs,
            ...(stored.exportPrefs ?? {}),
        },
    }
    return {
        ...view,
        setStatBounds: (statBounds: ViewState['statBounds']) =>
            tab && patch(tab.id, { statBounds }),
        setHidden: (id: keyof ViewState['hidden'], value: boolean) =>
            tab &&
            patch(tab.id, { hidden: setVisibility(view.hidden, id, value) }),
        setExportPrefs: (scale: 1 | 2 | 3) =>
            tab && patch(tab.id, { exportPrefs: { scale } }),
    }
}
export function useMonsterheartsSheet() {
    const tab = useTab()
    const set = useWorkspaceStore((s) => s.setTabSheet)
    return {
        sheet: tab?.sheet ?? defaultSheet,
        editing: tab?.mode === 'editing',
        open: (target: SheetState['target']) =>
            tab?.mode === 'editing' && set(tab.id, { open: true, target }),
    }
}
