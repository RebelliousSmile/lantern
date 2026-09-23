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
    const view = {
        ...defaultView,
        ...(tab?.view ?? {}),
        statBounds: {
            ...defaultView.statBounds,
            ...(tab?.view?.statBounds ?? {}),
        },
        hidden: { ...defaultView.hidden, ...(tab?.view?.hidden ?? {}) },
        exportPrefs: {
            ...defaultView.exportPrefs,
            ...(tab?.view?.exportPrefs ?? {}),
        },
    }
    return {
        ...view,
        setStatBounds: (statBounds: ViewState['statBounds']) =>
            tab && patch(tab.id, { statBounds }),
        setHidden: (id: keyof ViewState['hidden'], value: boolean) =>
            tab && patch(tab.id, { hidden: setVisibility(view.hidden, id, value) }),
        setExportPrefs: (scale: 1 | 2 | 3) =>
            tab && patch(tab.id, { exportPrefs: { scale } }),
        setAppearanceVariant: (
            appearanceVariant: ViewState['appearanceVariant']
        ) => tab && patch(tab.id, { appearanceVariant }),
    }
}
export function useMonsterheartsSheet() {
    const tab = useTab()
    const set = useWorkspaceStore((s) => s.setTabSheet)
    return {
        sheet: tab?.sheet ?? defaultSheet,
        open: (target: SheetState['target']) =>
            tab?.mode === 'editing' && set(tab.id, { open: true, target }),
    }
}
