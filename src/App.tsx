import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
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

                <main
                    className="mist-app-main mx-auto min-h-[calc(100svh-4rem)] w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6"
                    style={{ maxWidth: `${shell.maxWidth}px` }}
                >
                    <AppMainContent
                        activeGameThemeId={shell.activeGameTheme?.id}
                        activeTab={shell.activeTab}
                        activeTemplate={shell.activeTemplate}
                        hydrated={shell.hydrated}
                        mobileInspectorOpen={ui.desktopInspectorOpen}
                        templatePreview={shell.templatePreview}
                        onOpenImport={() => ui.setImportOpen(true)}
                        onStartBlank={shell.startEditingBlank}
                        onStartExample={shell.startEditingWithExample}
                        onToggleMobileInspector={() =>
                            ui.setDesktopInspectorOpen(!ui.desktopInspectorOpen)
                        }
                    />
                </main>
            </div>

            {shell.hydrated &&
                shell.activeTab &&
                shell.activeTemplate?.implemented &&
                shell.activeTab.mode === 'landing' && (
                    <ImportDialog
                        open={ui.importOpen}
                        onOpenChange={ui.setImportOpen}
                    />
                )}

            {shell.showDesktopInspector && (
                <AppDesktopInspector
                    open={ui.desktopInspectorOpen}
                    onOpenChange={ui.setDesktopInspectorOpen}
                />
            )}

            <Toaster richColors closeButton position="top-center" expand />
        </SidebarProvider>
    )
}
