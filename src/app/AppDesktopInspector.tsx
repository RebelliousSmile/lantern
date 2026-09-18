import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { TemplateInspector } from '@/core/templates/shell/TemplateInspector'
import { useTranslation } from 'react-i18next'

type AppDesktopInspectorProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function AppDesktopInspector({
    open,
    onOpenChange,
}: AppDesktopInspectorProps) {
    const { t } = useTranslation()

    return (
        <SidebarProvider
            open={open}
            onOpenChange={onOpenChange}
            keyboardShortcut={null}
            className="contents"
        >
            <SidebarTrigger
                className="fixed top-14 right-4 z-40 hidden rounded-md border bg-background shadow-sm md:inline-flex"
                aria-label={t('editing.toggleSidebar')}
                title={t('editing.toggleSidebar')}
            />

            <Sidebar
                side="right"
                variant="floating"
                collapsible="offcanvas"
                withGap={false}
                className="z-30 !top-16 !bottom-auto !h-auto !max-h-[calc(100svh-8rem)] [--sidebar-width:22rem]"
            >
                <TemplateInspector />
            </Sidebar>
        </SidebarProvider>
    )
}
