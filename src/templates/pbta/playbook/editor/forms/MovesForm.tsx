import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { StringListEditor } from '../../../shared/StringListEditor'
import { usePlaybookSheetStore, usePlaybookStore } from '../../hooks'
import { MovesEditor } from '../MovesEditor'

export default function MovesForm() {
    const { playbook, setMoves, setStartingMoves } = usePlaybookStore()
    const { target } = usePlaybookSheetStore()
    const text = useUiText()
    const focusIndex = target?.kind === 'moves' ? target.index : undefined

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.movesForm.moves')}
                </Label>
                <MovesEditor
                    value={playbook.moves}
                    onChange={setMoves}
                    focusIndex={focusIndex}
                />
            </div>

            <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">
                    {text('pbta:forms.playbook.movesForm.startingMoves')}
                </Label>
                <StringListEditor
                    value={playbook.startingMoves}
                    onChange={setStartingMoves}
                    placeholder={text(
                        'pbta:forms.playbook.movesForm.slugPlaceholder'
                    )}
                />
            </div>
        </div>
    )
}
