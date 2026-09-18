import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useMonsterheartsSheet, useMonsterheartsStore } from '../hooks'
import type { MonsterheartsEditorial, MonsterheartsPlaybook } from '../model'

type MonsterheartsMove = MonsterheartsPlaybook['moves'][number]

function blankMove(checked = false): MonsterheartsMove {
    return {
        name: 'New Move',
        moveType: 'skin',
        description: 'Describe this move.',
        ...(checked ? { checked: true } : {}),
    }
}

function withoutChecked(move: MonsterheartsMove): MonsterheartsMove {
    const next = { ...move }
    delete next.checked
    return next
}

function MonsterheartsMovesEditor({
    value,
    onChange,
}: {
    value: MonsterheartsMove[]
    onChange: (next: MonsterheartsMove[]) => void
}) {
    function updateAt(index: number, move: MonsterheartsMove) {
        onChange(value.map((current, i) => (i === index ? move : current)))
    }

    function moveAt(index: number, offset: number) {
        const target = index + offset
        if (target < 0 || target >= value.length) return
        const next = [...value]
        const [move] = next.splice(index, 1)
        next.splice(target, 0, move)
        onChange(next)
    }

    return (
        <div className="space-y-2">
            {value.map((move, index) => {
                const isReference = 'ref' in move
                return (
                    <div key={index} className="space-y-2 rounded-md border p-2">
                        <div className="flex items-center gap-1.5">
                            <Checkbox
                                checked={move.checked === true}
                                aria-label="Move acquired"
                                onCheckedChange={(checked) =>
                                    updateAt(
                                        index,
                                        checked === true
                                            ? { ...move, checked: true }
                                            : withoutChecked(move)
                                    )
                                }
                            />
                            <div className="flex overflow-hidden rounded-md border">
                                <Button
                                    type="button"
                                    variant={isReference ? 'secondary' : 'ghost'}
                                    size="xs"
                                    onClick={() =>
                                        !isReference &&
                                        updateAt(index, {
                                            ref: 'new-move',
                                            ...(move.checked
                                                ? { checked: true }
                                                : {}),
                                        })
                                    }
                                >
                                    Ref
                                </Button>
                                <Button
                                    type="button"
                                    variant={isReference ? 'ghost' : 'secondary'}
                                    size="xs"
                                    onClick={() =>
                                        isReference &&
                                        updateAt(
                                            index,
                                            blankMove(move.checked === true)
                                        )
                                    }
                                >
                                    Inline
                                </Button>
                            </div>
                            <div className="flex-1" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Move up"
                                onClick={() => moveAt(index, -1)}
                            >
                                <ChevronUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Move down"
                                onClick={() => moveAt(index, 1)}
                            >
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Remove move"
                                onClick={() =>
                                    onChange(value.filter((_, i) => i !== index))
                                }
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        {isReference ? (
                            <Input
                                value={move.ref}
                                onChange={(event) =>
                                    updateAt(index, {
                                        ...move,
                                        ref: event.target.value,
                                    })
                                }
                                placeholder="move.slug"
                            />
                        ) : (
                            <>
                                <Label>
                                    Name
                                    <Input
                                        value={move.name}
                                        onChange={(event) =>
                                            updateAt(index, {
                                                ...move,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </Label>
                                <Label>
                                    Type
                                    <Input
                                        value={move.moveType}
                                        onChange={(event) =>
                                            updateAt(index, {
                                                ...move,
                                                moveType: event.target.value,
                                            })
                                        }
                                    />
                                </Label>
                                <Label>
                                    Description
                                    <Textarea
                                        value={move.description}
                                        onChange={(event) =>
                                            updateAt(index, {
                                                ...move,
                                                description: event.target.value,
                                            })
                                        }
                                    />
                                </Label>
                            </>
                        )}
                    </div>
                )
            })}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onChange([...value, blankMove()])}
            >
                Add move
            </Button>
        </div>
    )
}

export function MonsterheartsPlaybookEditorPanel() {
    const { sheet } = useMonsterheartsSheet()
    const { playbook, setPlaybook } = useMonsterheartsStore()
    if (!sheet.open || !sheet.target)
        return (
            <p className="text-sm text-muted-foreground">
                Click a skin section to edit it.
            </p>
        )
    if (sheet.target === 'basic')
        return (
            <div className="space-y-3">
                <Label>
                    Name
                    <Input
                        value={playbook.name}
                        onChange={(event) =>
                            setPlaybook({ name: event.target.value })
                        }
                    />
                </Label>
                <Label>
                    Description
                    <Textarea
                        value={playbook.description}
                        onChange={(event) =>
                            setPlaybook({ description: event.target.value })
                        }
                    />
                </Label>
            </div>
        )
    if (sheet.target === 'editorial') {
        const updateBlock = (
            key: keyof MonsterheartsEditorial,
            patch: Partial<MonsterheartsEditorial[keyof MonsterheartsEditorial]>
        ) =>
            setPlaybook({
                editorial: {
                    ...playbook.editorial,
                    [key]: { ...playbook.editorial[key], ...patch },
                },
            })

        return (
            <div className="space-y-5">
                {Object.entries(playbook.editorial).map(([key, block]) => (
                    <fieldset key={key} className="space-y-2">
                        <legend className="font-semibold">
                            {block.heading}
                        </legend>
                        <Label>
                            Title
                            <Input
                                value={block.heading}
                                onChange={(event) =>
                                    updateBlock(
                                        key as keyof MonsterheartsEditorial,
                                        { heading: event.target.value }
                                    )
                                }
                            />
                        </Label>
                        <Label>
                            Text
                            <Textarea
                                value={block.paragraphs.join('\n\n')}
                                onChange={(event) =>
                                    updateBlock(
                                        key as keyof MonsterheartsEditorial,
                                        {
                                            paragraphs: event.target.value
                                                .split(/\n\s*\n/)
                                                .filter(Boolean),
                                        }
                                    )
                                }
                            />
                        </Label>
                    </fieldset>
                ))}
            </div>
        )
    }
    if (sheet.target === 'moves')
        return (
            <MonsterheartsMovesEditor
                value={playbook.moves}
                onChange={(moves) => setPlaybook({ moves })}
            />
        )
    const key = sheet.target
    const value = (playbook as Record<string, unknown>)[key]
    return (
        <SchemaEditor
            schema={inferObject(key, value as Record<string, unknown>)}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={(next) =>
                setPlaybook({ [key]: next } as Partial<typeof playbook>)
            }
        />
    )
}
