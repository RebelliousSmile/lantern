import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeKitSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import DescriptionForm from './forms/DescriptionForm'
import MetaForm from './forms/MetaForm'
import QuestForm from './forms/QuestForm'
import SpecialForm from './forms/SpecialForm'
import TagsForm from './forms/TagsForm'

export function ThemeKitEditorPanel() {
    const text = useUiText()
    const { open, target } = useOtherscapeThemeKitSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('otherscape:forms.themeKit.editorPanel.emptyState')}
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
        case 'description':
            return <DescriptionForm />
        case 'quest':
            return <QuestForm />
        case 'special':
            return <SpecialForm />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
