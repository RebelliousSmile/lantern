import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import {
    TemplateModuleBoundary,
    useResolvedTemplate,
} from '@/core/templates/TemplateModuleBoundary'
import { DEFAULT_TEMPLATE_PREVIEW_WIDTH } from '@/core/templates/types'
import { useWorkspaceStore } from '@/core/workspace/store'
import { useTranslation } from 'react-i18next'
import AppDesktopInspector from './app/AppDesktopInspector'
import AppMainContent from './app/AppMainContent'
import AppTopBar from './app/AppTopBar'
import ImportDialog from './app/ImportDialog'
import { useAppShellState } from './app/useAppShellState'
import { useAppShellUi } from './app/useAppShellUi'
import { useBodyGameTheme } from './app/useBodyGameTheme'

export default function App() {
    const { t } = useTranslation()
    const shell = useAppShellState()
    const ui = useAppShellUi(shell.activeTabId)

    useBodyGameTheme(shell.activeGameTheme?.id)
    const persistenceError = useWorkspaceStore((state) => state.persistenceError)
    const exportWorkspace = () => {
        const state = useWorkspaceStore.getState()
        const snapshot = {
            version: 1,
            tabs: state.tabs,
            tabOrder: state.tabOrder,
            activeTabId: state.activeTabId,
        }
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
            type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'lantern-workspace-rescue.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <SidebarProvider data-game-theme={shell.activeGameTheme?.id}>
            <AppSidebar />
            <div className="min-w-0 flex-1">
                <AppTopBar />
                {persistenceError && (
                    <div
                        role="alert"
                        className="flex items-center justify-between gap-3 border-b border-destructive bg-destructive/10 px-4 py-2 text-sm"
                    >
                        <span>{t('workspace.persistenceFailed')}</span>
                        <button
                            type="button"
                            className="underline"
                            onClick={exportWorkspace}
                        >
                            {t('workspace.exportRescueCopy')}
                        </button>
                    </div>
                )}

                <TemplateModuleBoundary
                    template={shell.activeTemplate}
                    fallback={<TemplateLoadingState />}
                    errorFallback={<TemplateLoadFailedState />}
                >
                    <TemplateContent shell={shell} ui={ui} />
                </TemplateModuleBoundary>
            </div>

            <Toaster richColors closeButton position="top-center" expand />
        </SidebarProvider>
    )
}

type TemplateContentProps = {
    shell: ReturnType<typeof useAppShellState>
    ui: ReturnType<typeof useAppShellUi>
}

function TemplateContent({ shell, ui }: TemplateContentProps) {
    const activeTemplate = useResolvedTemplate()
    const maxWidth = activeTemplate
        ? activeTemplate.appearance.getPreviewWidth(shell.activeTab?.view)
        : DEFAULT_TEMPLATE_PREVIEW_WIDTH
    const templatePreview = activeTemplate?.preview.render() ?? null

    return (
        <>
            <main
                className="mist-app-main mx-auto min-h-[calc(100svh-4rem)] w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6"
                style={{ maxWidth: `${maxWidth}px` }}
            >
                <AppMainContent
                    activeGameThemeId={shell.activeGameTheme?.id}
                    activeTab={shell.activeTab}
                    activeTemplate={activeTemplate}
                    hydrated={shell.hydrated}
                    mobileInspectorOpen={ui.desktopInspectorOpen}
                    templatePreview={templatePreview}
                    onOpenImport={() => ui.setImportOpen(true)}
                    onStartBlank={shell.startEditingBlank}
                    onStartExample={shell.startEditingWithExample}
                    onToggleMobileInspector={() =>
                        ui.setDesktopInspectorOpen(!ui.desktopInspectorOpen)
                    }
                />
            </main>

            {shell.hydrated &&
                shell.activeTab &&
                activeTemplate &&
                shell.activeTab.mode === 'landing' && (
                    <ImportDialog
                        open={ui.importOpen}
                        onOpenChange={ui.setImportOpen}
                    />
                )}

            {shell.showDesktopInspector && activeTemplate && (
                <AppDesktopInspector
                    open={ui.desktopInspectorOpen}
                    onOpenChange={ui.setDesktopInspectorOpen}
                />
            )}
        </>
    )
}

function TemplateLoadingState() {
    return (
        <main className="mist-app-main mx-auto flex min-h-[calc(100svh-4rem)] w-full min-w-0 items-center justify-center px-4 py-6 text-sm text-muted-foreground sm:px-6">
            Loading template...
        </main>
    )
}

function TemplateLoadFailedState() {
    return (
        <main className="mist-app-main mx-auto flex min-h-[calc(100svh-4rem)] w-full min-w-0 items-center justify-center px-4 py-6 text-sm text-muted-foreground sm:px-6">
            Unable to load this template. Select another tab to continue.
        </main>
    )
}
