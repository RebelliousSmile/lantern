import { useUiText } from '@/i18n/text'
import { useCityOfMistDangerStore } from '../../hooks'
import MoveListForm from './MoveListForm'

export default function HardMovesForm({ focusIndex }: { focusIndex?: number }) {
    const text = useUiText()
    const {
        cityOfMistDanger,
        addHardMove,
        updateHardMoveAt,
        removeHardMoveAt,
        moveHardMove,
    } = useCityOfMistDangerStore()

    return (
        <MoveListForm
            values={cityOfMistDanger.hard_moves}
            focusIndex={focusIndex}
            addLabel={text('city:forms.danger.hardMoves.add')}
            emptyPlaceholder={text('city:forms.danger.hardMoves.placeholder')}
            fieldLabel={text('city:forms.danger.hardMoves.field')}
            defaultValue="Describe a hard move."
            addValue={addHardMove}
            updateValue={updateHardMoveAt}
            removeValue={removeHardMoveAt}
            moveValue={moveHardMove}
        />
    )
}
