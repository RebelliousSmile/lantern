import { useUiText } from '@/i18n/text'
import DescriptionForm from '../../shared/DescriptionForm'
import SpecialForm from '../../shared/SpecialForm'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../hooks'
import BasicForm from './forms/BasicForm'
import MetaForm from './forms/MetaForm'
import QuestForm from './forms/QuestForm'
import TagsForm from './forms/TagsForm'

function KitDescriptionForm() {
    const { otherscapeThemeKit, setDescription } = useOtherscapeThemeKitStore()

    return (
        <DescriptionForm
            idPrefix="os-theme-kit"
            value={otherscapeThemeKit.description}
            onChange={setDescription}
        />
    )
}

function KitSpecialForm() {
    const { otherscapeThemeKit, setSpecial } = useOtherscapeThemeKitStore()

    return (
        <SpecialForm
            idPrefix="os-theme-kit"
            special={otherscapeThemeKit.special}
            onChange={setSpecial}
        />
    )
}

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
            return <KitDescriptionForm />
        case 'quest':
            return <QuestForm />
        case 'special':
            return <KitSpecialForm />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
