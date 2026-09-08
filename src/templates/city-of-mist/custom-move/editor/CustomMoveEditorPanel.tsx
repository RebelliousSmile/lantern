import { useCityOfMistCustomMoveSheetStore } from '../hooks'
import MetaForm from './forms/MetaForm'
import OutcomesForm from './forms/OutcomesForm'
import RollForm from './forms/RollForm'
import TriggerForm from './forms/TriggerForm'

export function CustomMoveEditorPanel() {
    const { open, target } = useCityOfMistCustomMoveSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        // The header and the trigger are written together at the table, so
        // clicking either one opens the same form.
        case 'basic':
        case 'trigger':
            return <TriggerForm />
        case 'roll':
            return <RollForm />
        case 'outcomes':
            return <OutcomesForm focusIndex={target.index} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
