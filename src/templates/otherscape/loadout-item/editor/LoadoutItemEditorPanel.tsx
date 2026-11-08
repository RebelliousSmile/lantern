import { useUiText } from '@/i18n/text'
import { useOtherscapeLoadoutItemSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import MetaForm from './forms/MetaForm'
import TagsForm from './forms/TagsForm'

export function LoadoutItemEditorPanel() {
    const text = useUiText()
    const { open, target } = useOtherscapeLoadoutItemSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('otherscape:forms.loadoutItem.editorPanel.emptyState')}
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
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
