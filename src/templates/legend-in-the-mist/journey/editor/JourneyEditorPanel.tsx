import { useLegendInTheMistJourneySheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import BenefitsForm from './forms/BenefitsForm'
import ConsequencesForm from './forms/ConsequencesForm'
import MetaForm from './forms/MetaForm'
import TagsForm from './forms/TagsForm'
import VignettesForm from './forms/VignettesForm'

/* One form per region of the spread. Each form owns its own section of the
   document and reaches for nothing else, so editing a vignette never rewrites
   the journey-wide list. */
export function JourneyEditorPanel() {
    const { open, target } = useLegendInTheMistJourneySheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the spread to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'tags':
            return (
                <TagsForm
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'benefits':
            return <BenefitsForm />
        case 'consequences':
            return (
                <ConsequencesForm
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'vignettes':
            return (
                <VignettesForm
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
