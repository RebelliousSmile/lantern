import { Checkbox } from '@/components/ui/checkbox'
import { useUiText } from '@/i18n/text'
import { useMonsterheartsView } from '../hooks'
import { sections } from '../model'
export function MonsterheartsPlaybookAppearancePanel() {
    const { hidden, setHidden } = useMonsterheartsView()
    const text = useUiText()
    return (
        <div className="space-y-2">
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
