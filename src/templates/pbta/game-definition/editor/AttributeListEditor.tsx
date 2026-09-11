import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { Attribute, AttributeType } from '../../shared/attributeField'
import { StringListEditor } from '../../shared/StringListEditor'

const ATTRIBUTE_TYPES: AttributeType[] = [
    'Number',
    'Text',
    'LongText',
    'Resource',
    'Clock',
    'Xp',
    'Checkbox',
    'ListOne',
    'ListMany',
    'Roll',
    'Track',
]

type CommonAttributeFields = Pick<
    Attribute,
    | 'label'
    | 'description'
    | 'position'
    | 'customLabel'
    | 'limited'
    | 'visibleFor'
>

function extractCommonFields(attribute: Attribute): CommonAttributeFields {
    const { label, description, position, customLabel, limited, visibleFor } =
        attribute
    return { label, description, position, customLabel, limited, visibleFor }
}

/* `visibleFor`/`customLabel`/`limited` are not editable here (see
   AttributeField's own consumers for that), but a type change must still
   carry them over rather than drop them - they may have arrived via an
   imported TOML. */
function changeAttributeType(
    attribute: Attribute,
    type: AttributeType
): Attribute {
    const common = extractCommonFields(attribute)
    switch (type) {
        case 'Resource':
            return { ...common, type, max: 4 }
        case 'Clock':
            return { ...common, type, max: 6 }
        case 'Xp':
            return { ...common, type, max: 5 }
        case 'ListOne':
            return { ...common, type, options: ['Option 1'] }
        case 'ListMany':
            return { ...common, type, options: ['Option 1'] }
        default:
            return { ...common, type }
    }
}

function NumberField({
    label,
    value,
    onChange,
    readOnly,
}: {
    label: string
    value: number | undefined
    onChange: (value: number | undefined) => void
    readOnly?: boolean
}) {
    return (
        <label className="flex items-center gap-1.5 text-xs">
            {label}
            <Input
                type="number"
                className="h-8 w-20 text-xs"
                value={value ?? ''}
                disabled={readOnly}
                onChange={(event) => {
                    const raw = event.target.value
                    onChange(raw === '' ? undefined : Number(raw))
                }}
            />
        </label>
    )
}

function AttributeTypeSpecificFields({
    attribute,
    onChange,
    readOnly,
}: {
    attribute: Attribute
    onChange: (next: Attribute) => void
    readOnly?: boolean
}) {
    switch (attribute.type) {
        case 'Number':
            return (
                <NumberField
                    label="Default"
                    value={attribute.default}
                    onChange={(value) =>
                        onChange({ ...attribute, default: value })
                    }
                    readOnly={readOnly}
                />
            )
        case 'Text':
            return (
                <Input
                    className="h-8 text-xs"
                    value={attribute.default ?? ''}
                    disabled={readOnly}
                    onChange={(event) =>
                        onChange({
                            ...attribute,
                            default: event.target.value || undefined,
                        })
                    }
                    placeholder="Default value"
                />
            )
        case 'LongText':
            return (
                <Textarea
                    className="text-xs"
                    rows={2}
                    value={attribute.default ?? ''}
                    disabled={readOnly}
                    onChange={(event) =>
                        onChange({
                            ...attribute,
                            default: event.target.value || undefined,
                        })
                    }
                    placeholder="Default value"
                />
            )
        case 'Resource':
        case 'Clock':
        case 'Xp':
            return (
                <div className="flex items-center gap-3">
                    <NumberField
                        label="Max"
                        value={attribute.max}
                        onChange={(value) =>
                            onChange({ ...attribute, max: value })
                        }
                        readOnly={readOnly}
                    />
                    <NumberField
                        label="Default"
                        value={attribute.default}
                        onChange={(value) =>
                            onChange({ ...attribute, default: value })
                        }
                        readOnly={readOnly}
                    />
                </div>
            )
        case 'Checkbox':
            return (
                <div className="flex items-center gap-3">
                    <Input
                        className="h-8 flex-1 text-xs"
                        value={attribute.checkboxLabel ?? ''}
                        disabled={readOnly}
                        onChange={(event) =>
                            onChange({
                                ...attribute,
                                checkboxLabel: event.target.value || undefined,
                            })
                        }
                        placeholder="Checkbox label (optional)"
                    />
                    <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                        <Checkbox
                            checked={!!attribute.default}
                            disabled={readOnly}
                            onCheckedChange={(checked) =>
                                onChange({
                                    ...attribute,
                                    default: !!checked,
                                })
                            }
                        />
                        Default checked
                    </label>
                </div>
            )
        case 'ListOne':
            return (
                <div className="space-y-1.5">
                    <StringListEditor
                        value={attribute.options}
                        onChange={(options) =>
                            onChange({ ...attribute, options })
                        }
                    />
                    <label className="flex items-center gap-1.5 text-xs">
                        <Checkbox
                            checked={!!attribute.sort}
                            disabled={readOnly}
                            onCheckedChange={(checked) =>
                                onChange({ ...attribute, sort: !!checked })
                            }
                        />
                        Sort alphabetically
                    </label>
                </div>
            )
        case 'ListMany':
            return (
                <div className="space-y-1.5">
                    <StringListEditor
                        value={attribute.options ?? []}
                        onChange={(options) =>
                            onChange({ ...attribute, options })
                        }
                    />
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs">
                            <Checkbox
                                checked={!!attribute.sort}
                                disabled={readOnly}
                                onCheckedChange={(checked) =>
                                    onChange({
                                        ...attribute,
                                        sort: !!checked,
                                    })
                                }
                            />
                            Sort alphabetically
                        </label>
                        <label className="flex items-center gap-1.5 text-xs">
                            <Checkbox
                                checked={!!attribute.condition}
                                disabled={readOnly}
                                onCheckedChange={(checked) =>
                                    onChange({
                                        ...attribute,
                                        condition: !!checked,
                                    })
                                }
                            />
                            Condition
                        </label>
                    </div>
                </div>
            )
        case 'Roll':
            return (
                <div className="space-y-1.5">
                    <Input
                        className="h-8 text-xs"
                        value={attribute.default ?? ''}
                        disabled={readOnly}
                        onChange={(event) =>
                            onChange({
                                ...attribute,
                                default: event.target.value || undefined,
                            })
                        }
                        placeholder="Default roll formula"
                    />
                    <label className="flex items-center gap-1.5 text-xs">
                        <Checkbox
                            checked={!!attribute.showResults}
                            disabled={readOnly}
                            onCheckedChange={(checked) =>
                                onChange({
                                    ...attribute,
                                    showResults: !!checked,
                                })
                            }
                        />
                        Show results
                    </label>
                </div>
            )
        case 'Track':
            return null
        default:
            return null
    }
}

