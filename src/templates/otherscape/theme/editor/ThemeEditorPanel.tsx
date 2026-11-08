import { useUiText } from '@/i18n/text'
import DescriptionForm from '../../shared/DescriptionForm'
import SpecialForm from '../../shared/SpecialForm'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
    type SheetTarget,
} from '../hooks'
import BasicForm from './forms/BasicForm'
import MetaForm from './forms/MetaForm'
import QuestForm from './forms/QuestForm'
import TagsForm from './forms/TagsForm'
import TracksForm from './forms/TracksForm'

function ThemeDescriptionForm() {
    const { otherscapeTheme, setDescription } = useOtherscapeThemeStore()

    return (
        <DescriptionForm
            idPrefix="os-theme"
            value={otherscapeTheme.description}
            onChange={setDescription}
        />
    )
}

function ThemeSpecialForm() {
    const { otherscapeTheme, setSpecial } = useOtherscapeThemeStore()

    return (
        <SpecialForm
            idPrefix="os-theme"
            special={otherscapeTheme.special}
            onChange={setSpecial}
        />
    )
}

/** The fields of the one zone a click hit: the form the theme's own panel and a character's theme share. */
export function ThemeZoneForm({ target }: { target: SheetTarget }) {
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
        case 'description':
            return <ThemeDescriptionForm />
        case 'special':
            return <ThemeSpecialForm />
        case 'tracks':
            return <TracksForm focusField={target.field} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}

export function ThemeEditorPanel() {
    const text = useUiText()
    const { open, target } = useOtherscapeThemeSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('otherscape:forms.theme.panel.emptyState')}
            </div>
        )
    }

    return <ThemeZoneForm target={target} />
}
