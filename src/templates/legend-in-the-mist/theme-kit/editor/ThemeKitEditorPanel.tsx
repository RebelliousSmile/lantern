import { useLegendInTheMistThemeKitSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import ImprovementsForm from './forms/ImprovementsForm'
import MetaForm from './forms/MetaForm'
import QuestForm from './forms/QuestForm'
import TagsForm from './forms/TagsForm'

export function ThemeKitEditorPanel() {
    const { open, target } = useLegendInTheMistThemeKitSheetStore()

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
        case 'tags':
            return (
                /* Remounting on the field keeps each list's inline editor to
                   itself when the card jumps from one run to the other. */
                <TagsForm
                    key={target.field}
                    field={target.field}
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'quest':
            return <QuestForm />
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
