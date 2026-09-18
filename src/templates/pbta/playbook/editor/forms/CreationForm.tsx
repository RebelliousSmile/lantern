import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useGameDefinitionForGame } from '../../../shared/gameDefinition'
import { usePlaybookStore } from '../../hooks'

export default function CreationForm() {
    const { playbook, setAttributes } = usePlaybookStore()
    const game = useGameDefinitionForGame(playbook.game)
    const [answers, setAnswers] = useState<Record<number, string[]>>({})

    return (
        <div className="space-y-4">
            {playbook.creation.map((question, index) => {
                const selected = answers[index] ?? []
                const target = question.attribute
                    ? game?.character.attributes?.[question.attribute]
                    : undefined
                const min = question.selection?.min ?? 1
                const max = question.selection?.max ?? 1
                const validScalarTarget =
                    max === 1 &&
                    target !== undefined &&
                    (target.type === 'Text' || target.type === 'LongText')
                const validListTarget = max > 1 && target?.type === 'ListMany'
                const selectedWithinBounds =
                    selected.length >= min && selected.length <= max
                const choose = (next: string[]) => {
                    setAnswers({ ...answers, [index]: next })
                }
                const apply = () => {
                    if (
                        !question.attribute ||
                        !target ||
                        !selectedWithinBounds ||
                        (validScalarTarget && selected.length !== 1) ||
                        (!validScalarTarget && !validListTarget)
                    )
                        return
                    setAttributes({
                        ...playbook.attributes,
                        [question.attribute]: validScalarTarget
                            ? (selected[0] ?? '')
                            : selected,
                    })
                }
                return (
                    <fieldset
                        key={index}
                        className="space-y-2 rounded-md border p-3"
                    >
                        <legend className="px-1 text-sm font-medium">
                            {question.label}
                        </legend>
                        {question.options.map((option) => {
                            const value =
                                typeof option === 'string'
                                    ? option
                                    : option.value
                            const label =
                                typeof option === 'string'
                                    ? option
                                    : option.label
                            return (
                                <div
                                    key={value}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        checked={selected.includes(value)}
                                        onCheckedChange={(next) => {
                                            if (next !== true)
                                                return choose(
                                                    selected.filter(
                                                        (item) => item !== value
                                                    )
                                                )
                                            if (max === 1)
                                                return choose([value])
                                            if (selected.length < max)
                                                choose([...selected, value])
                                        }}
                                    />
                                    <Label>{label}</Label>
                                </div>
                            )
                        })}
                        {question.attribute &&
                        !validScalarTarget &&
                        !validListTarget ? (
                            <p className="text-sm text-destructive">
                                This question must target an available Text or
                                LongText attribute for one answer, or a ListMany
                                attribute for multiple answers.
                            </p>
                        ) : null}
                        {question.attribute ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={
                                    !selectedWithinBounds ||
                                    (validScalarTarget
                                        ? selected.length !== 1
                                        : !validListTarget)
                                }
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
