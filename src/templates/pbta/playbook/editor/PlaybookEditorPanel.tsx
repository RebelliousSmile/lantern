import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useUiText } from '@/i18n/text'
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
    const text = useUiText()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('pbta:forms.shared.panel.emptyState')}
            </div>
        )
    }

    if (!gameDefinition) {
        return (
            <div className="space-y-3">
                <Alert>
                    <Info />
                    <AlertTitle>
                        {text('pbta:forms.playbook.readOnly.title')}
                    </AlertTitle>
                    <AlertDescription>
                        {text('pbta:forms.playbook.readOnly.description', {
                            game: playbook.game,
                        })}
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
