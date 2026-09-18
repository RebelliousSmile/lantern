import { Label } from '@/components/ui/label'
import { StringListEditor } from '../../../shared/StringListEditor'
import { usePlaybookSheetStore, usePlaybookStore } from '../../hooks'
import { MovesEditor } from '../MovesEditor'

export default function MovesForm() {
    const { playbook, setMoves, setStartingMoves } = usePlaybookStore()
    const { target } = usePlaybookSheetStore()
    const focusIndex = target?.kind === 'moves' ? target.index : undefined

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Moves</Label>
                <MovesEditor
                    value={playbook.moves}
                    onChange={setMoves}
                    focusIndex={focusIndex}
                />
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    Starting moves
                </Label>
                <StringListEditor
                    value={playbook.startingMoves}
                    onChange={setStartingMoves}
                    placeholder="Add move slug and press Enter"
                />
            </div>
        </div>
    )
}
