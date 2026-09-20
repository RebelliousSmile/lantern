import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type AppEditingViewProps = {
    activeGameThemeId?: string
    mobileInspectorOpen: boolean
    previewRootId: string
    templatePreview: ReactNode
    onToggleMobileInspector: () => void
}

export default function AppEditingView({
    activeGameThemeId,
    mobileInspectorOpen,
    previewRootId,
    templatePreview,
    onToggleMobileInspector,
}: AppEditingViewProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-3">
            <div className="flex justify-end md:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleMobileInspector}
                >
                    {mobileInspectorOpen
                        ? t('editing.hideSidebar')
                        : t('editing.showSidebar')}
                </Button>
            </div>

            <div
                data-preview-root={previewRootId}
                data-game-theme={activeGameThemeId}
            >
                {templatePreview}
            </div>
        </div>
    )
}
