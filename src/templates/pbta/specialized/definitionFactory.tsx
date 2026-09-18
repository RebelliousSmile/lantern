import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { documentContracts } from '@/contracts/registry'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'

type Document = Record<string, unknown>
type View = { hidden: Record<string, boolean>; previewWidth: number }
type Sheet = { open: boolean; target: string | 'basic' | null }
type Config = {
    id: string
    gameId: string
    gameLabel: string
    label: string
    contractKey: string
    sections: Array<{ id: string; label: string }>
    blank: Document
}

export function createSpecializedPlaybookTemplate(
    config: Config
): AnyTemplateDefinition {
    const clone = <T,>(value: T): T => structuredClone(value)
    const defaultView = (): View => ({
        previewWidth: 620,
        hidden: Object.fromEntries(
            config.sections.map(({ id }) => [id, false])
        ),
    })
    const defaultSheet = (): Sheet => ({ open: false, target: null })
    function useTab() {
        return useActiveTemplateTab<Document, View, Sheet>(config.id)
    }
    function useDocument() {
        const tab = useTab()
        const update = useWorkspaceStore((state) => state.updateTabDoc)
        return {
            doc: tab?.doc ?? config.blank,
            setDoc: (patch: Partial<Document>) =>
                tab &&
                update(tab.id, (current) => ({
                    ...clone(current as Document),
                    ...patch,
                })),
            tab,
        }
    }
    function useSheet() {
        const tab = useTab()
        const set = useWorkspaceStore((state) => state.setTabSheet)
        const sheet = tab?.sheet ?? defaultSheet()
        return {
            sheet,
            open: (target: Sheet['target']) =>
                tab?.mode === 'editing' && set(tab.id, { open: true, target }),
        }
    }
    function Preview() {
        const { doc } = useDocument()
        const { open } = useSheet()
        const tab = useTab()
        const view = { ...defaultView(), ...(tab?.view ?? {}) }
        return (
            <div className="pbta-card">
                <article className="p-4 space-y-3">
                    <button type="button" onClick={() => open('basic')}>
                        <h1 className="text-xl font-bold">
                            {String(doc.name ?? config.label)}
                        </h1>
                        <p>{String(doc.description ?? '')}</p>
                    </button>
                    {config.sections.map(
                        (section) =>
                            !view.hidden[section.id] && (
                                <section
                                    key={section.id}
                                    className="border-t pt-2"
                                >
                                    <button
                                        type="button"
                                        className="font-semibold"
                                        onClick={() => open(section.id)}
                                    >
                                        {section.label}
                                    </button>
                                    <pre className="mt-1 whitespace-pre-wrap text-xs">
                                        {JSON.stringify(
                                            doc[section.id],
                                            null,
                                            2
                                        )}
                                    </pre>
                                </section>
                            )
                    )}
                </article>
            </div>
        )
    }
    function Editor() {
        const { sheet } = useSheet()
        const { doc, setDoc } = useDocument()
        if (!sheet.open || !sheet.target)
            return (
                <p className="text-sm text-muted-foreground">
                    Click a sheet section to edit it.
                </p>
            )
        if (sheet.target === 'basic')
            return (
                <div className="space-y-3">
                    <Label>
                        Name
                        <Input
                            value={String(doc.name ?? '')}
                            onChange={(event) =>
                                setDoc({ name: event.target.value })
                            }
                        />
                    </Label>
                    <Label>
                        Description
                        <Input
                            value={String(doc.description ?? '')}
                            onChange={(event) =>
                                setDoc({ description: event.target.value })
                            }
                        />
                    </Label>
                </div>
            )
        const key = sheet.target as string
        const section = doc[key]
        const schema = inferObject(
            key,
            section && typeof section === 'object' && !Array.isArray(section)
                ? (section as Record<string, unknown>)
                : { value: section }
        )
        return (
            <SchemaEditor
                schema={schema}
                value={
                    section &&
                    typeof section === 'object' &&
                    !Array.isArray(section)
                        ? (section as Record<string, unknown>)
                        : { value: section }
                }
                onChange={(value) =>
                    setDoc({
                        [key]:
                            section && typeof section !== 'object'
                                ? value.value
                                : value,
                    })
                }
            />
        )
    }
    function Appearance() {
        const tab = useTab()
        const patch = useWorkspaceStore((state) => state.patchTabView)
        const view = { ...defaultView(), ...(tab?.view ?? {}) }
        return (
            <div className="space-y-2">
                {config.sections.map((section) => (
                    <label key={section.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!view.hidden[section.id]}
                            onChange={(event) =>
                                tab &&
                                patch(tab.id, {
                                    hidden: {
                                        ...view.hidden,
                                        [section.id]: !event.target.checked,
                                    },
                                })
                            }
                        />
                        {section.label}
                    </label>
                ))}
            </div>
        )
    }
    const contract = documentContracts.require<Document>(config.contractKey)
    return {
        id: config.id,
        gameId: config.gameId,
        gameLabel: config.gameLabel,
        label: config.label,
        implemented: true,
        contractKey: config.contractKey,
        createBlank: () => clone(config.blank),
        createExample: () => clone(config.blank),
        createInitialView: defaultView,
        createInitialSheet: defaultSheet,
        getTabTitle: (doc) => String(doc.name || config.label),
        sections: config.sections,
        landing: {
            description: `Create an original ${config.gameLabel} playbook as one TOML document.`,
            exampleLabel: 'Start with example',
            blankLabel: 'Start blank',
            importLabel: 'Import TOML',
        },
        io: {
            importToml: (text) => ({
                doc: contract.parseToml(text),
                warnings: [],
            }),
            exportToml: (doc) => contract.stringifyToml(doc),
        },
        preview: {
            getRootSelector: (id) => `[data-preview-root="${id}"]`,
            render: () => <Preview />,
        },
        editor: {
            emptyState: 'Click a sheet section to edit it.',
            renderPanel: () => <Editor />,
        },
        appearance: {
            getPreviewWidth: (view) => view.previewWidth,
            renderPanel: () => <Appearance />,
        },
        export: {
            actions: [
                {
                    id: 'toml',
                    label: 'TOML',
                    buttonLabel: 'Export TOML',
                    description: 'Export this playbook as TOML.',
                    run: ({ doc, fileStem }) => {
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(
                            new Blob([contract.stringifyToml(doc)], {
                                type: 'text/plain',
                            })
                        )
                        link.download = `${fileStem}.toml`
                        link.click()
                        URL.revokeObjectURL(link.href)
                    },
                },
            ],
        },
    }
}
