import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { setVisibility } from '@/templates/shared/visibility'
import {
    blankPlaybook,
    defaultSheet,
    defaultView,
    type MasksPlaybook,
    type SheetState,
    type SheetTarget,
    type ViewState,
} from './model'

const id = 'masks.playbook'
const clone = <T>(value: T): T => structuredClone(value)

function useTab() {
    return useActiveTemplateTab<MasksPlaybook, ViewState, SheetState>(id)
}

export function useMasksPlaybookStore() {
    const tab = useTab()
    const update = useWorkspaceStore((s) => s.updateTabDoc)
    const doc = tab?.doc ?? blankPlaybook()
    return {
        playbook: doc,
        setPlaybook: (patch: Partial<MasksPlaybook>) =>
            tab &&
            update(tab.id, (current) => ({
                ...clone(current as MasksPlaybook),
                ...patch,
            })),
    }
}

export function useMasksViewStore() {
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

export function useMasksSheetStore() {
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

export const getMasksPreviewWidth = (view: ViewState) => view.previewWidth
