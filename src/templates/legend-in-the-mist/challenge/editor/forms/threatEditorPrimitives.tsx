import { SystemMarkdownScope } from '@/components/markdown/SystemMarkdownScope'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { renderLitmMarkdown } from '@/utils/markdown'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react'
import type { ReactNode } from 'react'

type RowProps = {
    id: string
    dragDisabled: boolean
    children?: ReactNode
}

type SortableBindings = Pick<
    ReturnType<typeof useSortable>,
    'attributes' | 'listeners'
>

export function ThreatRow({
    id,
    name,
    description,
    count,
    dragDisabled,
    onEdit,
    onRemove,
    onOpenConsequences,
    children,
}: RowProps & {
    name: string
    description?: string | null
    count: number
    onEdit: () => void
    onRemove: () => void
    onOpenConsequences: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: dragDisabled })
    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`rounded-md border bg-white px-2.5 py-2 ${isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''}`}
        >
            <div className="flex items-center gap-2">
                <DragHandle
                    disabled={dragDisabled}
                    attributes={attributes}
                    listeners={listeners}
                    label="Drag to reorder threat"
                />
                <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1.5">
                    <div className="min-w-0">
                        <div className="font-semibold threat-pill !text-[10px] !h-auto !min-h-[1.6em] !w-fit !max-w-full !px-1.5 !py-1 leading-tight whitespace-normal break-words">
                            {name}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7"
                                onClick={onOpenConsequences}
                                aria-label="Edit consequences"
                                title="Consequences"
                            >
                                <img
                                    src="/assets/images/consequence.svg"
                                    alt=""
                                    className="h-5 w-5"
                                />
                            </Button>
                            {count > 0 ? (
                                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-3.5 min-w-[0.9rem] items-center justify-center rounded-full border border-zinc-400 bg-secondary px-1 text-[10px] leading-none text-secondary-foreground">
                                    {count}
                                </span>
                            ) : null}
                        </div>
                        <IconButton label="Edit" onClick={onEdit}>
                            <Pencil className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                            label="Remove"
                            onClick={onRemove}
                            destructive
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                    </div>
                    {description ? (
                        <SystemMarkdownScope
                            className="col-span-2 min-w-0 text-sm prose-sm max-w-none font-(family-name:--font-ch-threat-desc)"
                            as="div"
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(description),
                                }}
                            />
                        </SystemMarkdownScope>
                    ) : (
                        <div className="col-span-2 text-sm text-muted-foreground">
                            No description
                        </div>
                    )}
                </div>
            </div>
            {children}
        </li>
    )
}

export function ConsequenceRow({
    id,
    text,
    dragDisabled,
    isEditing,
    onEdit,
    onRemove,
    children,
}: RowProps & {
    text: string
    isEditing: boolean
    onEdit: () => void
    onRemove: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: dragDisabled })
    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`flex items-center justify-between gap-1.5 rounded-md border bg-white px-2.5 py-1.5 ${isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''}`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <DragHandle
                    disabled={dragDisabled}
                    attributes={attributes}
                    listeners={listeners}
                    label="Drag to reorder consequence"
                />
                {isEditing ? (
                    <div className="min-w-0 flex-1">{children}</div>
                ) : (
                    <SystemMarkdownScope
                        className="min-w-0 flex-1 font-[Labrada] prose-sm max-w-none text-foreground/90"
                        as="div"
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(text),
                            }}
                        />
                    </SystemMarkdownScope>
                )}
            </div>
            {!isEditing ? (
                <IconButton label="Edit" onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5" />
                </IconButton>
            ) : null}
            <IconButton label="Remove" onClick={onRemove} destructive>
                <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
        </li>
    )
}

export function InlineConsequenceEditor({
    value,
    onChange,
    onSave,
    onCancel,
}: {
    value: string
    onChange: (value: string) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="flex items-center gap-1.5">
            <Input
                className="h-8 flex-1 px-2 text-sm"
                autoFocus
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') onSave()
                    if (event.key === 'Escape') onCancel()
                }}
            />
            <Button
                size="icon-xs"
                className="h-5 w-5 shrink-0"
                title="Save"
                onClick={onSave}
            >
                <Check className="h-3 w-3" />
            </Button>
            <Button
                size="icon-xs"
                variant="secondary"
                className="h-5 w-5 shrink-0"
                title="Cancel"
                onClick={onCancel}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    )
}

function DragHandle({
    disabled,
    attributes,
    listeners,
    label,
}: {
    disabled: boolean
    attributes: SortableBindings['attributes']
    listeners: SortableBindings['listeners']
    label: string
}) {
    return (
        <button
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-slate-50 ${disabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : 'cursor-grab active:cursor-grabbing'}`}
            aria-label={label}
            title={disabled ? 'Finish editing to reorder' : label}
            disabled={disabled}
            {...(!disabled ? attributes : {})}
            {...(!disabled ? listeners : {})}
        >
            <GripVertical className="h-3.5 w-3.5 text-slate-500" />
        </button>
    )
}

function IconButton({
    label,
    onClick,
    destructive,
    children,
}: {
    label: string
    onClick: () => void
    destructive?: boolean
    children: ReactNode
}) {
    return (
        <Button
            variant="ghost"
            size="icon-sm"
            className={`h-7 w-7 ${destructive ? 'text-destructive' : ''}`}
            title={label}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
