import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'
import { StringListEditor } from '../../shared/StringListEditor'
import type { ClockPreset } from '../model'

export type ClockPresetsEditorProps = {
    value: ClockPreset[]
    onChange: (next: ClockPreset[]) => void
}

/* An array, not a record - clock presets are a menu a front picks from, so
   the order it appears in the preview is order the schema stores them.
   Move-up/down buttons stand in for @dnd-kit here: the list is small and
   short-lived, and a full drag wiring is not worth it for one array. */
export function ClockPresetsEditor({
    value,
    onChange,
}: ClockPresetsEditorProps) {
    const [draftKey, setDraftKey] = useState('')
    const [draftLabel, setDraftLabel] = useState('')

    function updateAt(index: number, preset: ClockPreset) {
        onChange(value.map((entry, i) => (i === index ? preset : entry)))
    }

    function removeAt(index: number) {
        onChange(value.filter((_, i) => i !== index))
    }

    function moveAt(index: number, offset: number) {
        const target = index + offset
        if (target < 0 || target >= value.length) return
        const next = [...value]
        const [entry] = next.splice(index, 1)
        next.splice(target, 0, entry)
        onChange(next)
    }

    function addPreset() {
        const key = draftKey.trim()
        if (!key || value.some((entry) => entry.key === key)) return
        onChange([
            ...value,
            {
                key,
                label: draftLabel.trim() || 'New preset',
                segments: ['Segment 1'],
            },
        ])
        setDraftKey('')
        setDraftLabel('')
    }

    return (
        <div className="space-y-2">
            {value.map((preset, index) => (
                <div
                    key={preset.key}
                    className="space-y-1.5 rounded-md border p-2"
                >
                    <div className="flex items-center gap-1.5">
                        <Input
                            className="h-8 w-24 text-xs"
                            value={preset.key}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...preset,
                                    key: event.target.value,
                                })
                            }
                            placeholder="key"
                        />
                        <Input
                            className="h-8 flex-1 text-xs"
                            value={preset.label}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...preset,
                                    label: event.target.value,
                                })
                            }
                            placeholder="Label"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Move ${preset.label || 'preset'} up`}
                            onClick={() => moveAt(index, -1)}
                        >
                            <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Move ${preset.label || 'preset'} down`}
                            onClick={() => moveAt(index, 1)}
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label={`Remove ${preset.label || 'preset'}`}
                            onClick={() => removeAt(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <StringListEditor
                        value={preset.segments}
                        onChange={(segments) =>
                            updateAt(index, { ...preset, segments })
                        }
                        placeholder="Add segment label and press Enter"
                    />
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Input
                    className="h-8 w-24 text-xs"
                    value={draftKey}
                    onChange={(event) => setDraftKey(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            addPreset()
                        }
                    }}
                    placeholder="key"
                />
                <Input
                    className="h-8 flex-1 text-xs"
                    value={draftLabel}
                    onChange={(event) => setDraftLabel(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            addPreset()
                        }
                    }}
                    placeholder="Label"
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={addPreset}
                >
                    Add preset
                </Button>
            </div>
        </div>
    )
}
