import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { formatError } from '@/i18n/formatError'
import { slugify } from '@/utils/strings'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

function copyWithLegacyClipboard(text: string) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    try {
        return document.execCommand('copy')
    } finally {
        textarea.remove()
    }
}

export function TemplateExportPanel() {
    const { t } = useTranslation()
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()
    const [activeActionId, setActiveActionId] = useState<string | null>(null)
    const [busyActionId, setBusyActionId] = useState<string | null>(null)

    const actions = useMemo(
        () => activeTemplate?.export.actions ?? [],
        [activeTemplate]
    )
    const activeAction =
        actions.find((action) => action.id === activeActionId) ??
        actions[0] ??
        null
    const [tomlText, setTomlText] = useState<string | null>(null)
    const [isCopyingToml, setIsCopyingToml] = useState(false)

    useEffect(() => {
        setActiveActionId(actions[0]?.id ?? null)
    }, [activeTab?.id, actions])

    useEffect(() => {
        setTomlText(null)
    }, [activeTab?.id, activeAction?.id])

    if (!activeTab || !activeTemplate || !activeAction) {
        return (
            <p className="text-sm text-muted-foreground">
                {t('export.openTemplate')}
            </p>
        )
    }

    const tab = activeTab
    const template = activeTemplate
    const exportToml = template.io.exportToml
    const isTomlAction = activeAction.id === 'toml' && exportToml != null

    const getPreviewNode = () => {
        const selector = template.preview.getRootSelector(tab.id)
        return document.querySelector<HTMLElement>(selector)
    }

    async function runExportAction() {
        if (!activeAction) return

        try {
            setBusyActionId(activeAction.id)
            await activeAction.run({
                tabId: tab.id,
                title: tab.title,
                doc: tab.doc,
                view: tab.view,
                sheet: tab.sheet,
                getPreviewNode,
                fileStem: slugify(tab.title || template.label),
            })
        } finally {
            setBusyActionId(null)
        }
    }

    async function copyToml() {
        if (!exportToml) return

        let toml: string
        try {
            toml = exportToml(tab.doc)
        } catch (error) {
            toast.error(formatError(error, 'errors.generateTomlFailed'))
            return
        }

        setTomlText(toml)
        setIsCopyingToml(true)
        try {
            await navigator.clipboard.writeText(toml)
            toast.success(t('export.copied'))
        } catch {
            if (copyWithLegacyClipboard(toml)) {
                toast.success(t('export.copied'))
            } else {
                toast.error(t('export.copyFailed'))
            }
        } finally {
            setIsCopyingToml(false)
        }
    }

    return (
        <div className="space-y-4">
            <Tabs
                value={activeAction.id}
                onValueChange={setActiveActionId}
                className="space-y-4"
            >
                <TabsList
                    className="grid w-full"
                    style={{
                        gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))`,
                    }}
                >
                    {actions.map((action) => (
                        <TabsTrigger key={action.id} value={action.id}>
                            {action.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {activeAction.description}
                </p>
                {activeAction.renderSettings?.()}
            </div>

            {isTomlAction ? (
                <div className="space-y-2">
                    <Button
                        type="button"
                        size="sm"
                        className="h-8 w-full text-xs"
                        onClick={copyToml}
                        disabled={busyActionId !== null || isCopyingToml}
                    >
                        {t('export.copyToml')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-full text-xs"
                        onClick={runExportAction}
                        disabled={busyActionId !== null || isCopyingToml}
                    >
                        {t('export.exportToml')}
                    </Button>

                    {tomlText !== null && (
                        <div className="space-y-2 rounded-md border bg-muted/30 p-2">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium">
                                    {t('export.toml')}
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setTomlText(null)}
                                >
                                    {t('export.hide')}
                                </Button>
                            </div>
                            <textarea
                                readOnly
                                value={tomlText}
                                aria-label={t('export.generatedToml')}
                                className="h-48 max-h-64 w-full resize-y overflow-auto rounded-md border bg-background px-3 py-2 font-mono text-xs leading-5 text-foreground"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Button
                    type="button"
                    size="sm"
                    className="h-8 w-full text-xs"
                    onClick={runExportAction}
                    disabled={busyActionId !== null}
                >
                    {activeAction.buttonLabel ??
                        t('export.exportAction', {
                            label: activeAction.label,
                        })}
                </Button>
            )}
        </div>
    )
}