function AttributeRowFields({
    attribute,
    onChange,
    readOnly,
}: {
    attribute: Attribute
    onChange: (next: Attribute) => void
    readOnly?: boolean
}) {
    return (
        <div className="space-y-2">
            <Input
                className="h-8 text-xs"
                value={attribute.description ?? ''}
                disabled={readOnly}
                onChange={(event) =>
                    onChange({
                        ...attribute,
                        description: event.target.value || undefined,
                    })
                }
                placeholder="Description (optional)"
            />
            <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Column</span>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    <button
                        type="button"
                        disabled={readOnly}
                        className={cn(
                            'h-7 border-none px-2 text-xs',
                            !attribute.position ? '' : 'bg-background'
                        )}
                        onClick={() =>
                            onChange({ ...attribute, position: undefined })
                        }
                    >
                        Auto
                    </button>
                    {(['top', 'left'] as const).map((position) => (
                        <button
                            key={position}
                            type="button"
                            disabled={readOnly}
                            className={cn(
                                'h-7 border-none px-2 text-xs capitalize',
                                attribute.position === position
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() => onChange({ ...attribute, position })}
                        >
                            {position}
                        </button>
                    ))}
                </div>
            </div>
            <AttributeTypeSpecificFields
                attribute={attribute}
                onChange={onChange}
                readOnly={readOnly}
            />
        </div>
    )
}

export type AttributeListEditorProps = {
    value: Record<string, Attribute>
    onChange: (next: Record<string, Attribute>) => void
    readOnly?: boolean
}

/* Editor for a game definition's `character.attributes` / `npc.attributes`
   record: defines the attribute, unlike `shared/attributeField.tsx`'s
   `AttributeField`, which renders/edits a value against a definition
   already fixed. */
export function AttributeListEditor({
    value,
    onChange,
    readOnly,
}: AttributeListEditorProps) {
    const [draftKey, setDraftKey] = useState('')
    const entries = Object.entries(value)

    function renameEntry(index: number, nextKey: string) {
        const next = entries.map(
            ([key, attribute], entryIndex) =>
                [entryIndex === index ? nextKey : key, attribute] as const
        )
        onChange(Object.fromEntries(next))
    }

    function updateEntry(key: string, attribute: Attribute) {
        onChange({ ...value, [key]: attribute })
    }

    function removeEntry(key: string) {
        const next = { ...value }
        delete next[key]
        onChange(next)
    }

    function addAttribute() {
        const key = draftKey.trim()
        if (!key || key in value) return
        onChange({ ...value, [key]: { type: 'Text', label: key } })
        setDraftKey('')
    }

    return (
        <div className="space-y-2">
            {entries.map(([key, attribute], index) => (
                <div key={index} className="space-y-2 rounded-md border p-2">
                    <div className="flex items-center gap-1.5">
                        <Input
                            className="h-8 w-24 text-xs"
                            value={key}
                            disabled={readOnly}
                            onChange={(event) =>
                                renameEntry(index, event.target.value)
                            }
                            placeholder="key"
                        />
                        <Select
                            value={attribute.type}
                            disabled={readOnly}
                            onValueChange={(nextType) =>
                                updateEntry(
                                    key,
                                    changeAttributeType(
                                        attribute,
                                        nextType as AttributeType
                                    )
                                )
                            }
                        >
                            <SelectTrigger
                                size="sm"
                                className="h-8 w-28 text-xs"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ATTRIBUTE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={attribute.label}
                            disabled={readOnly}
                            onChange={(event) =>
                                updateEntry(key, {
                                    ...attribute,
                                    label: event.target.value,
                                })
                            }
                            placeholder="Label"
                        />
                        {!readOnly && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="shrink-0"
                                aria-label={`Remove ${key || 'attribute'}`}
                                onClick={() => removeEntry(key)}
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                    <AttributeRowFields
                        attribute={attribute}
                        readOnly={readOnly}
                        onChange={(next) => updateEntry(key, next)}
                    />
                </div>
            ))}
            {!readOnly && (
                <div className="flex items-center gap-1.5">
                    <Input
                        className="h-8 w-40 text-xs"
                        value={draftKey}
                        onChange={(event) => setDraftKey(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                addAttribute()
                            }
                        }}
                        placeholder="key"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="shrink-0 text-xs"
                        onClick={addAttribute}
                    >
                        Add attribute
                    </Button>
                </div>
            )}
        </div>
    )
}
