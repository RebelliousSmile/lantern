import { Checkbox } from '@/components/ui/checkbox'
import { useUiText } from '@/i18n/text'
import { PBTA_MONSTERHEARTS_APPEARANCE } from 'schema-pbta'
import { useMonsterheartsView } from '../hooks'
import { sections } from '../model'
export function MonsterheartsPlaybookAppearancePanel() {
    const { appearanceVariant, hidden, setAppearanceVariant, setHidden } =
        useMonsterheartsView()
    const text = useUiText()
    return (
        <div className="space-y-2">
            <label className="grid gap-1 text-sm">
                Appearance
                <select
                    value={appearanceVariant}
                    onChange={(event) =>
                        setAppearanceVariant(
                            event.target.value as typeof appearanceVariant
                        )
                    }
                >
                    {PBTA_MONSTERHEARTS_APPEARANCE.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                            {variant.id === 'base' ? 'Base' : 'Drowned Lake'}
                        </option>
                    ))}
                </select>
            </label>
            {sections.map((s) => (
                <label className="flex gap-2" key={s.id}>
                    <Checkbox
                        checked={!hidden[s.id]}
                        onCheckedChange={(v) => setHidden(s.id, !v)}
                    />
                    {text(s.label)}
                </label>
            ))}
        </div>
    )
}
