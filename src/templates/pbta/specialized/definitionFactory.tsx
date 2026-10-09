import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { documentContracts } from '@/contracts/registry'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import { getAtPath, setAtPath } from '@/core/editor-schema/path'
import { createTomlExportAction } from '@/core/templates/shell/tomlExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { translateEnglish, useUiText } from '@/i18n/text'
import {
    collectionAdapterFor,
    PublishedCollectionEditor,
} from './collectionAdapters'
import {
    collectionFor,
    collectionItems,
    replaceCollectionItems,
} from './collectionPolicy'
import './specializedPlaybookTheme.css'
import type {
    SpecializedPlaybookConfig as Config,
    SpecializedPlaybookDocument as Document,
    SpecializedPlaybookSheet as Sheet,
    SpecializedPlaybookView as View,
} from './staticDefinitionFactory'
import { createSpecializedPlaybookStaticDefinition } from './staticDefinitionFactory'

function humanize(label: string) {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function EditorialSection({ value }: { value: Record<string, unknown> }) {
    const heading = typeof value.heading === 'string' ? value.heading : null
    const paragraphs = Array.isArray(value.paragraphs)
        ? value.paragraphs.filter(
              (paragraph): paragraph is string => typeof paragraph === 'string'
          )
        : []

    if (!heading && !paragraphs.length) return null

    return (
        <div className="pbta-specialized-editorial-section">
            {heading && <h3>{heading}</h3>}
            {paragraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
        </div>
    )
}

function PlaybookValue({ value }: { value: unknown }) {
    if (value == null)
        return <p className="pbta-specialized-empty">None yet.</p>
    if (typeof value === 'string' || typeof value === 'number')
        return <p>{value}</p>
    if (typeof value === 'boolean') return <p>{value ? 'Yes' : 'No'}</p>

    if (Array.isArray(value)) {
        if (!value.length)
            return <p className="pbta-specialized-empty">None yet.</p>
        return (
            <ul className="pbta-specialized-checklist">
                {value.map((item, index) => (
                    <li key={index}>
                        <PlaybookValue value={item} />
                    </li>
                ))}
            </ul>
        )
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
        if (!entries.length)
            return <p className="pbta-specialized-empty">None yet.</p>
        if ('heading' in value || 'paragraphs' in value)
            return <EditorialSection value={value as Record<string, unknown>} />

        const record = value as Record<string, unknown>
        const name =
            typeof record.name === 'string'
                ? record.name
                : typeof record.label === 'string'
                  ? record.label
                  : null
        const description =
            typeof record.description === 'string' ? record.description : null
        if (name) {
            const details = entries.filter(
                ([key, item]) =>
                    key !== 'name' &&
                    key !== 'label' &&
                    key !== 'description' &&
                    item != null &&
                    item !== '' &&
                    (!Array.isArray(item) || item.length > 0)
            )
            return (
                <div className="pbta-specialized-entry">
                    <h3>{name}</h3>
                    {description && <p>{description}</p>}
                    {details.length > 0 && (
                        <div className="pbta-specialized-details">
                            {details.map(([key, item]) => (
                                <div key={key}>
                                    <h4>{humanize(key)}</h4>
                                    <PlaybookValue value={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div className="pbta-specialized-fields">
                {entries.map(([key, item]) => (
                    <div key={key}>
                        <h3>{humanize(key)}</h3>
                        <PlaybookValue value={item} />
                    </div>
                ))}
            </div>
        )
    }

    return null
}

const leafOf = (path: string) => path.split('.').pop() ?? path

/*
 * A section is a document key, or, for a block published as regions, the
 * listed fields. The name is the sheet title already; it is not repeated.
 */
function SectionValue({
    doc,
    id,
    fields,
}: {
    doc: Record<string, unknown>
    id: string
    fields: string[] | undefined
}) {
    if (!fields) return <PlaybookValue value={getAtPath(doc, id.split('.'))} />
    const shown = fields.filter((path) => path !== 'name')
    return (
        <>
            {shown.map((path) => (
                <div key={path}>
                    {shown.length > 1 && <h4>{humanize(leafOf(path))}</h4>}
                    <PlaybookValue value={getAtPath(doc, path.split('.'))} />
                </div>
            ))}
        </>
    )
}

/*
 * Editor of a region that holds several document fields. A field with a
 * published collection presentation gets its collection editor; the others
 * share one schema-driven form whose shape comes from the sample document, so
 * a field the blank omits is still offered.
 */
function FieldsEditor({
    target,
    fields,
    doc,
    shape,
    setDoc,
}: {
    target: Parameters<typeof collectionFor>[0]
    fields: string[]
    doc: Record<string, unknown>
    shape: Record<string, unknown>
    setDoc: (patch: Partial<Record<string, unknown>>) => void
}) {
    const editable = fields.filter((path) => path !== 'name')
    const plain = editable.filter((path) => !collectionFor(target, path))
    const read = (source: Record<string, unknown>, paths: string[]) =>
        Object.fromEntries(
            paths.map((path) => [
                leafOf(path),
                getAtPath(source, path.split('.')),
            ])
        )
    const apply = (next: Record<string, unknown>, paths: string[]) => {
        let updated: Record<string, unknown> = doc
        for (const path of paths)
            updated = setAtPath(updated, path.split('.'), next[leafOf(path)])
        setDoc(updated)
    }
    return (
        <div className="space-y-4">
            {plain.length > 0 && (
                <SchemaEditor
                    schema={inferObject(plain.join(','), read(shape, plain))}
                    value={read(doc, plain)}
                    onChange={(next) => apply(next, plain)}
                />
            )}
            {editable.map((path) => {
                const presentation = collectionFor(target, path)
                if (!presentation) return null
                const items = collectionItems(doc, presentation)
                if (!items || !collectionAdapterFor(presentation.itemEditor))
                    return (
                        <p key={path} className="text-sm text-destructive">
                            Invalid published collection configuration for{' '}
                            {presentation.label}.
                        </p>
                    )
                return (
                    <PublishedCollectionEditor
                        key={path}
                        presentation={presentation}
                        items={items}
                        onChange={(next) =>
                            setDoc(
                                replaceCollectionItems(doc, presentation, next)
                            )
                        }
                    />
                )
            })}
        </div>
    )
}

export function createSpecializedPlaybookTemplate(
    config: Config,
    staticDefinition = createSpecializedPlaybookStaticDefinition(config)
): AnyTemplateDefinition {
    const clone = <T,>(value: T): T => structuredClone(value)
    const target = config.contractKey.replace(/^pbta\//, '') as Parameters<
        typeof collectionFor
    >[0]
    const { sections } = staticDefinition
    const fieldsOf = (id: string) =>
        config.sections.find((section) => section.id === id)?.fields
    const contract = documentContracts.require<Document>(config.contractKey)
    /* The sheet is document output: it prints English whatever the UI language. */
    const printedLabel = () => translateEnglish(config.label)
    const defaultView = staticDefinition.createInitialView
    const defaultSheet = staticDefinition.createInitialSheet
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
            <div className="pbta-card pbta-specialized-playbook">
                <article className="pbta-specialized-sheet">
                    <button
                        type="button"
                        className="pbta-specialized-header"
                        onClick={() => open('basic')}
                    >
                        <h1>{String(doc.name ?? printedLabel())}</h1>
                        <p>{String(doc.description ?? '')}</p>
                    </button>
                    {sections.map(
                        (section) =>
                            !view.hidden[section.id] && (
                                <section
                                    key={section.id}
                                    className={`pbta-specialized-section pbta-specialized-section--${section.id}`}
                                >
                                    <button
                                        type="button"
                                        className="pbta-specialized-section-title"
                                        onClick={() => open(section.id)}
                                    >
                                        {translateEnglish(section.label)}
                                    </button>
                                    <div className="pbta-specialized-content">
                                        <SectionValue
                                            doc={doc}
                                            id={section.id}
                                            fields={fieldsOf(section.id)}
                                        />
                                    </div>
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
        const fields = fieldsOf(key)
        if (fields)
            return (
                <FieldsEditor
                    target={target}
                    fields={fields}
                    doc={doc}
                    shape={config.example ?? config.blank}
                    setDoc={setDoc}
                />
            )
        const section = doc[key]
        const presentation = collectionFor(target, key)
        if (presentation) {
            const items = collectionItems(doc, presentation)
            const Adapter = collectionAdapterFor(presentation.itemEditor)
            if (!Adapter || !items)
                return (
                    <p className="text-sm text-destructive">
                        Invalid published collection configuration for{' '}
                        {presentation.label}.
                    </p>
                )
            return (
                <PublishedCollectionEditor
                    presentation={presentation}
                    items={items}
                    onChange={(next) =>
                        setDoc(replaceCollectionItems(doc, presentation, next))
                    }
                />
            )
        }
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
        const text = useUiText()
        return (
            <div className="space-y-2">
                {sections.map((section) => (
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
                        {text(section.label)}
                    </label>
                ))}
            </div>
        )
    }
    return {
        ...staticDefinition,
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
            renderPanel: () => <Editor />,
        },
        appearance: {
            getPreviewWidth: (view) => view.previewWidth,
            renderPanel: () => <Appearance />,
        },
        export: {
            actions: [
                createTomlExportAction({
                    exportToml: (doc) => contract.stringifyToml(doc),
                    description: 'pbta:playbook.exportToml',
                }),
            ],
        },
    }
}
