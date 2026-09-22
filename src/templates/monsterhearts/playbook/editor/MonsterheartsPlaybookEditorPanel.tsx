import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { PublishedCollectionEditor } from '@/templates/pbta/specialized/collectionAdapters'
import {
    collectionItems,
    replaceCollectionItems,
} from '@/templates/pbta/specialized/collectionPolicy'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPbtaCollectionPresentation } from 'schema-pbta'
import {
    useMonsterheartsSheet,
    useMonsterheartsStore,
    useMonsterheartsView,
} from '../hooks'
import type { MonsterheartsEditorial, MonsterheartsPlaybook } from '../model'

type MonsterheartsMove = MonsterheartsPlaybook['moves'][number]

function StatBoundInput({
    name,
    field,
    value,
    onChange,
}: {
    name: string
    field: 'minimum' | 'maximum'
    value: number
    onChange: (value: number) => void
}) {
    const { t } = useTranslation()
    const [unlocked, setUnlocked] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const hint = t('pbta:monsterhearts.fields.boundsLocked')

    return (
        <Tooltip
            open={showHint && !unlocked}
            onOpenChange={(open) => {
                if (!open) setShowHint(false)
            }}
        >
            <TooltipTrigger asChild>
                <Input
                    type="number"
                    className="min-w-0"
                    value={value}
                    readOnly={!unlocked}
                    aria-label={`${name} — ${t(`pbta:monsterhearts.fields.${field}`)}`}
                    aria-readonly={!unlocked}
                    onClick={() => !unlocked && setShowHint(true)}
                    onDoubleClick={() => {
                        setUnlocked((previous) => !previous)
                        setShowHint(false)
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            setUnlocked((previous) => !previous)
                            setShowHint(false)
                        }
                    }}
                    onBlur={() => setShowHint(false)}
                    onChange={(event) => {
                        const next = Number(event.target.value)
                        if (event.target.value !== '' && Number.isInteger(next))
                            onChange(next)
                    }}
                />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
    )
}

