import { useOtherscapeCharacterTropeSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import ChoicesForm from './forms/ChoicesForm'
import LoadoutForm from './forms/LoadoutForm'
import MetaForm from './forms/MetaForm'
import ThemeKitsForm from './forms/ThemeKitsForm'

export function CharacterTropeEditorPanel() {
    const { open, target } = useOtherscapeCharacterTropeSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the card to edit a specific section.
            </div>
        )
    }

    /* The two kit lists share an entry shape but never a form: each case below
       edits its own list, so a choice added here cannot land among the granted
       kits. */
    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'themeKits':
            return <ThemeKitsForm focusIndex={target.index} />
        case 'choices':
            return <ChoicesForm focusIndex={target.index} />
        case 'loadout':
            return <LoadoutForm focusIndex={target.index} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
