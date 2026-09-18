import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttributeField } from '@/templates/pbta/shared/attributeField'
import { useGameDefinitionForGame } from '@/templates/pbta/shared/gameDefinition'
import { StructuredJsonEditor } from '@/templates/shared/StructuredJsonEditor'
import { useState } from 'react'
import {
    useUrbanShadowsPlaybookStore,
    useUrbanShadowsSheetStore,
} from '../hooks'
export function UrbanShadowsPlaybookEditorPanel() {
    const { open, target } = useUrbanShadowsSheetStore()
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    const game = useGameDefinitionForGame(playbook.game)
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                Click a sheet section to edit it.
            </p>
        )
    if (!game)
        return (
            <Alert>
                <AlertTitle>Game definition required</AlertTitle>
                <AlertDescription>
                    Open the matching Urban Shadows game definition tab before
                    editing this playbook.
                </AlertDescription>
            </Alert>
        )
    if (target.kind === 'basic')
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
    if (target.kind === 'moves')
        return <div className="space-y-2">{playbook.moves.map((move, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={move.checked === true} onCheckedChange={(checked) => setPlaybook({ moves: playbook.moves.map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) })} />{move.name}</Label>
        ))}</div>
    if (target.kind === 'advancement')
        return <div className="space-y-2">{playbook.advancement.map((entry, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={entry.checked === true} onCheckedChange={(checked) => setPlaybook({ advancement: playbook.advancement.map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) })} />{entry.label}</Label>
        ))}</div>
    if (target.kind === 'corruption')
        return <div className="space-y-2">{playbook.corruption.advances.map((entry, index) => (
            <Label key={index} className="flex items-center gap-2"><Checkbox checked={entry.checked === true} onCheckedChange={(checked) => setPlaybook({ corruption: { ...playbook.corruption, advances: playbook.corruption.advances.map((item, i) => i === index ? { ...item, ...(checked === true ? { checked: true } : { checked: undefined }) } : item) } })} />{entry.label}</Label>
        ))}</div>
    if (target.kind === 'creation')
        return <UrbanShadowsCreationForm />
    if (target.kind === 'relationships') {
        const attribute = game.character.attributes?.mortalRelationships
        if (!attribute || attribute.type !== 'ListMany')
            return (
                <Alert>
                    <AlertTitle>Invalid relationship destination</AlertTitle>
                    <AlertDescription>
                        The matching game definition must provide a ListMany
                        mortalRelationships attribute.
                    </AlertDescription>
                </Alert>
            )
        return (
            <AttributeField
                id="urban-shadows-mortal-relationships"
                attribute={{
                    ...attribute,
                    options: playbook.mortalRelationships.map(
                        (relationship) => relationship.key
                    ),
                }}
                value={playbook.attributes.mortalRelationships}
                onChange={(value) =>
                    setPlaybook({
                        attributes: {
                            ...playbook.attributes,
                            mortalRelationships: Array.isArray(value)
                                ? value
                                : [],
                        },
                    })
                }
            />
        )
    }
    const key = target.kind
    return (
        <StructuredJsonEditor
            id={`urban-shadows-${key}`}
            label={key}
            value={(playbook as Record<string, unknown>)[key]}
            onValidValue={(value) =>
                setPlaybook({ [key]: value } as Partial<typeof playbook>)
            }
        />
    )
}

function UrbanShadowsCreationForm() {
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    const game = useGameDefinitionForGame(playbook.game)
    const [answers, setAnswers] = useState<Record<number, string[]>>({})

    return (
        <div className="space-y-4">
            {playbook.creation.map((question, index) => {
                const selected = answers[index] ?? []
                const min = question.selection?.min ?? 1
                const max = question.selection?.max ?? 1
                const target = question.attribute
                    ? game?.character.attributes?.[question.attribute]
                    : undefined
                const validDestination =
                    max > 1 && target?.type === 'ListMany'
                const selectedWithinBounds =
                    selected.length >= min && selected.length <= max
                const choose = (next: string[]) =>
                    setAnswers({ ...answers, [index]: next })
                const apply = () => {
                    if (
                        !question.attribute ||
                        !validDestination ||
                        !selectedWithinBounds
                    ) return
                    setPlaybook({
                        attributes: {
                            ...playbook.attributes,
                            [question.attribute]: selected,
                        },
                    })
                }

                return (
                    <fieldset key={index} className="space-y-2 rounded-md border p-3">
                        <legend className="px-1 text-sm font-medium">
                            {question.label}
                        </legend>
                        {question.options.map((option) => {
                            const value =
                                typeof option === 'string' ? option : option.value
                            const label =
                                typeof option === 'string' ? option : option.label
                            const relationship = playbook.mortalRelationships.find(
                                (entry) => entry.key === value
                            )
                            return (
                                <div key={value} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selected.includes(value)}
                                            onCheckedChange={(next) => {
                                                if (next !== true)
                                                    return choose(
                                                        selected.filter(
                                                            (item) => item !== value
                                                        )
                                                    )
                                                if (selected.length < max)
                                                    choose([...selected, value])
                                            }}
                                        />
                                        <Label>{label}</Label>
                                    </div>
                                    {relationship?.description && (
                                        <p className="pl-6 text-sm text-muted-foreground">
                                            {relationship.description}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                        {question.attribute && !validDestination ? (
                            <p className="text-sm text-destructive">
                                This question must target an available ListMany attribute.
                            </p>
                        ) : null}
                        {question.attribute ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={!validDestination || !selectedWithinBounds}
                                onClick={apply}
                            >
                                Apply selection
                            </Button>
                        ) : null}
                    </fieldset>
                )
            })}
        </div>
    )
}
