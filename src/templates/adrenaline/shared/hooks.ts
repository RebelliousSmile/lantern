import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { cloneValue } from '@/utils/clone'
import type { AdrenalineSheetState } from './model'

export function useAdrenalineDocument<
    TDocument extends Record<string, unknown>,
    TSection extends string = string,
>(templateId: string, fallback: TDocument) {
    const tab = useActiveTemplateTab<TDocument>(templateId)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)

    const sheet = (tab?.sheet as
        | AdrenalineSheetState<TSection>
        | undefined) ?? {
        open: false,
        target: null,
    }

    return {
        sheet,
        document: tab?.doc ?? fallback,
        update: (mutate: (document: TDocument) => void) => {
            if (!tab) return
            updateTabDoc(tab.id, (current) => {
                const next = cloneValue(current as TDocument)
                mutate(next)
                return next
            })
        },
        openSection: (section: TSection) => {
            if (!tab || tab.mode !== 'editing') return
            setTabSheet(tab.id, { open: true, target: section })
        },
    }
}
