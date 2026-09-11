import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useGameDefinitionForGame } from '../../shared/gameDefinition'
import { usePlaybookSheetStore, usePlaybookStore } from '../hooks'
import AdvancementForm from './forms/AdvancementForm'
import BasicForm from './forms/BasicForm'
import ChoiceSetsForm from './forms/ChoiceSetsForm'
import CreationForm from './forms/CreationForm'
import GearForm from './forms/GearForm'
import MovesForm from './forms/MovesForm'
import StatsForm from './forms/StatsForm'

function renderForm(kind: string) {
    switch (kind) {
        case 'basic':
            return <BasicForm />
        case 'stats':
            return <StatsForm />
        case 'moves':
            return <MovesForm />
        case 'choiceSets':
            return <ChoiceSetsForm />
        case 'advancement':
            return <AdvancementForm />
        case 'creation':
            return <CreationForm />
        case 'gear':
            return <GearForm />
        default:
            return null
    }
}

export function PlaybookEditorPanel() {
    const { open, target } = usePlaybookSheetStore()
    const { playbook } = usePlaybookStore()
    const gameDefinition = useGameDefinitionForGame(playbook.game)

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    if (!gameDefinition) {
        return (
            <div className="space-y-3">
                <Alert>
                    <Info />
                    <AlertTitle>Read-only</AlertTitle>
                    <AlertDescription>
                        Open the "{playbook.game}" game definition tab to edit
                        this playbook. Without it, its stats and moves can't be
                        validated against the game, so editing is disabled.
                    </AlertDescription>
                </Alert>
                <fieldset disabled className="space-y-4">
                    {renderForm(target.kind)}
                </fieldset>
            </div>
        )
    }

    return renderForm(target.kind)
}
