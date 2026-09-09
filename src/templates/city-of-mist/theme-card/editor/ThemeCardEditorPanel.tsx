import { useCityOfMistThemeCardSheetStore } from '../hooks'
import IdentityForm from './forms/IdentityForm'
import ImprovementsForm from './forms/ImprovementsForm'
import MetaForm from './forms/MetaForm'
import MotivationForm from './forms/MotivationForm'
import TagsForm from './forms/TagsForm'
import TracksForm from './forms/TracksForm'

export function ThemeCardEditorPanel() {
    const { open, target } = useCityOfMistThemeCardSheetStore()

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
        case 'motivation':
            return <MotivationForm />
        case 'tracks':
            return <TracksForm />
        case 'powerTags':
            return (
                <TagsForm
                    key="power"
                    field="power"
                    focusIndex={target.index}
                    autoCreate={target.mode === 'create'}
                />
            )
        case 'weaknessTags':
            return (
                <TagsForm
                    key="weakness"
                    field="weakness"
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
