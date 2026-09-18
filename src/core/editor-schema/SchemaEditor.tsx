import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { getAtPath, joinPath } from './path'
import type {
    CollectionDescriptor,
    EditorDescriptor,
    EditorPath,
    ObjectDescriptor,
    TemplateEditorSchema,
    VariantDescriptor,
} from './types'

type Props = {
    schema: TemplateEditorSchema | ObjectDescriptor
    value: Record<string, unknown>
    onChange: (value: Record<string, unknown>) => void
    path?: EditorPath
}

function visible(
    descriptor: EditorDescriptor,
    root: Record<string, unknown>
): boolean {
    const condition = descriptor.condition
    return !condition || getAtPath(root, condition.path) === condition.equals
}

function replaceAt(
    value: Record<string, unknown>,
    path: EditorPath,
    next: unknown
): Record<string, unknown> {
    if (!path.length) return next as Record<string, unknown>
    const [head, ...tail] = path
    if (typeof head !== 'string') return value
    return {
        ...value,
        [head]: tail.length
            ? replaceAt(
                  (value[head] as Record<string, unknown>) ?? {},
                  tail,
                  next
              )
            : next,
    }
}

export function SchemaEditor({ schema, value, onChange, path = [] }: Props) {
    return (
        <div className="space-y-4">
            {schema.fields.map((descriptor) =>
                visible(descriptor, value) ? (
                    <Field
                        key={descriptor.id}
                        descriptor={descriptor}
                        root={value}
                        path={joinPath(path, descriptor.id)}
                        onChange={onChange}
                    />
                ) : null
            )}
        </div>
    )
}

function Field({
    descriptor,
    root,
    path,
    onChange,
}: {
    descriptor: EditorDescriptor
    root: Record<string, unknown>
    path: EditorPath
    onChange: (value: Record<string, unknown>) => void
}) {
    const value = getAtPath(root, path)
    const update = (next: unknown) => onChange(replaceAt(root, path, next))
    if (descriptor.kind === 'scalar') {
        if (descriptor.scalar === 'boolean')
            return (
                <Label className="flex items-center gap-2">
                    <Checkbox
                        checked={value === true}
                        disabled={descriptor.readOnly}
                        onCheckedChange={(checked) => update(checked === true)}
                    />
                    {descriptor.label}
                </Label>
            )
        return (
            <Label className="grid gap-1 text-sm">
                {descriptor.label}
                {descriptor.scalar === 'textarea' ? (
                    <Textarea
                        value={String(value ?? '')}
                        placeholder={descriptor.placeholder}
                        disabled={descriptor.readOnly}
                        onChange={(event) => update(event.target.value)}
                    />
                ) : (
                    <Input
                        type={
                            descriptor.scalar === 'number' ? 'number' : 'text'
                        }
                        value={String(value ?? '')}
                        placeholder={descriptor.placeholder}
                        disabled={descriptor.readOnly}
                        onChange={(event) =>
                            update(
                                descriptor.scalar === 'number'
                                    ? Number(event.target.value)
                                    : event.target.value
                            )
                        }
                    />
                )}
            </Label>
        )
    }
    if (descriptor.kind === 'object')
        return (
            <fieldset className="space-y-3 rounded-md border p-3">
                <legend className="px-1 text-sm font-medium">
                    {descriptor.label}
                </legend>
                <SchemaEditor
                    schema={descriptor}
                    value={(value as Record<string, unknown>) ?? {}}
                    onChange={update}
                />
            </fieldset>
        )
    if (descriptor.kind === 'collection')
        return (
            <CollectionField
                descriptor={descriptor}
                root={root}
                path={path}
                onChange={onChange}
            />
        )
    return (
        <VariantField
            descriptor={descriptor}
            root={root}
            path={path}
            onChange={onChange}
        />
    )
}

function CollectionField({
    descriptor,
    root,
    path,
    onChange,
}: {
    descriptor: CollectionDescriptor
    root: Record<string, unknown>
    path: EditorPath
    onChange: (value: Record<string, unknown>) => void
}) {
    const entries = getAtPath(root, path)
    const list = Array.isArray(entries) ? entries : []
    const replace = (next: unknown[]) => onChange(replaceAt(root, path, next))
    return (
        <fieldset className="space-y-2 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">
                {descriptor.label}
            </legend>
            {list.map((entry, index) => (
                <div key={index} className="space-y-2 rounded border p-2">
                    {descriptor.item.kind === 'object' ? (
                        <SchemaEditor
                            schema={descriptor.item}
                            value={(entry as Record<string, unknown>) ?? {}}
                            onChange={(next) =>
                                replace(
                                    list.map((item, itemIndex) =>
                                        itemIndex === index ? next : item
                                    )
                                )
                            }
                        />
                    ) : (
                        <Field
                            descriptor={descriptor.item}
                            root={{ value: entry }}
                            path={['value']}
                            onChange={(next) =>
                                replace(
                                    list.map((item, itemIndex) =>
                                        itemIndex === index ? next.value : item
                                    )
                                )
                            }
                        />
                    )}
                    <div className="flex gap-1">
                        {descriptor.reorderable ? (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Move ${descriptor.label} item up`}
                                    disabled={index === 0}
                                    onClick={() => {
                                        const next = [...list]
                                        ;[next[index - 1], next[index]] = [
                                            next[index],
                                            next[index - 1],
                                        ]
                                        replace(next)
                                    }}
                                >
                                    <ChevronUp />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Move ${descriptor.label} item down`}
                                    disabled={index === list.length - 1}
                                    onClick={() => {
                                        const next = [...list]
                                        ;[next[index], next[index + 1]] = [
                                            next[index + 1],
                                            next[index],
                                        ]
                                        replace(next)
                                    }}
                                >
                                    <ChevronDown />
                                </Button>
                            </>
                        ) : null}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${descriptor.label} item`}
                            disabled={list.length <= (descriptor.minItems ?? 0)}
                            onClick={() =>
                                replace(
                                    list.filter(
                                        (_, itemIndex) => itemIndex !== index
                                    )
                                )
                            }
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => replace([...list, descriptor.createEmpty()])}
            >
                <Plus />
                Add {descriptor.label}
            </Button>
        </fieldset>
    )
}

function VariantField({
    descriptor,
    root,
    path,
    onChange,
}: {
    descriptor: VariantDescriptor
    root: Record<string, unknown>
    path: EditorPath
    onChange: (value: Record<string, unknown>) => void
}) {
    const current = (getAtPath(root, path) as Record<string, unknown>) ?? {}
    const selected = String(
        current[descriptor.discriminator] ?? descriptor.options[0]?.value ?? ''
    )
    const option = descriptor.options.find(({ value }) => value === selected)
    const update = (next: Record<string, unknown>) =>
        onChange(replaceAt(root, path, next))
    return (
        <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">
                {descriptor.label}
            </legend>
            <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={selected}
                onChange={(event) =>
                    update(
                        descriptor.options
                            .find(({ value }) => value === event.target.value)
                            ?.createEmpty() ?? {}
                    )
                }
            >
                {descriptor.options.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                        {entry.label}
                    </option>
                ))}
            </select>
            {option ? (
                <SchemaEditor
                    schema={{
                        id: descriptor.id,
                        label: descriptor.label,
                        kind: 'object',
                        fields: option.fields,
                    }}
                    value={current}
                    onChange={update}
                />
            ) : null}
        </fieldset>
    )
}
