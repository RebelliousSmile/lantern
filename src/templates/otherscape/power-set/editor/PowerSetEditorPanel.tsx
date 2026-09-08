import { useOtherscapePowerSetSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import ConsequencesForm from './forms/ConsequencesForm'
import MetaForm from './forms/MetaForm'
import SpecialsForm from './forms/SpecialsForm'
import ThreatsForm from './forms/ThreatsForm'

export function PowerSetEditorPanel() {
    const { open, target } = useOtherscapePowerSetSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the card to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'specials':
            return <SpecialsForm focusIndex={target.index} />
        case 'threats':
            return <ThreatsForm focusIndex={target.index} />
        case 'consequences':
            return <ConsequencesForm focusIndex={target.index} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