function MonsterheartsStatsEditor() {
    const { playbook, setPlaybook } = useMonsterheartsStore()
    const { statBounds, setStatBounds } = useMonsterheartsView()
    const { t } = useTranslation()

    return (
        <TooltipProvider>
            <div className="space-y-2">
                <div className="grid grid-cols-[4rem_repeat(3,minmax(0,1fr))] gap-1 text-xs text-muted-foreground">
                    <span />
                    <span>{t('pbta:monsterhearts.fields.minimum')}</span>
                    <span>{t('pbta:monsterhearts.fields.value')}</span>
                    <span>{t('pbta:monsterhearts.fields.maximum')}</span>
                </div>
                {Object.entries(playbook.stats).map(([name, value]) => {
                    const bounds = statBounds[name] ?? {
                        minimum: -1,
                        maximum: 3,
                    }
                    const updateBound = (
                        field: 'minimum' | 'maximum',
                        next: number
                    ) =>
                        setStatBounds({
                            ...statBounds,
                            [name]: {
                                ...bounds,
                                [field]:
                                    field === 'minimum'
                                        ? Math.min(next, bounds.maximum)
                                        : Math.max(next, bounds.minimum),
                            },
                        })
                    return (
                        <div
                            key={name}
                            className="grid grid-cols-[4rem_repeat(3,minmax(0,1fr))] items-center gap-1"
                        >
                            <span
                                className="truncate text-sm font-medium"
                                title={name}
                            >
                                {name}
                            </span>
                            <StatBoundInput
                                name={name}
                                field="minimum"
                                value={bounds.minimum}
                                onChange={(next) =>
                                    updateBound('minimum', next)
                                }
                            />
                            <Input
                                type="number"
                                className="min-w-0"
                                min={bounds.minimum}
                                max={bounds.maximum}
                                value={value}
                                aria-label={`${name} — ${t('pbta:monsterhearts.fields.value')}`}
                                onChange={(event) => {
                                    if (event.target.value === '') return
                                    const next = Number(event.target.value)
                                    if (!Number.isInteger(next)) return
                                    setPlaybook({
                                        stats: {
                                            ...playbook.stats,
                                            [name]: Math.min(
                                                bounds.maximum,
                                                Math.max(bounds.minimum, next)
                                            ),
                                        },
                                    })
                                }}
                            />
                            <StatBoundInput
                                name={name}
                                field="maximum"
                                value={bounds.maximum}
                                onChange={(next) =>
                                    updateBound('maximum', next)
                                }
                            />
                        </div>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}

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
                    <div
                        key={index}
                        className="space-y-2 rounded-md border p-2"
                    >
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
                                    variant={
                                        isReference ? 'secondary' : 'ghost'
                                    }
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
                                    variant={
                                        isReference ? 'ghost' : 'secondary'
                                    }
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
                                    onChange(
                                        value.filter((_, i) => i !== index)
                                    )
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

void MonsterheartsMovesEditor

function MonsterheartsConditionsEditor() {
    const { playbook, setPlaybook } = useMonsterheartsStore()
    const { t } = useTranslation()
    const conditions = playbook.conditions
    const updateAt = (
        index: number,
        condition: MonsterheartsPlaybook['conditions'][number]
    ) =>
        setPlaybook({
            conditions: conditions.map((current, currentIndex) =>
                currentIndex === index ? condition : current
            ),
        })
    const moveAt = (index: number, offset: number) => {
        const target = index + offset
        if (target < 0 || target >= conditions.length) return
        const next = [...conditions]
        ;[next[index], next[target]] = [next[target], next[index]]
        setPlaybook({ conditions: next })
    }

    return (
        <div className="space-y-2">
            {conditions.map((condition, index) => (
                <div key={index} className="space-y-2 rounded-md border p-2">
                    <div className="flex items-center gap-1">
                        <div className="flex-1" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('actions.moveUp')}
                            onClick={() => moveAt(index, -1)}
                        >
                            <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('actions.moveDown')}
                            onClick={() => moveAt(index, 1)}
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('actions.removeItem')}
                            onClick={() => {
                                setPlaybook({
                                    conditions: conditions.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index
                                    ),
                                })
                            }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <Label>
                        {t('pbta:monsterhearts.fields.name')}
                        <Input
                            value={condition.name}
                            onChange={(event) =>
                                updateAt(index, {
                                    ...condition,
                                    name: event.target.value,
                                })
                            }
                        />
                    </Label>
                    <Label>
                        {t('pbta:monsterhearts.fields.description')}
                        <Input
                            value={condition.description ?? ''}
                            onChange={(event) => {
                                const description = event.target.value
                                if (description)
                                    updateAt(index, {
                                        ...condition,
                                        description,
                                    })
                                else {
                                    const next = { ...condition }
                                    delete next.description
                                    updateAt(index, next)
                                }
                            }}
                        />
                    </Label>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                    setPlaybook({
                        conditions: [
                            ...conditions,
                            {
                                name: t(
                                    'pbta:monsterhearts.defaults.condition'
                                ),
                            },
                        ],
                    })
                }}
            >
                {t('actions.add')} {t('pbta:monsterhearts.sections.conditions')}
            </Button>
        </div>
    )
}

export function MonsterheartsPlaybookEditorPanel() {
    const { sheet } = useMonsterheartsSheet()
    const { playbook, setPlaybook } = useMonsterheartsStore()
    const { t } = useTranslation()
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
                {Object.entries(playbook.editorial).map(([key, block]) =>
                    key === 'progression' ? null : (
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
                    )
                )}
            </div>
        )
    }
    if (sheet.target === 'moves')
        return <MonsterheartsCollection path="moves" />
    if (sheet.target === 'stats') return <MonsterheartsStatsEditor />
    if (sheet.target === 'advances' || sheet.target === 'ascendants')
        return <MonsterheartsCollection path={sheet.target} />
    if (sheet.target === 'conditions') return <MonsterheartsConditionsEditor />
    return (
        <Label className="grid gap-1 text-sm">
            {t('pbta:monsterhearts.sections.harm')}
            <Input
                type="number"
                min={0}
                value={playbook.harm}
                onChange={(event) => {
                    const next = Number(event.target.value)
                    if (Number.isInteger(next) && next >= 0)
                        setPlaybook({ harm: next })
                }}
            />
        </Label>
    )
}

function MonsterheartsCollection({ path }: { path: string }) {
    const { playbook, setPlaybook } = useMonsterheartsStore()
    const { t } = useTranslation()
    const presentation = getPbtaCollectionPresentation(
        'monsterhearts-playbook',
        path
    )
    const document = playbook as Record<string, unknown>
    const items = presentation && collectionItems(document, presentation)
    if (!presentation || !items)
        return (
            <p className="text-sm text-destructive">
                Invalid published collection configuration.
            </p>
        )
    const collectionLabels = {
        moves: t('pbta:monsterhearts.sections.moves'),
        ascendants: t('pbta:monsterhearts.sections.ascendants'),
        conditions: t('pbta:monsterhearts.sections.conditions'),
        advances: t('pbta:monsterhearts.sections.advances'),
    }
    const fieldLabels = {
        label: 'pbta:monsterhearts.fields.label',
        trigger: 'pbta:monsterhearts.fields.trigger',
        checked: 'pbta:monsterhearts.fields.checked',
        moveType: 'pbta:monsterhearts.fields.moveType',
        name: 'pbta:monsterhearts.fields.name',
        value: 'pbta:monsterhearts.fields.value',
        description: 'pbta:monsterhearts.fields.description',
    } as const
    const localizedPresentation = {
        ...presentation,
        label:
            collectionLabels[path as keyof typeof collectionLabels] ??
            presentation.label,
    }
    const labelFor = (id: string, fallback: string) => {
        const key = fieldLabels[id as keyof typeof fieldLabels]
        return key ? t(key) : fallback
    }
    const createItem = (entry: typeof presentation) => {
        if (entry.path === 'conditions') {
            return { name: t('pbta:monsterhearts.defaults.condition') }
        }
        return undefined
    }
    return (
        <PublishedCollectionEditor
            presentation={localizedPresentation}
            items={items}
            labelFor={labelFor}
            createItem={createItem}
            onChange={(next) =>
                setPlaybook(
                    replaceCollectionItems(
                        document,
                        presentation,
                        next
                    ) as Partial<typeof playbook>
                )
            }
        />
    )
}
