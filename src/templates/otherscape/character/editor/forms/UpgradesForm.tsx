import { useUiText } from '@/i18n/text'
import { useTranslation } from 'react-i18next'
import { zoneLabel } from '../../zoneLabels'

/* The Upgrades rule is the same text on every sheet and is not part of the
   file, so this zone only shows it. The wording comes from the published
   schema, in the language of the interface. */
export default function UpgradesForm() {
    const text = useUiText()
    const { i18n } = useTranslation()
    const language = i18n.resolvedLanguage

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold">
                {zoneLabel('upgrades', language)}
            </h3>
            <p className="text-sm">{zoneLabel('upgrades_rule', language)}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>{zoneLabel('upgrade_power_tag', language)}</li>
                <li>{zoneLabel('upgrade_special', language)}</li>
            </ul>
            <p className="text-xs text-muted-foreground">
                {text('otherscape:forms.character.upgrades.readOnly')}
            </p>
        </div>
    )
}
