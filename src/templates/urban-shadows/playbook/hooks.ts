import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { setVisibility } from '@/templates/shared/visibility'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type SheetState,
    type SheetTarget,
    type UrbanShadowsPlaybook,
    type ViewState,
} from './model'
const id = 'urban-shadows.playbook'
const clone = <T>(value: T): T => structuredClone(value)
function useTab() {
    return useActiveTemplateTab<UrbanShadowsPlaybook, ViewState, SheetState>(id)
}
export function useUrbanShadowsPlaybookStore() {
    const tab = useTab()
    const update = useWorkspaceStore((s) => s.updateTabDoc)
    const doc = tab?.doc ?? blankPlaybook()
    return {
        playbook: doc,
        setPlaybook: (patch: Partial<UrbanShadowsPlaybook>) =>
            tab &&
            update(tab.id, (current) => ({
                ...clone(current as UrbanShadowsPlaybook),
                ...patch,
            })),
    }
}
export function useUrbanShadowsViewStore() {
    const tab = useTab()
    const patch = useWorkspaceStore((s) => s.patchTabView)
    const view = {
        ...defaultView,
        ...(tab?.view ?? {}),
        hidden: { ...defaultView.hidden, ...(tab?.view?.hidden ?? {}) },
        exportPrefs: {
            ...defaultView.exportPrefs,
            ...(tab?.view?.exportPrefs ?? {}),
        },
    }
    return {
        ...view,
        setHidden: (key: keyof ViewState['hidden'], value: boolean) =>
            tab &&
            patch(tab.id, { hidden: setVisibility(view.hidden, key, value) }),
        setPreviewWidth: (previewWidth: number) =>
            tab && patch(tab.id, { previewWidth }),
        setExportPrefs: (exportPrefs: ViewState['exportPrefs']) =>
            tab && patch(tab.id, { exportPrefs }),
    }
}
export function useUrbanShadowsSheetStore() {
    const tab = useTab()
    const set = useWorkspaceStore((s) => s.setTabSheet)
    const sheet = tab?.sheet ?? defaultSheet
    return {
        ...sheet,
        openSheet: (target: SheetTarget) =>
            tab?.mode === 'editing' && set(tab.id, { open: true, target }),
        closeSheet: () => tab && set(tab.id, clone(defaultSheet)),
    }
}
export const getUrbanShadowsPreviewWidth = (view: ViewState) =>
    view.previewWidth
