import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useResolvedTemplate } from '@/core/templates/TemplateModuleBoundary'
import { useActiveTab } from '@/core/workspace/selectors'
import { formatError } from '@/i18n/formatError'
import { translateEnglish, useUiText } from '@/i18n/text'
import { slugify } from '@/utils/strings'
import { useEffect, useMemo, useState } from 'react'
import { selectPages } from './exportPages'
import { createPdfExportAction } from './pdfExportAction'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

/** The formats in the order the player reads them: PNG, PDF, TOML, then anything a template adds. */
const FORMAT_ORDER = ['png', 'pdf', 'toml']
const pdfAction = createPdfExportAction()

/** Every template that exports an image also prints to PDF: the page is the same node. */
function withPdf<T extends { id: string }>(actions: readonly T[]): T[] {
    const all = [...actions] as unknown[] as T[]
    if (actions.some((action) => action.id === 'png'))
        all.push(pdfAction as unknown as T)
    const rank = (id: string) => {
        const at = FORMAT_ORDER.indexOf(id)
        return at === -1 ? FORMAT_ORDER.length : at
    }
    return all.sort((a, b) => rank(a.id) - rank(b.id))
}

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
    const text = useUiText()
    const activeTab = useActiveTab()
    const activeTemplate = useResolvedTemplate()
    const [activeActionId, setActiveActionId] = useState<string | null>(null)
    const [busyActionId, setBusyActionId] = useState<string | null>(null)

    const actions = useMemo(
        () => withPdf(activeTemplate?.export.actions ?? []),
        [activeTemplate]
    )
    /* 'all' exports every page; otherwise the id of the one page chosen. */
    const [pageChoice, setPageChoice] = useState('all')
    const [includeNotesPage, setIncludeNotesPage] = useState(true)
    const [includeTomlNotes, setIncludeTomlNotes] = useState(true)
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

    useEffect(() => {
        setPageChoice('all')
        setIncludeNotesPage(true)
        setIncludeTomlNotes(true)
    }, [activeTab?.id])

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
    const pages = template.export.pages?.(tab.doc) ?? []
    const hasNotesPage = pages.some((page) => page.notes)
    const withoutNotes = template.export.withoutNotes
    /* A PDF is always every page; a PNG is one page or all of them in an archive. */
    const selection = selectPages(pages, {
        scope:
            activeAction.id === 'pdf' || pageChoice === 'all' ? 'all' : 'one',
        pageId: pageChoice,
        includeNotes: includeNotesPage,
    })
    const exportedDoc =
        isTomlAction && !includeTomlNotes && withoutNotes
            ? withoutNotes(tab.doc)
            : tab.doc

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
                doc: exportedDoc,
                view: tab.view,
                sheet: tab.sheet,
                getPreviewNode,
                selection,
                // English whatever the UI language: a file name must not depend on it.
                fileStem: slugify(
                    tab.title || translateEnglish(template.label)
                ),
            })
        } finally {
            setBusyActionId(null)
        }
    }

    async function copyToml() {
        if (!exportToml) return

        let toml: string
        try {
            toml = exportToml(exportedDoc)
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
                            {text(action.label)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {text(activeAction.description)}
                </p>
                {activeAction.renderSettings?.()}
                {pages.length > 1 && activeAction.id === 'png' && (
                    <RadioGroup
                        value={pageChoice}
                        onValueChange={setPageChoice}
                        aria-label={t('export.pages')}
                    >
                        <label className="flex items-center gap-2 text-sm">
                            <RadioGroupItem value="all" />
                            {t('export.allPagesArchive')}
                        </label>
                        {pages
                            .filter((page) => includeNotesPage || !page.notes)
                            .map((page) => (
                                <label
                                    key={page.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <RadioGroupItem value={page.id} />
                                    {text(page.label)}
                                </label>
                            ))}
                    </RadioGroup>
                )}
                {hasNotesPage &&
                    (activeAction.id === 'png' ||
                        activeAction.id === 'pdf') && (
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={includeNotesPage}
                                onCheckedChange={(checked) =>
                                    setIncludeNotesPage(checked === true)
                                }
                            />
                            {t('export.includeNotesPage')}
                        </label>
                    )}
                {isTomlAction && withoutNotes && (
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={includeTomlNotes}
                            onCheckedChange={(checked) =>
                                setIncludeTomlNotes(checked === true)
                            }
                        />
                        {t('export.includeNotes')}
                    </label>
                )}
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
                    {activeAction.buttonLabel
                        ? text(activeAction.buttonLabel)
                        : t('export.exportAction', {
                              label: text(activeAction.label),
                          })}
                </Button>
            )}
        </div>
    )
}
