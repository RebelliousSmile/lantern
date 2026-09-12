import { useGameDefinitionSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import CharacterForm from './forms/CharacterForm'
import FrontsForm from './forms/FrontsForm'
import McForm from './forms/McForm'
import NpcForm from './forms/NpcForm'
import RollForm from './forms/RollForm'

export function GameDefinitionEditorPanel() {
    const { open, target } = useGameDefinitionSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'roll':
            return <RollForm />
        case 'character':
            return <CharacterForm />
        case 'npc':
            return <NpcForm />
        case 'mc':
            return <McForm />
        case 'fronts':
            return <FrontsForm />
        default:
            return null
    }
}
