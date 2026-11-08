import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { X } from 'lucide-react'
import { StringListEditor } from '../../shared/StringListEditor'
import type { GearEntry } from '../model'

export type GearEditorProps = {
    value: GearEntry[]
    onChange: (next: GearEntry[]) => void
}

/* Array of structured objects, index-based like CreationEntriesEditor:
   gear prints in list order and nothing needs reordering. */
export function GearEditor({ value, onChange }: GearEditorProps) {
    const text = useUiText()
    function updateAt(index: number, entry: GearEntry) {
        onChange(value.map((current, i) => (i === index ? entry : current)))
    }

    function removeAt(index: number) {
        onChange(value.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-2">
            {value.map((entry, index) => (
                <div key={index} className="space-y-1.5 rounded-md border p-2">
                    <div className="flex items-center gap-1.5">
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={entry.name}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    name: event.target.value,
                                })
                            }
                            placeholder={text('fields.name')}
                        />
                        <Input
                            className="h-8 w-28 text-xs"
                            value={entry.equipmentType}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    equipmentType: event.target.value,
                                })
                            }
                            placeholder={text(
                                'pbta:forms.playbook.gear.typeKeyPlaceholder'
                            )}
                        />
                        <Input
                            className="h-8 w-20 text-xs"
                            type="number"
                            value={entry.quantity ?? ''}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    quantity: event.target.value
                                        ? Math.floor(Number(event.target.value))
                                        : null,
                                })
                            }
                            placeholder={text(
                                'pbta:forms.playbook.gear.quantityPlaceholder'
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={text('pbta:forms.shared.remove', {
                                name:
                                    entry.name ||
                                    text('pbta:forms.shared.names.gear'),
                            })}
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <Textarea
                        rows={2}
                        className="px-2 py-1 text-xs"
                        value={entry.description}
                        onChange={(event) =>
                            updateAt(index, {
                                ...entry,
                                description: event.target.value,
                            })
                        }
                        placeholder={text('fields.description')}
                    />
                    <div className="grid gap-1">
                        <Label className="text-xs text-muted-foreground">
                            {text('pbta:forms.playbook.labels.tags')}
                        </Label>
                        <StringListEditor
                            value={entry.tags}
                            onChange={(tags) =>
                                updateAt(index, { ...entry, tags })
                            }
                            placeholder={text(
                                'pbta:forms.shared.list.addTagPlaceholder'
                            )}
                        />
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() =>
                    onChange([
                        ...value,
                        {
                            name: 'New Gear',
                            equipmentType: '',
                            description: '',
                            quantity: null,
                            tags: [],
                        },
                    ])
                }
            >
                {text('pbta:forms.playbook.gear.add')}
            </Button>
        </div>
    )
}
