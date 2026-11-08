import { useUiText } from '@/i18n/text'
import { useCityOfMistDangerStore } from '../../hooks'
import MoveListForm from './MoveListForm'

export default function SoftMovesForm({ focusIndex }: { focusIndex?: number }) {
    const text = useUiText()
    const {
        cityOfMistDanger,
        addSoftMove,
        updateSoftMoveAt,
        removeSoftMoveAt,
        moveSoftMove,
    } = useCityOfMistDangerStore()

    return (
        <MoveListForm
            values={cityOfMistDanger.soft_moves}
            focusIndex={focusIndex}
            addLabel={text('city:forms.danger.softMoves.add')}
            emptyPlaceholder={text('city:forms.danger.softMoves.placeholder')}
            fieldLabel={text('city:forms.danger.softMoves.field')}
            defaultValue="Describe a soft move."
            addValue={addSoftMove}
            updateValue={updateSoftMoveAt}
            removeValue={removeSoftMoveAt}
            moveValue={moveSoftMove}
        />
    )
}
