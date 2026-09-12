import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGameDefinitionStore } from '../../hooks'
import { RollResultsEditor } from '../RollResultsEditor'

function ModField({
    id,
    label,
    value,
    onChange,
}: {
    id: string
    label: string
    value: number | null
    onChange: (value: number | null) => void
}) {
    return (
        <div className="grid gap-1">
            <Label htmlFor={id}>
                {label}{' '}
                <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
                id={id}
                className="h-8 px-2 text-sm"
                type="number"
                value={value ?? ''}
                onChange={(event) => {
                    const raw = event.target.value
                    onChange(raw === '' ? null : Math.floor(Number(raw) || 0))
                }}
            />
        </div>
    )
}

export default function RollForm() {
    const { gameDefinition, setGameDefinition } = useGameDefinitionStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="pbta-def-roll-formula">Roll formula</Label>
                <Input
                    id="pbta-def-roll-formula"
                    className="h-8 px-2 text-sm"
                    value={gameDefinition.rollFormula}
                    onChange={(event) =>
                        setGameDefinition({ rollFormula: event.target.value })
                    }
                    placeholder="e.g., 2d6"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <ModField
                    id="pbta-def-min-mod"
                    label="Min modifier"
                    value={gameDefinition.minMod}
                    onChange={(minMod) => setGameDefinition({ minMod })}
                />
                <ModField
                    id="pbta-def-max-mod"
                    label="Max modifier"
                    value={gameDefinition.maxMod}
                    onChange={(maxMod) => setGameDefinition({ maxMod })}
                />
            </div>

            <div className="grid gap-1">
                <Label>Roll results</Label>
                <RollResultsEditor
                    value={gameDefinition.rollResults}
                    onChange={(rollResults) =>
                        setGameDefinition({ rollResults })
                    }
                />
            </div>
        </div>
    )
}
