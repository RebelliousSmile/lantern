import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { cloneValue } from '@/utils/clone'

export function useAdrenalineDocument<
    TDocument extends Record<string, unknown>,
>(templateId: string, fallback: TDocument) {
    const tab = useActiveTemplateTab<TDocument>(templateId)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)

    return {
        document: tab?.doc ?? fallback,
        update: (mutate: (document: TDocument) => void) => {
            if (!tab) return
            updateTabDoc(tab.id, (current) => {
                const next = cloneValue(current as TDocument)
                mutate(next)
                return next
            })
        },
        openSection: (section: string) => {
            if (!tab || tab.mode !== 'editing') return
            setTabSheet(tab.id, { open: true, target: { kind: section } })
        },
    }
}
