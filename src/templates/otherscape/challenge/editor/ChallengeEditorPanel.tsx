import { useUiText } from '@/i18n/text'
import { useOtherscapeChallengeSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import ConsequencesForm from './forms/ConsequencesForm'
import LimitsForm from './forms/LimitsForm'
import MetaForm from './forms/MetaForm'
import SpecialsForm from './forms/SpecialsForm'
import TagsForm from './forms/TagsForm'
import ThreatsForm from './forms/ThreatsForm'

export function ChallengeEditorPanel() {
    const text = useUiText()
    const { open, target } = useOtherscapeChallengeSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('otherscape:forms.challenge.panel.emptyState')}
            </div>
        )
    }

    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'tags':
            return <TagsForm focusIndex={target.index} />
        case 'limits':
            return <LimitsForm focusIndex={target.index} />
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
