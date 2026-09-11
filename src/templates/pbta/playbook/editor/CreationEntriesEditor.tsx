import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { StringListEditor } from '../../shared/StringListEditor'
import type { CreationEntry } from '../model'

export type CreationEntriesEditorProps = {
    value: CreationEntry[]
    onChange: (next: CreationEntry[]) => void
}

/* Array of { label, options: string[] } - same index-based shape as
   ClockPresetsEditor, minus reordering: creation prompts print in the
   order they were added and nothing depends on that order changing. */
export function CreationEntriesEditor({
    value,
    onChange,
}: CreationEntriesEditorProps) {
    function updateAt(index: number, entry: CreationEntry) {
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
                            value={entry.label}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...entry,
                                    label: event.target.value,
                                })
                            }
                            placeholder="Label, e.g. Name"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Remove ${entry.label || 'entry'}`}
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <StringListEditor
                        value={entry.options}
                        onChange={(options) =>
                            updateAt(index, { ...entry, options })
                        }
                        placeholder="Add option and press Enter"
                    />
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
                        { label: 'New Entry', options: ['Option 1'] },
                    ])
                }
            >
                Add entry
            </Button>
        </div>
    )
}
