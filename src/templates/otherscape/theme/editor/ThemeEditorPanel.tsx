import { useOtherscapeThemeSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import MetaForm from './forms/MetaForm'
import QuestForm from './forms/QuestForm'
import TagsForm from './forms/TagsForm'
import TracksForm from './forms/TracksForm'

export function ThemeEditorPanel() {
    const { open, target } = useOtherscapeThemeSheetStore()

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
        case 'tracks':
            return <TracksForm focusField={target.field} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
