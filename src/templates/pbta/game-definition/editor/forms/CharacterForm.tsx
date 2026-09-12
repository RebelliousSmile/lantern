import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { useGameDefinitionStore } from '../../hooks'
import type { StatToggle } from '../../model'
import { AttributeListEditor } from '../AttributeListEditor'
import { RecordListEditor } from '../RecordListEditor'

type StatToggleKind = 'none' | 'stat' | 'custom'

function statToggleKind(value: StatToggle | null): StatToggleKind {
    if (value == null) return 'none'
    return typeof value === 'string' ? 'stat' : 'custom'
}

function StatToggleField({
    value,
    onChange,
}: {
    value: StatToggle | null
    onChange: (next: StatToggle | null) => void
}) {
    const kind = statToggleKind(value)

    return (
        <div className="space-y-1.5">
            <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                {(
                    [
                        ['none', 'None'],
                        ['stat', 'Stat key'],
                        ['custom', 'Custom'],
                    ] as const
                ).map(([option, optionLabel]) => (
                    <button
                        key={option}
                        type="button"
                        className={cn(
                            'h-7 border-none px-2 text-xs',
                            kind === option ? '' : 'bg-background'
                        )}
                        onClick={() => {
                            if (option === 'none') onChange(null)
                            else if (option === 'stat') onChange('')
                            else onChange({ label: '', modifier: 0 })
                        }}
                    >
                        {optionLabel}
                    </button>
                ))}
            </div>
            {kind === 'stat' && (
                <Input
                    className="h-8 text-xs"
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Stat key this toggle switches, e.g. cool"
                />
            )}
            {kind === 'custom' && typeof value === 'object' && value && (
                <div className="flex items-center gap-2">
                    <Input
                        className="h-8 flex-1 text-xs"
                        value={value.label}
                        onChange={(event) =>
                            onChange({ ...value, label: event.target.value })
                        }
                        placeholder="Label"
                    />
                    <Input
                        className="h-8 w-20 text-xs"
                        type="number"
                        value={value.modifier}
                        onChange={(event) =>
                            onChange({
                                ...value,
                                modifier: Math.floor(
                                    Number(event.target.value) || 0
                                ),
                            })
                        }
                        placeholder="Mod"
                    />
                </div>
            )}
        </div>
    )
}

export default function CharacterForm() {
    const { gameDefinition, setCharacter } = useGameDefinitionStore()
    const character = gameDefinition.character

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Stats</Label>
                <RecordListEditor
                    value={character.stats}
                    onChange={(stats) => setCharacter({ stats })}
                    keyPlaceholder="key"
                    valuePlaceholder="Stat label"
                />
            </div>

            <div className="grid gap-1">
                <Label>Stat toggle</Label>
                <StatToggleField
                    value={character.statToggle}
                    onChange={(statToggle) => setCharacter({ statToggle })}
                />
            </div>

            <div className="grid gap-1">
                <Label>Attributes</Label>
                <AttributeListEditor
                    value={character.attributes}
                    onChange={(attributes) => setCharacter({ attributes })}
                />
            </div>

            <div className="grid gap-1">
                <Label>Move types</Label>
                <RecordListEditor
                    value={character.moveTypes}
                    onChange={(moveTypes) => setCharacter({ moveTypes })}
                    keyPlaceholder="key"
                    valuePlaceholder="Move type label"
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    Equipment types{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <RecordListEditor
                    value={character.equipmentTypes}
                    onChange={(equipmentTypes) =>
                        setCharacter({ equipmentTypes })
                    }
                    keyPlaceholder="key"
                    valuePlaceholder="Equipment type label"
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-character-description">
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="pbta-def-character-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={character.description}
                    onChange={(event) =>
                        setCharacter({ description: event.target.value })
                    }
                    placeholder="Supports Markdown."
                />
            </div>
        </div>
    )
}
