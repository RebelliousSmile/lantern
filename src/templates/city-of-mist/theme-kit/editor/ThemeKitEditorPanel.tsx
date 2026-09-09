import { useCityOfMistThemeKitSheetStore } from '../hooks'
import ConceptForm from './forms/ConceptForm'
import CrewRelationshipsForm from './forms/CrewRelationshipsForm'
import IdentityForm from './forms/IdentityForm'
import ImprovementsForm from './forms/ImprovementsForm'
import MetaForm from './forms/MetaForm'
import MotivationForm from './forms/MotivationForm'
import QuestionsForm from './forms/QuestionsForm'

export function ThemeKitEditorPanel() {
    const { open, target } = useCityOfMistThemeKitSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'identity':
            return <IdentityForm />
        case 'introduction':
        case 'concept':
        case 'extraTags':
        case 'titleGuidance':
            return <ConceptForm />
        case 'powerTags':
            return (
                <QuestionsForm
                    key="power"
                    field="power"
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'weaknessTags':
            return (
                <QuestionsForm
                    key="weakness"
                    field="weakness"
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'motivation':
            return <MotivationForm />
        case 'crewRelationships':
            return (
                <CrewRelationshipsForm
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'improvements':
            return (
                <ImprovementsForm
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
