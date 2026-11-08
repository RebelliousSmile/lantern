import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUiText } from '@/i18n/text'
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
    const text = useUiText()
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
                            placeholder={text(
                                'pbta:forms.playbook.creation.labelPlaceholder'
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={text('pbta:forms.shared.remove', {
                                name:
                                    entry.label ||
                                    text('pbta:forms.shared.names.entry'),
                            })}
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <StringListEditor
                        value={entry.options.map((option) =>
                            typeof option === 'string' ? option : option.label
                        )}
                        onChange={(options) =>
                            updateAt(index, { ...entry, options })
                        }
                        placeholder={text(
                            'pbta:forms.shared.list.addOptionPlaceholder'
                        )}
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
                {text('pbta:forms.playbook.creation.add')}
            </Button>
        </div>
    )
}
