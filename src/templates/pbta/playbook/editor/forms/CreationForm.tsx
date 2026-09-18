import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
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
                const max = question.selection?.max ?? 1
                const validTextTarget =
                    max === 1 &&
                    target !== undefined &&
                    (target.type === 'Text' || target.type === 'LongText')
                const choose = (next: string[]) => {
                    setAnswers({ ...answers, [index]: next })
                }
                const apply = () => {
                    if (
                        !question.attribute ||
                        !target ||
                        !validTextTarget ||
                        selected.length !== 1
                    ) return
                    setAttributes({ ...playbook.attributes, [question.attribute]: selected[0] ?? '' })
                }
                return <fieldset key={index} className="space-y-2 rounded-md border p-3">
                    <legend className="px-1 text-sm font-medium">{question.label}</legend>
                    {question.options.map((option) => {
                        const value = typeof option === 'string' ? option : option.value
                        const label = typeof option === 'string' ? option : option.label
                        return <div key={value} className="flex items-center gap-2">
                            <Checkbox checked={selected.includes(value)} onCheckedChange={(next) => {
                                if (next !== true) return choose(selected.filter((item) => item !== value))
                                if (max === 1) return choose([value])
                                if (selected.length < max) choose([...selected, value])
                            }} />
                            <Label>{label}</Label>
                        </div>
                    })}
                    {question.attribute && !validTextTarget ? (
                        <p className="text-sm text-destructive">
                            This question must target an available Text or LongText attribute in the matching game definition.
                        </p>
                    ) : null}
                    {question.attribute ? <Button type="button" size="sm" disabled={!validTextTarget || selected.length !== 1} onClick={apply}>Apply selection</Button> : null}
                </fieldset>
            })}
        </div>
    )
}
