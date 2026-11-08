import { useUiText } from '@/i18n/text'
import { useOtherscapeCharacterSheetStore, type SheetTarget } from '../hooks'
import BasicForm from './forms/BasicForm'
import ComboForm from './forms/ComboForm'
import LoadoutForm from './forms/LoadoutForm'
import MetaForm from './forms/MetaForm'
import ThemeZone from './forms/ThemeZone'
import ThemesForm from './forms/ThemesForm'
import UpgradesForm from './forms/UpgradesForm'

/** The fields of the one zone a click hit, and nothing else on the sheet. */
function CharacterZoneForm({ target }: { target: SheetTarget }) {
    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'upgrades':
            return <UpgradesForm />
        case 'combo':
            return target.index == null ? null : (
                /* Remounting on the combo keeps the tag field's draft to it. */
                <ComboForm key={target.index} index={target.index} />
            )
        case 'loadout':
            return (
                <LoadoutForm
                    key={target.index ?? 'all'}
                    focusIndex={target.index}
                />
            )
        case 'themes':
            return <ThemesForm />
        case 'theme':
            return (
                <ThemeZone
                    key={`${target.index}:${target.zone.kind}`}
                    index={target.index}
                    zone={target.zone}
                />
            )
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}

export function CharacterEditorPanel() {
    const text = useUiText()
    const { open, target } = useOtherscapeCharacterSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('otherscape:forms.character.panel.emptyState')}
            </div>
        )
    }

    return <CharacterZoneForm target={target} />
}
